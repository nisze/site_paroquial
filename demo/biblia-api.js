// ===== INTEGRAÇÃO COM API DA BÍBLIA =====
// API pública gratuita: https://bible-api.com/

class BibliaAPI {
    constructor() {
        this.baseURL = 'https://bible-api.com';
        this.cache = new Map(); // Cache local para melhor performance
    }

    // Buscar capítulo específico
    async buscarCapitulo(livro, capitulo, versao = 'almeida') {
        const chave = `${livro}_${capitulo}_${versao}`;
        
        // Verificar cache primeiro
        if (this.cache.has(chave)) {
            return this.cache.get(chave);
        }

        // Tentar API em português primeiro
        let capituloProcessado = await this.tentarAPIPortugues(livro, capitulo);
        
        if (!capituloProcessado) {
            // Fallback para API em inglês
            capituloProcessado = await this.tentarAPIIngles(livro, capitulo, versao);
        }
        
        if (!capituloProcessado) {
            // Último fallback para dados locais
            capituloProcessado = this.getFallbackData(livro, capitulo);
        }

        // Salvar no cache se encontrou algo
        if (capituloProcessado) {
            this.cache.set(chave, capituloProcessado);
        }

        return capituloProcessado;
    }

    // Tentar API em português (dados locais expandidos)
    async tentarAPIPortugues(livro, capitulo) {
        console.log(`🇧🇷 Tentando carregar ${livro} ${capitulo} em português...`);
        
        // Por enquanto, usar dados locais expandidos
        // No futuro, aqui iria uma API brasileira real
        return this.getFallbackData(livro, capitulo);
    }

    // Tentar API em inglês (bible-api.com)
    async tentarAPIIngles(livro, capitulo, versao) {
        try {
            console.log(`🇺🇸 Tentando carregar ${livro} ${capitulo} da API em inglês...`);
            
            const response = await fetch(`${this.baseURL}/${livro}+${capitulo}?translation=${versao}`);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processarCapitulo(data);
            
        } catch (error) {
            console.warn('Erro na API inglês:', error);
            return null;
        }
    }

    // Buscar versículo específico
    async buscarVersiculo(livro, capitulo, versiculo, versao = 'almeida') {
        try {
            const response = await fetch(`${this.baseURL}/${livro}+${capitulo}:${versiculo}?translation=${versao}`);
            const data = await response.json();
            return this.processarVersiculo(data);
        } catch (error) {
            console.error('Erro ao buscar versículo:', error);
            return null;
        }
    }

    // Buscar múltiplos versículos
    async buscarVersiculos(livro, capitulo, versiculoInicio, versiculoFim, versao = 'almeida') {
        try {
            const response = await fetch(`${this.baseURL}/${livro}+${capitulo}:${versiculoInicio}-${versiculoFim}?translation=${versao}`);
            const data = await response.json();
            return this.processarCapitulo(data);
        } catch (error) {
            console.error('Erro ao buscar versículos:', error);
            return null;
        }
    }

    // Buscar texto por palavra ou frase
    async buscarTexto(palavraChave, opcoes = {}) {
        const { 
            buscaExata = false, 
            testamentoAtual = null, 
            versao = 'almeida',
            limite = 50
        } = opcoes;

        console.log(`🔍 Buscando "${palavraChave}" na Bíblia...`);
        
        const resultados = [];
        
        // 1. Buscar na API online primeiro
        const resultadosAPI = await this.buscarNaAPI(palavraChave, versao, limite);
        if (resultadosAPI.length > 0) {
            resultados.push(...resultadosAPI);
        }
        
        // 2. Complementar com busca local nos dados de fallback
        const resultadosLocais = this.buscarNosTextosSalvos(palavraChave, buscaExata);
        resultados.push(...resultadosLocais);
        
        // 3. Filtrar por testamento se necessário
        let resultadosFiltrados = resultados;
        if (testamentoAtual) {
            resultadosFiltrados = this.filtrarPorTestamento(resultados, testamentoAtual);
        }
        
        // 4. Remover duplicatas e ordenar
        const resultadosFinais = this.removerDuplicatasEOrdenar(resultadosFiltrados);
        
        console.log(`📊 Encontrados ${resultadosFinais.length} resultados para "${palavraChave}"`);
        return resultadosFinais.slice(0, limite);
    }

    // Buscar na API bible-api.com (limitado, mas vamos tentar algumas referências comuns)
    async buscarNaAPI(palavraChave, versao, limite) {
        const resultados = [];
        
        // Lista de livros/capítulos comuns para busca
        const referenciasComuns = [
            'John+3:16', 'Psalm+23', 'Romans+8:28', 'Philippians+4:13',
            'Matthew+5', 'John+1', 'Genesis+1', 'Psalm+1',
            'Luke+2', 'Matthew+6', 'John+14', 'Romans+12'
        ];
        
        try {
            // Buscar em algumas referências conhecidas
            for (const ref of referenciasComuns.slice(0, 10)) { // Limitar para não sobrecarregar
                try {
                    const response = await fetch(`${this.baseURL}/${ref}?translation=${versao}`);
                    if (response.ok) {
                        const data = await response.json();
                        const textoCompleto = data.text || '';
                        
                        // Verificar se contém a palavra-chave
                        if (textoCompleto.toLowerCase().includes(palavraChave.toLowerCase())) {
                            if (data.verses && data.verses.length > 0) {
                                for (const verse of data.verses) {
                                    if (verse.text.toLowerCase().includes(palavraChave.toLowerCase())) {
                                        resultados.push({
                                            livro: data.book_name || this.extrairLivro(ref),
                                            capitulo: verse.chapter || data.chapter,
                                            versiculo: verse.verse,
                                            texto: verse.text.trim(),
                                            referencia: `${data.book_name || this.extrairLivro(ref)} ${verse.chapter}:${verse.verse}`,
                                            fonte: 'API'
                                        });
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    // Continuar mesmo se uma referência falhar
                    continue;
                }
                
                // Parar se já temos resultados suficientes
                if (resultados.length >= limite / 2) break;
            }
        } catch (error) {
            console.warn('Erro na busca da API:', error);
        }
        
        return resultados;
    }

    // Extrair nome do livro da referência
    extrairLivro(ref) {
        const mapeamento = {
            'John': 'João',
            'Psalm': 'Salmos',
            'Romans': 'Romanos',
            'Philippians': 'Filipenses',
            'Matthew': 'Mateus',
            'Genesis': 'Gênesis',
            'Luke': 'Lucas'
        };
        
        const livroIngles = ref.split('+')[0];
        return mapeamento[livroIngles] || livroIngles;
    }

    // Processar dados do capítulo
    processarCapitulo(data) {
        if (!data || !data.verses) {
            return null;
        }

        return {
            referencia: data.reference,
            versiculos: data.verses.map(verse => ({
                numero: verse.verse,
                texto: verse.text.trim()
            })),
            livro: data.book_name,
            capitulo: data.chapter,
            traducao: data.translation_name || 'Almeida'
        };
    }

    // Processar dados do versículo
    processarVersiculo(data) {
        if (!data || !data.verses || data.verses.length === 0) {
            return null;
        }

        const verse = data.verses[0];
        return {
            referencia: data.reference,
            numero: verse.verse,
            texto: verse.text.trim(),
            livro: data.book_name,
            capitulo: data.chapter
        };
    }

    // Dados de fallback quando API falha - EXPANDIDO COM MAIS TEXTOS
    getFallbackData(livro, capitulo) {
        const fallbackTextos = {
            'genesis': {
                1: {
                    referencia: 'Gênesis 1',
                    livro: 'Gênesis',
                    capitulo: 1,
                    versiculos: [
                        { numero: 1, texto: 'No princípio, Deus criou o céu e a terra.' },
                        { numero: 2, texto: 'A terra estava vazia e vaga, as trevas cobriam o abismo, e o Espírito de Deus pairava sobre as águas.' },
                        { numero: 3, texto: 'Deus disse: "Faça-se a luz!" E a luz foi feita.' },
                        { numero: 4, texto: 'Deus viu que a luz era boa, e separou a luz das trevas.' },
                        { numero: 5, texto: 'Deus chamou dia à luz, e noite às trevas. Houve uma tarde e uma manhã: foi o primeiro dia.' },
                        { numero: 6, texto: 'Deus disse: "Faça-se um firmamento no meio das águas para separar umas das outras!"' },
                        { numero: 7, texto: 'Deus fez o firmamento e separou as águas que estavam debaixo do firmamento das que estavam por cima. E assim se fez.' },
                        { numero: 8, texto: 'Deus chamou ao firmamento céu. Houve uma tarde e uma manhã: foi o segundo dia.' },
                        { numero: 9, texto: 'Deus disse: "Ajuntem-se as águas, que estão debaixo do céu, num só lugar, e apareça o elemento árido." E assim se fez.' },
                        { numero: 10, texto: 'Deus chamou ao elemento árido terra, e ao ajuntamento das águas mar. E Deus viu que isso era bom.' }
                    ]
                }
            },
            'matthew': {
                5: {
                    referencia: 'Mateus 5',
                    livro: 'Mateus',
                    capitulo: 5,
                    versiculos: [
                        { numero: 1, texto: 'Vendo Jesus as multidões, subiu ao monte e, depois de se ter sentado, aproximaram-se os seus discípulos;' },
                        { numero: 2, texto: 'e ele se pôs a ensiná-los dizendo:' },
                        { numero: 3, texto: 'Bem-aventurados os pobres em espírito, porque deles é o Reino dos Céus.' },
                        { numero: 4, texto: 'Bem-aventurados os que choram, porque serão consolados.' },
                        { numero: 5, texto: 'Bem-aventurados os mansos, porque possuirão a terra.' },
                        { numero: 6, texto: 'Bem-aventurados os que têm fome e sede de justiça, porque serão saciados.' },
                        { numero: 7, texto: 'Bem-aventurados os misericordiosos, porque alcançarão misericórdia.' },
                        { numero: 8, texto: 'Bem-aventurados os puros de coração, porque verão a Deus.' },
                        { numero: 9, texto: 'Bem-aventurados os pacíficos, porque serão chamados filhos de Deus.' },
                        { numero: 10, texto: 'Bem-aventurados os que sofrem perseguição por causa da justiça, porque deles é o Reino dos Céus.' }
                    ]
                }
            },
            'john': {
                1: {
                    referencia: 'João 1',
                    livro: 'João',
                    capitulo: 1,
                    versiculos: [
                        { numero: 1, texto: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.' },
                        { numero: 2, texto: 'Ele estava no princípio com Deus.' },
                        { numero: 3, texto: 'Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.' },
                        { numero: 4, texto: 'Nele estava a vida e a vida era a luz dos homens.' },
                        { numero: 5, texto: 'A luz resplandece nas trevas, e as trevas não a compreenderam.' },
                        { numero: 6, texto: 'Houve um homem enviado de Deus, cujo nome era João.' },
                        { numero: 7, texto: 'Este veio para testemunho, para que testificasse da luz, para que todos cressem por ele.' },
                        { numero: 8, texto: 'Não era ele a luz, mas para que testificasse da luz.' },
                        { numero: 9, texto: 'Ali estava a luz verdadeira, que ilumina a todo o homem que vem ao mundo.' },
                        { numero: 10, texto: 'Estava no mundo, e o mundo foi feito por ele, e o mundo não o conheceu.' }
                    ]
                },
                3: {
                    referencia: 'João 3',
                    livro: 'João',
                    capitulo: 3,
                    versiculos: [
                        { numero: 1, texto: 'Havia entre os fariseus um homem chamado Nicodemos, um dos principais dos judeus.' },
                        { numero: 2, texto: 'Este foi ter com Jesus, de noite, e disse-lhe: Rabi, bem sabemos que és Mestre, vindo de Deus; porque ninguém pode fazer estes sinais que tu fazes, se Deus não for com ele.' },
                        { numero: 3, texto: 'Jesus respondeu, e disse-lhe: Na verdade, na verdade te digo que aquele que não nascer de novo, não pode ver o reino de Deus.' },
                        { numero: 16, texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
                        { numero: 17, texto: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' }
                    ]
                },
                14: {
                    referencia: 'João 14',
                    livro: 'João',
                    capitulo: 14,
                    versiculos: [
                        { numero: 1, texto: 'Não se turbe o vosso coração; credes em Deus, crede também em mim.' },
                        { numero: 2, texto: 'Na casa de meu Pai há muitas moradas; se não fosse assim, eu vo-lo teria dito. Vou preparar-vos lugar.' },
                        { numero: 3, texto: 'E quando eu for, e vos preparar lugar, virei outra vez, e vos levarei para mim mesmo, para que onde eu estiver estejais vós também.' },
                        { numero: 4, texto: 'E para onde eu vou vós sabeis o caminho.' },
                        { numero: 5, texto: 'Disse-lhe Tomé: Senhor, nós não sabemos para onde vais; e como podemos saber o caminho?' },
                        { numero: 6, texto: 'Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.' }
                    ]
                }
            },
            'psalms': {
                23: {
                    referencia: 'Salmo 23',
                    livro: 'Salmos',
                    capitulo: 23,
                    versiculos: [
                        { numero: 1, texto: 'O Senhor é o meu pastor; nada me faltará.' },
                        { numero: 2, texto: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.' },
                        { numero: 3, texto: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.' },
                        { numero: 4, texto: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
                        { numero: 5, texto: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.' },
                        { numero: 6, texto: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' }
                    ]
                },
                91: {
                    referencia: 'Salmo 91',
                    livro: 'Salmos',
                    capitulo: 91,
                    versiculos: [
                        { numero: 1, texto: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.' },
                        { numero: 2, texto: 'Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.' },
                        { numero: 3, texto: 'Porque ele te livrará do laço do passarinheiro e da peste perniciosa.' },
                        { numero: 4, texto: 'Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel.' },
                        { numero: 5, texto: 'Não terás medo do terror de noite nem da seta que voa de dia.' }
                    ]
                }
            },
            'proverbs': {
                31: {
                    referencia: 'Provérbios 31',
                    livro: 'Provérbios',
                    capitulo: 31,
                    versiculos: [
                        { numero: 10, texto: 'Mulher virtuosa quem a achará? O seu valor muito excede ao de rubis.' },
                        { numero: 11, texto: 'O coração do seu marido está nela confiado; assim ele não necessitará de despojo.' },
                        { numero: 12, texto: 'Ela lhe faz bem, e não mal, todos os dias da sua vida.' },
                        { numero: 13, texto: 'Busca lã e linho, e de boa vontade trabalha com suas mãos.' },
                        { numero: 14, texto: 'É como os navios mercantes, traz de longe o seu pão.' }
                    ]
                }
            },
            'revelation': {
                21: {
                    referencia: 'Apocalipse 21',
                    livro: 'Apocalipse',
                    capitulo: 21,
                    versiculos: [
                        { numero: 1, texto: 'E vi um novo céu, e uma nova terra. Porque já o primeiro céu e a primeira terra passaram, e o mar já não existe.' },
                        { numero: 2, texto: 'E eu, João, vi a santa cidade, a nova Jerusalém, que de Deus descia do céu, adereçada como uma esposa ataviada para o seu marido.' },
                        { numero: 3, texto: 'E ouvi uma grande voz do céu, que dizia: Eis aqui o tabernáculo de Deus com os homens, pois com eles habitará, e eles serão o seu povo, e o mesmo Deus estará com eles, e será o seu Deus.' },
                        { numero: 4, texto: 'E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas.' },
                        { numero: 5, texto: 'E o que estava assentado sobre o trono disse: Eis que faço novas todas as coisas. E disse-me: Escreve; porque estas palavras são verdadeiras e fiéis.' }
                    ]
                }
            }
        };

        return fallbackTextos[livro]?.[capitulo] || null;
    }

    // Buscar texto por palavra-chave IMPLEMENTAÇÃO COMPLETA
    async buscarTexto(palavraChave, opcoes = {}) {
        const { 
            buscaExata = false, 
            testamentoAtual = null, 
            versao = 'almeida',
            limite = 50
        } = opcoes;

        console.log(`🔍 Buscando "${palavraChave}" na Bíblia...`);
        
        const resultados = [];
        
        // 1. Buscar na API online primeiro
        const resultadosAPI = await this.buscarNaAPI(palavraChave, versao, limite);
        if (resultadosAPI.length > 0) {
            resultados.push(...resultadosAPI);
        }
        
        // 2. Complementar com busca local nos dados de fallback
        const resultadosLocais = this.buscarNosTextosSalvos(palavraChave, buscaExata);
        resultados.push(...resultadosLocais);
        
        // 3. Filtrar por testamento se necessário
        let resultadosFiltrados = resultados;
        if (testamentoAtual) {
            resultadosFiltrados = this.filtrarPorTestamento(resultados, testamentoAtual);
        }
        
        // 4. Remover duplicatas e ordenar
        const resultadosFinais = this.removerDuplicatasEOrdenar(resultadosFiltrados);
        
        console.log(`📊 Encontrados ${resultadosFinais.length} resultados para "${palavraChave}"`);
        return resultadosFinais.slice(0, limite);
    }

    // Buscar na API bible-api.com (limitado, mas vamos tentar algumas referências comuns)
    async buscarNaAPI(palavraChave, versao, limite) {
        const resultados = [];
        
        // Lista de livros/capítulos comuns para busca
        const referenciasComuns = [
            'John+3:16', 'Psalm+23', 'Romans+8:28', 'Philippians+4:13',
            'Matthew+5', 'John+1', 'Genesis+1', 'Psalm+1',
            'Luke+2', 'Matthew+6', 'John+14', 'Romans+12'
        ];
        
        try {
            // Buscar em algumas referências conhecidas
            for (const ref of referenciasComuns.slice(0, 10)) { // Limitar para não sobrecarregar
                try {
                    const response = await fetch(`${this.baseURL}/${ref}?translation=${versao}`);
                    if (response.ok) {
                        const data = await response.json();
                        const textoCompleto = data.text || '';
                        
                        // Verificar se contém a palavra-chave
                        if (textoCompleto.toLowerCase().includes(palavraChave.toLowerCase())) {
                            if (data.verses && data.verses.length > 0) {
                                for (const verse of data.verses) {
                                    if (verse.text.toLowerCase().includes(palavraChave.toLowerCase())) {
                                        resultados.push({
                                            livro: data.book_name || this.extrairLivro(ref),
                                            capitulo: verse.chapter || data.chapter,
                                            versiculo: verse.verse,
                                            texto: verse.text.trim(),
                                            referencia: `${data.book_name || this.extrairLivro(ref)} ${verse.chapter}:${verse.verse}`,
                                            fonte: 'API'
                                        });
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    // Continuar mesmo se uma referência falhar
                    continue;
                }
                
                // Parar se já temos resultados suficientes
                if (resultados.length >= limite / 2) break;
            }
        } catch (error) {
            console.warn('Erro na busca da API:', error);
        }
        
        return resultados;
    }

    // Extrair nome do livro da referência
    extrairLivro(ref) {
        const mapeamento = {
            'John': 'João',
            'Psalm': 'Salmos',
            'Romans': 'Romanos',
            'Philippians': 'Filipenses',
            'Matthew': 'Mateus',
            'Genesis': 'Gênesis',
            'Luke': 'Lucas'
        };
        
        const livroIngles = ref.split('+')[0];
        return mapeamento[livroIngles] || livroIngles;
    }

    // Buscar texto nos dados salvos localmente
    buscarNosTextosSalvos(palavraChave, buscaExata = false) {
        const resultados = [];
        const termoBusca = buscaExata ? palavraChave : palavraChave.toLowerCase();
        
        // Dados expandidos para busca local
        const todosTextos = this.obterTodosTextosParaBusca();
        
        for (const item of todosTextos) {
            for (const versiculo of item.versiculos) {
                const textoVersiculo = buscaExata ? versiculo.texto : versiculo.texto.toLowerCase();
                
                let encontrou = false;
                if (buscaExata) {
                    encontrou = textoVersiculo.includes(termoBusca);
                } else {
                    encontrou = textoVersiculo.includes(termoBusca);
                }
                
                if (encontrou) {
                    resultados.push({
                        livro: item.livro,
                        capitulo: item.capitulo,
                        versiculo: versiculo.numero,
                        texto: versiculo.texto,
                        referencia: `${item.livro} ${item.capitulo}:${versiculo.numero}`,
                        fonte: 'Local'
                    });
                }
            }
        }
        
        return resultados;
    }

    // Obter todos os textos disponíveis para busca - EXPANDIDO COM MAIS VERSÍCULOS
    obterTodosTextosParaBusca() {
        return [
            // VERSÍCULOS SOBRE AMOR
            {
                livro: 'João',
                capitulo: 3,
                versiculos: [
                    { numero: 16, texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
                    { numero: 17, texto: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' }
                ]
            },
            {
                livro: '1 João',
                capitulo: 4,
                versiculos: [
                    { numero: 7, texto: 'Amados, amemo-nos uns aos outros, porque o amor vem de Deus; e todo aquele que ama é nascido de Deus e conhece a Deus.' },
                    { numero: 8, texto: 'Aquele que não ama não conhece a Deus, porque Deus é amor.' },
                    { numero: 9, texto: 'Nisto se manifestou o amor de Deus entre nós: que Deus enviou seu Filho unigênito ao mundo, para que por ele vivamos.' },
                    { numero: 10, texto: 'Nisto está o amor: não em que nós tenhamos amado a Deus, mas em que ele nos amou a nós e enviou seu Filho para propiciação pelos nossos pecados.' },
                    { numero: 11, texto: 'Amados, se Deus assim nos amou, também nós devemos amar uns aos outros.' },
                    { numero: 16, texto: 'E nós conhecemos e cremos no amor que Deus nos tem. Deus é amor, e quem está em amor está em Deus, e Deus nele.' },
                    { numero: 19, texto: 'Nós o amamos porque ele nos amou primeiro.' },
                    { numero: 20, texto: 'Se alguém diz: Eu amo a Deus e odeia a seu irmão, é mentiroso. Pois quem não ama a seu irmão, ao qual viu, como pode amar a Deus, a quem não viu?' }
                ]
            },
            {
                livro: '1 Coríntios',
                capitulo: 13,
                versiculos: [
                    { numero: 1, texto: 'Ainda que eu falasse as línguas dos homens e dos anjos, e não tivesse amor, seria como o metal que soa ou como o sino que tine.' },
                    { numero: 2, texto: 'E ainda que tivesse o dom de profecia, e conhecesse todos os mistérios e toda a ciência, e ainda que tivesse toda a fé, de maneira tal que transportasse os montes, e não tivesse amor, nada seria.' },
                    { numero: 3, texto: 'E ainda que distribuísse toda a minha fortuna para sustento dos pobres, e ainda que entregasse o meu corpo para ser queimado, e não tivesse amor, nada disso me aproveitaria.' },
                    { numero: 4, texto: 'O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece.' },
                    { numero: 5, texto: 'Não se porta com indecência, não busca os seus interesses, não se irrita, não suspeita mal.' },
                    { numero: 6, texto: 'Não folga com a injustiça, mas folga com a verdade.' },
                    { numero: 7, texto: 'Tudo sofre, tudo crê, tudo espera, tudo suporta.' },
                    { numero: 8, texto: 'O amor nunca falha; mas, havendo profecias, serão aniquiladas; havendo línguas, cessarão; havendo ciência, desaparecerá.' },
                    { numero: 13, texto: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.' }
                ]
            },
            {
                livro: 'Romanos',
                capitulo: 8,
                versiculos: [
                    { numero: 35, texto: 'Quem nos separará do amor de Cristo? A tribulação, ou a angústia, ou a perseguição, ou a fome, ou a nudez, ou o perigo, ou a espada?' },
                    { numero: 37, texto: 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.' },
                    { numero: 38, texto: 'Porque estou certo de que nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir.' },
                    { numero: 39, texto: 'Nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus, nosso Senhor.' }
                ]
            },
            {
                livro: 'Jeremias',
                capitulo: 31,
                versiculos: [
                    { numero: 3, texto: 'De longe se me deixou ver o Senhor, dizendo: Com amor eterno te amei; também com amável benignidade te atraí.' }
                ]
            },
            {
                livro: 'Efésios',
                capitulo: 3,
                versiculos: [
                    { numero: 17, texto: 'Para que Cristo habite pela fé nos vossos corações; a fim de, estando arraigados e fundados em amor.' },
                    { numero: 18, texto: 'Poderdes perfeitamente compreender, com todos os santos, qual seja a largura, e o comprimento, e a altura, e a profundidade.' },
                    { numero: 19, texto: 'E conhecer o amor de Cristo, que excede todo entendimento, para que sejais cheios de toda a plenitude de Deus.' }
                ]
            },

            // VERSÍCULOS SOBRE PAZ
            {
                livro: 'João',
                capitulo: 14,
                versiculos: [
                    { numero: 6, texto: 'Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.' },
                    { numero: 27, texto: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.' }
                ]
            },
            {
                livro: 'João',
                capitulo: 16,
                versiculos: [
                    { numero: 33, texto: 'Tenho-vos dito isto, para que em mim tenhais paz; no mundo tereis aflições, mas tende bom ânimo, eu venci o mundo.' }
                ]
            },
            {
                livro: 'Filipenses',
                capitulo: 4,
                versiculos: [
                    { numero: 6, texto: 'Não estejais inquietos por coisa alguma; antes, as vossas petições sejam em tudo conhecidas diante de Deus, pela oração e súplicas, com ação de graças.' },
                    { numero: 7, texto: 'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.' }
                ]
            },
            {
                livro: 'Isaías',
                capitulo: 26,
                versiculos: [
                    { numero: 3, texto: 'Tu conservarás em paz aquele cuja mente está firme em ti; porque ele confia em ti.' }
                ]
            },
            {
                livro: 'Isaías',
                capitulo: 55,
                versiculos: [
                    { numero: 11, texto: 'Assim será a minha palavra, que sair da minha boca; ela não voltará para mim vazia; antes, fará o que me apraz e prosperará naquilo para que a enviei.' },
                    { numero: 12, texto: 'Porque com alegria saireis e em paz sereis guiados; os montes e os outeiros romperão em cântico diante de vós, e todas as árvores do campo baterão as palmas.' }
                ]
            },

            // VERSÍCULOS SOBRE PASTOR/PASTORES
            {
                livro: 'Salmos',
                capitulo: 23,
                versiculos: [
                    { numero: 1, texto: 'O Senhor é o meu pastor; nada me faltará.' },
                    { numero: 2, texto: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.' },
                    { numero: 3, texto: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.' },
                    { numero: 4, texto: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
                    { numero: 5, texto: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.' },
                    { numero: 6, texto: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' }
                ]
            },
            {
                livro: 'João',
                capitulo: 10,
                versiculos: [
                    { numero: 11, texto: 'Eu sou o bom Pastor; o bom pastor dá a sua vida pelas ovelhas.' },
                    { numero: 14, texto: 'Eu sou o bom Pastor, e conheço as minhas ovelhas, e das minhas sou conhecido.' },
                    { numero: 15, texto: 'Assim como o Pai me conhece, também eu conheço o Pai e dou a minha vida pelas ovelhas.' },
                    { numero: 16, texto: 'Ainda tenho outras ovelhas que não são deste aprisco; também me convém agregar estas, e elas ouvirão a minha voz, e haverá um rebanho e um Pastor.' }
                ]
            },
            {
                livro: 'Ezequiel',
                capitulo: 34,
                versiculos: [
                    { numero: 12, texto: 'Como o pastor busca o seu rebanho no dia em que está no meio das suas ovelhas dispersas, assim buscarei as minhas ovelhas, e livrá-las-ei de todos os lugares por onde andam espalhadas no dia nublado e escuro.' }
                ]
            },

            // VERSÍCULOS SOBRE DEUS
            {
                livro: 'Gênesis',
                capitulo: 1,
                versiculos: [
                    { numero: 1, texto: 'No princípio, Deus criou o céu e a terra.' },
                    { numero: 2, texto: 'A terra estava vazia e vaga, as trevas cobriam o abismo, e o Espírito de Deus pairava sobre as águas.' },
                    { numero: 3, texto: 'Deus disse: "Faça-se a luz!" E a luz foi feita.' },
                    { numero: 27, texto: 'E criou Deus o homem à sua imagem; à imagem de Deus o criou; macho e fêmea os criou.' }
                ]
            },
            {
                livro: 'Deuteronômio',
                capitulo: 6,
                versiculos: [
                    { numero: 4, texto: 'Ouve, Israel, o Senhor, nosso Deus, é o único Senhor.' },
                    { numero: 5, texto: 'Amarás, pois, o Senhor, teu Deus, de todo o teu coração, e de toda a tua alma, e de todas as tuas forças.' }
                ]
            },
            {
                livro: 'Salmos',
                capitulo: 46,
                versiculos: [
                    { numero: 1, texto: 'Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.' },
                    { numero: 10, texto: 'Aquietai-vos e sabei que eu sou Deus; sou exaltado entre os gentios, sou exaltado na terra.' }
                ]
            },

            // VERSÍCULOS SOBRE VIDA ETERNA
            {
                livro: 'João',
                capitulo: 5,
                versiculos: [
                    { numero: 24, texto: 'Na verdade, na verdade vos digo que quem ouve a minha palavra e crê naquele que me enviou tem a vida eterna e não entrará em condenação, mas passou da morte para a vida.' }
                ]
            },
            {
                livro: 'João',
                capitulo: 17,
                versiculos: [
                    { numero: 3, texto: 'E a vida eterna é esta: que te conheçam, a ti só, por único Deus verdadeiro, e a Jesus Cristo, a quem enviaste.' }
                ]
            },
            {
                livro: '1 João',
                capitulo: 5,
                versiculos: [
                    { numero: 11, texto: 'E o testemunho é este: que Deus nos deu a vida eterna; e esta vida está em seu Filho.' },
                    { numero: 12, texto: 'Quem tem o Filho tem a vida; quem não tem o Filho de Deus não tem a vida.' },
                    { numero: 13, texto: 'Estas coisas vos escrevi, para que saibais que tendes a vida eterna, e para que creiais no nome do Filho de Deus.' }
                ]
            },

            // VERSÍCULOS SOBRE FÉ
            {
                livro: 'Hebreus',
                capitulo: 11,
                versiculos: [
                    { numero: 1, texto: 'Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem.' },
                    { numero: 6, texto: 'Ora, sem fé é impossível agradar-lhe, porque é necessário que aquele que se aproxima de Deus creia que ele existe e que é galardoador dos que o buscam.' }
                ]
            },
            {
                livro: 'Romanos',
                capitulo: 10,
                versiculos: [
                    { numero: 17, texto: 'De sorte que a fé é pelo ouvir, e o ouvir pela palavra de Deus.' }
                ]
            },

            // VERSÍCULOS SOBRE ESPERANÇA
            {
                livro: 'Romanos',
                capitulo: 15,
                versiculos: [
                    { numero: 13, texto: 'Ora, o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança pela virtude do Espírito Santo.' }
                ]
            },
            {
                livro: 'Jeremias',
                capitulo: 29,
                versiculos: [
                    { numero: 11, texto: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.' }
                ]
            },

            // BEM-AVENTURANÇAS
            {
                livro: 'Mateus',
                capitulo: 5,
                versiculos: [
                    { numero: 3, texto: 'Bem-aventurados os pobres em espírito, porque deles é o Reino dos Céus.' },
                    { numero: 4, texto: 'Bem-aventurados os que choram, porque serão consolados.' },
                    { numero: 5, texto: 'Bem-aventurados os mansos, porque possuirão a terra.' },
                    { numero: 6, texto: 'Bem-aventurados os que têm fome e sede de justiça, porque serão saciados.' },
                    { numero: 7, texto: 'Bem-aventurados os misericordiosos, porque alcançarão misericórdia.' },
                    { numero: 8, texto: 'Bem-aventurados os puros de coração, porque verão a Deus.' },
                    { numero: 9, texto: 'Bem-aventurados os pacíficos, porque serão chamados filhos de Deus.' }
                ]
            }
        ];
    }

    // Filtrar resultados por testamento
    filtrarPorTestamento(resultados, testamento) {
        const livrosAntigoTestamento = [
            'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
            'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel', '1 Reis', '2 Reis',
            '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester',
            'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cânticos',
            'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel',
            'Oséias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miquéias',
            'Naum', 'Habacuc', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias'
        ];
        
        return resultados.filter(resultado => {
            if (testamento === 'at') {
                return livrosAntigoTestamento.includes(resultado.livro);
            } else if (testamento === 'nt') {
                return !livrosAntigoTestamento.includes(resultado.livro);
            }
            return true;
        });
    }

    // Remover duplicatas e ordenar resultados
    removerDuplicatasEOrdenar(resultados) {
        const unicos = [];
        const referencias = new Set();
        
        for (const resultado of resultados) {
            if (!referencias.has(resultado.referencia)) {
                referencias.add(resultado.referencia);
                unicos.push(resultado);
            }
        }
        
        // Ordenar por relevância (priorizar resultados da API)
        return unicos.sort((a, b) => {
            if (a.fonte === 'API' && b.fonte === 'Local') return -1;
            if (a.fonte === 'Local' && b.fonte === 'API') return 1;
            return a.referencia.localeCompare(b.referencia, 'pt-BR');
        });
    }

    // Mapear nomes de livros para a API
    mapearNomeLivro(nomePortugues) {
        const mapeamento = {
            'genesis': 'genesis',
            'exodo': 'exodus',
            'levitico': 'leviticus',
            'numeros': 'numbers',
            'deuteronomio': 'deuteronomy',
            'josue': 'joshua',
            'juizes': 'judges',
            'rute': 'ruth',
            'salmos': 'psalms',
            'proverbios': 'proverbs',
            'eclesiastes': 'ecclesiastes',
            'isaias': 'isaiah',
            'jeremias': 'jeremiah',
            'ezequiel': 'ezekiel',
            'daniel': 'daniel',
            'mateus': 'matthew',
            'marcos': 'mark',
            'lucas': 'luke',
            'joao': 'john',
            'atos': 'acts',
            'romanos': 'romans',
            '1corintios': '1corinthians',
            '2corintios': '2corinthians',
            'galatas': 'galatians',
            'efesios': 'ephesians',
            'filipenses': 'philippians',
            'colossenses': 'colossians',
            'apocalipse': 'revelation'
        };

        return mapeamento[nomePortugues] || nomePortugues;
    }

    // Limpar cache
    limparCache() {
        this.cache.clear();
        console.log('Cache da Bíblia limpo');
    }

    // Obter estatísticas do cache
    getEstatisticasCache() {
        return {
            totalItens: this.cache.size,
            itens: Array.from(this.cache.keys())
        };
    }
}

// Instância global da API
window.bibliaAPI = new BibliaAPI();

// Função de conveniência para uso direto
window.buscarCapituloBiblia = async (livro, capitulo) => {
    const livroMapeado = window.bibliaAPI.mapearNomeLivro(livro);
    return await window.bibliaAPI.buscarCapitulo(livroMapeado, capitulo);
};

window.buscarVersiculoBiblia = async (livro, capitulo, versiculo) => {
    const livroMapeado = window.bibliaAPI.mapearNomeLivro(livro);
    return await window.bibliaAPI.buscarVersiculo(livroMapeado, capitulo, versiculo);
};

console.log('📖 Bíblia API carregada! Use window.bibliaAPI para acessar.');