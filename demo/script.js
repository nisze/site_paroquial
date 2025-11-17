// ===== JAVASCRIPT PARA DEMO =====

document.addEventListener('DOMContentLoaded', function() {
    // Menu hambúrguer
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scroll para links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Compensar altura do navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efeito no navbar ao rolar a página
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    });

    // Animação de entrada dos cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todos os cards para animação
    const cards = document.querySelectorAll('.service-card, .horario-card, .noticia-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Funcionalidade da busca (simulada)
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input input');
    const searchSelect = document.querySelector('.search-select');
    
    if (searchButton && searchInput && searchSelect) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            const comunidade = searchSelect.value;
            
            if (query || comunidade) {
                // Simulação de busca
                alert(`Buscando por: "${query}" ${comunidade ? `na comunidade: ${comunidade}` : 'em todas as comunidades'}`);
                
                // Em uma implementação real, aqui faria uma requisição para a API
                // e redirecionaria para uma página de resultados
            } else {
                alert('Digite algo para buscar ou selecione uma comunidade');
            }
        });

        // Busca ao pressionar Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Funcionalidade da Bíblia Online
    initBibliaOnline();

    // Funcionalidade dos botões dos cards (simulada)
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.service-card').querySelector('h3').textContent;
            
            // Simulação das ações
            switch(cardTitle) {
                case 'Horários de Missa':
                    document.getElementById('horarios').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'Solicitar Missa':
                    alert('Redirecionando para formulário de solicitação de missa...\n\nFormulário incluirá:\n- Nome do solicitante\n- Tipo de intenção\n- Data desejada\n- Observações');
                    break;
                case 'Grupos e Pastorais':
                    alert('Redirecionando para página de grupos...');
                    break;
                case 'Eventos e Campanhas':
                    alert('Redirecionando para agenda de eventos...');
                    break;
                default:
                    alert(`Abrindo ${cardTitle}...`);
            }
        });
    });

    // Botão "Solicitar Missa" da navbar
    const navCtaButton = document.querySelector('.nav-cta');
    if (navCtaButton) {
        navCtaButton.addEventListener('click', function() {
            alert('Redirecionando para formulário de solicitação de missa...\n\nEm um site real, isso abriria uma página com formulário para:\n- Nome do solicitante\n- Tipo de intenção\n- Data desejada\n- Observações especiais');
        });
    }

    // Efeito parallax sutil no vídeo hero (opcional)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroVideo = document.querySelector('.hero-video video');
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Fallback para vídeo - se não carregar, mostra imagem
    const heroVideo = document.querySelector('.hero-video video');
    if (heroVideo) {
        heroVideo.addEventListener('error', function() {
            // Se o vídeo falhar, substitui por uma imagem de fundo linda de igreja
            const heroSection = document.querySelector('.hero-section');
            heroSection.style.backgroundImage = 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop")';
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            
            // Remove o elemento de vídeo
            this.parentElement.style.display = 'none';
        });

        // Log quando o vídeo carrega com sucesso
        heroVideo.addEventListener('loadeddata', function() {
            console.log('🎥 Vídeo da igreja carregado com sucesso!');
        });

        // Se demorar mais de 5 segundos, usa fallback
        setTimeout(() => {
            if (heroVideo.readyState < 2) {
                console.log('⏱️ Vídeo demorou para carregar, usando imagem de fallback...');
                heroVideo.dispatchEvent(new Event('error'));
            }
        }, 5000);
    }

    // Contador animado (exemplo para estatísticas futuras)
    function animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Console log para debug
    console.log('🙏 Demo da Paróquia Nossa Senhora Aparecida carregada!');
    console.log('📱 Funcionalidades ativas:');
    console.log('- ✅ Navegação suave');
    console.log('- ✅ Busca simulada');
    console.log('- ✅ Animações de scroll');
    console.log('- ✅ Responsividade');
    console.log('- ✅ Botões interativos');
});

// Função para simular carregamento de dados (para demonstração)
// ===== FUNCIONALIDADE BÍBLIA ONLINE =====
function initBibliaOnline() {
    // Estrutura completa da Bíblia Católica
    const bibliaCompleta = {
        antigoTestamento: [
            { value: 'genesis', text: 'Gênesis', capitulos: 50, abrev: 'Gn' },
            { value: 'exodo', text: 'Êxodo', capitulos: 40, abrev: 'Ex' },
            { value: 'levitico', text: 'Levítico', capitulos: 27, abrev: 'Lv' },
            { value: 'numeros', text: 'Números', capitulos: 36, abrev: 'Nm' },
            { value: 'deuteronomio', text: 'Deuteronômio', capitulos: 34, abrev: 'Dt' },
            { value: 'josue', text: 'Josué', capitulos: 24, abrev: 'Js' },
            { value: 'juizes', text: 'Juízes', capitulos: 21, abrev: 'Jz' },
            { value: 'rute', text: 'Rute', capitulos: 4, abrev: 'Rt' },
            { value: '1samuel', text: '1 Samuel', capitulos: 31, abrev: '1Sm' },
            { value: '2samuel', text: '2 Samuel', capitulos: 24, abrev: '2Sm' },
            { value: '1reis', text: '1 Reis', capitulos: 22, abrev: '1Rs' },
            { value: '2reis', text: '2 Reis', capitulos: 25, abrev: '2Rs' },
            { value: '1cronicas', text: '1 Crônicas', capitulos: 29, abrev: '1Cr' },
            { value: '2cronicas', text: '2 Crônicas', capitulos: 36, abrev: '2Cr' },
            { value: 'esdras', text: 'Esdras', capitulos: 10, abrev: 'Esd' },
            { value: 'neemias', text: 'Neemias', capitulos: 13, abrev: 'Ne' },
            { value: 'tobias', text: 'Tobias', capitulos: 14, abrev: 'Tb' },
            { value: 'judite', text: 'Judite', capitulos: 16, abrev: 'Jt' },
            { value: 'ester', text: 'Ester', capitulos: 16, abrev: 'Est' },
            { value: '1macabeus', text: '1 Macabeus', capitulos: 16, abrev: '1Mc' },
            { value: '2macabeus', text: '2 Macabeus', capitulos: 15, abrev: '2Mc' },
            { value: 'jo', text: 'Jó', capitulos: 42, abrev: 'Jó' },
            { value: 'salmos', text: 'Salmos', capitulos: 150, abrev: 'Sl' },
            { value: 'proverbios', text: 'Provérbios', capitulos: 31, abrev: 'Pr' },
            { value: 'eclesiastes', text: 'Eclesiastes', capitulos: 12, abrev: 'Ecl' },
            { value: 'canticos', text: 'Cântico dos Cânticos', capitulos: 8, abrev: 'Ct' },
            { value: 'sabedoria', text: 'Sabedoria', capitulos: 19, abrev: 'Sb' },
            { value: 'eclesiastico', text: 'Eclesiástico', capitulos: 51, abrev: 'Eclo' },
            { value: 'isaias', text: 'Isaías', capitulos: 66, abrev: 'Is' },
            { value: 'jeremias', text: 'Jeremias', capitulos: 52, abrev: 'Jr' },
            { value: 'lamentacoes', text: 'Lamentações', capitulos: 5, abrev: 'Lm' },
            { value: 'baruc', text: 'Baruc', capitulos: 6, abrev: 'Br' },
            { value: 'ezequiel', text: 'Ezequiel', capitulos: 48, abrev: 'Ez' },
            { value: 'daniel', text: 'Daniel', capitulos: 14, abrev: 'Dn' },
            { value: 'oseias', text: 'Oséias', capitulos: 14, abrev: 'Os' },
            { value: 'joel', text: 'Joel', capitulos: 4, abrev: 'Jl' },
            { value: 'amos', text: 'Amós', capitulos: 9, abrev: 'Am' },
            { value: 'abdias', text: 'Abdias', capitulos: 1, abrev: 'Ab' },
            { value: 'jonas', text: 'Jonas', capitulos: 4, abrev: 'Jn' },
            { value: 'miqueias', text: 'Miquéias', capitulos: 7, abrev: 'Mq' },
            { value: 'naum', text: 'Naum', capitulos: 3, abrev: 'Na' },
            { value: 'habacuc', text: 'Habacuc', capitulos: 3, abrev: 'Hc' },
            { value: 'sofonias', text: 'Sofonias', capitulos: 3, abrev: 'Sf' },
            { value: 'ageu', text: 'Ageu', capitulos: 2, abrev: 'Ag' },
            { value: 'zacarias', text: 'Zacarias', capitulos: 14, abrev: 'Zc' },
            { value: 'malaquias', text: 'Malaquias', capitulos: 3, abrev: 'Ml' }
        ],
        novoTestamento: [
            { value: 'mateus', text: 'Mateus', capitulos: 28, abrev: 'Mt' },
            { value: 'marcos', text: 'Marcos', capitulos: 16, abrev: 'Mc' },
            { value: 'lucas', text: 'Lucas', capitulos: 24, abrev: 'Lc' },
            { value: 'joao', text: 'João', capitulos: 21, abrev: 'Jo' },
            { value: 'atos', text: 'Atos dos Apóstolos', capitulos: 28, abrev: 'At' },
            { value: 'romanos', text: 'Romanos', capitulos: 16, abrev: 'Rm' },
            { value: '1corintios', text: '1 Coríntios', capitulos: 16, abrev: '1Cor' },
            { value: '2corintios', text: '2 Coríntios', capitulos: 13, abrev: '2Cor' },
            { value: 'galatas', text: 'Gálatas', capitulos: 6, abrev: 'Gl' },
            { value: 'efesios', text: 'Efésios', capitulos: 6, abrev: 'Ef' },
            { value: 'filipenses', text: 'Filipenses', capitulos: 4, abrev: 'Fl' },
            { value: 'colossenses', text: 'Colossenses', capitulos: 4, abrev: 'Cl' },
            { value: '1tessalonicenses', text: '1 Tessalonicenses', capitulos: 5, abrev: '1Ts' },
            { value: '2tessalonicenses', text: '2 Tessalonicenses', capitulos: 3, abrev: '2Ts' },
            { value: '1timoteo', text: '1 Timóteo', capitulos: 6, abrev: '1Tm' },
            { value: '2timoteo', text: '2 Timóteo', capitulos: 4, abrev: '2Tm' },
            { value: 'tito', text: 'Tito', capitulos: 3, abrev: 'Tt' },
            { value: 'filemom', text: 'Filêmon', capitulos: 1, abrev: 'Fm' },
            { value: 'hebreus', text: 'Hebreus', capitulos: 13, abrev: 'Hb' },
            { value: 'tiago', text: 'Tiago', capitulos: 5, abrev: 'Tg' },
            { value: '1pedro', text: '1 Pedro', capitulos: 5, abrev: '1Pd' },
            { value: '2pedro', text: '2 Pedro', capitulos: 3, abrev: '2Pd' },
            { value: '1joao', text: '1 João', capitulos: 5, abrev: '1Jo' },
            { value: '2joao', text: '2 João', capitulos: 1, abrev: '2Jo' },
            { value: '3joao', text: '3 João', capitulos: 1, abrev: '3Jo' },
            { value: 'judas', text: 'Judas', capitulos: 1, abrev: 'Jd' },
            { value: 'apocalipse', text: 'Apocalipse', capitulos: 22, abrev: 'Ap' }
        ]
    };

    // Textos bíblicos de exemplo (alguns capítulos importantes)
    const textosExemplo = {
        genesis: {
            1: {
                titulo: "A Criação do Mundo",
                versiculos: [
                    "No princípio, Deus criou o céu e a terra.",
                    "A terra estava vazia e vaga, as trevas cobriam o abismo, e o Espírito de Deus pairava sobre as águas.",
                    "Deus disse: 'Faça-se a luz!' E a luz foi feita.",
                    "Deus viu que a luz era boa, e separou a luz das trevas.",
                    "Deus chamou dia à luz, e noite às trevas. Houve uma tarde e uma manhã: foi o primeiro dia.",
                    "Deus disse: 'Faça-se um firmamento no meio das águas para separar umas das outras!'",
                    "Deus fez o firmamento e separou as águas que estavam debaixo do firmamento das que estavam por cima. E assim se fez.",
                    "Deus chamou ao firmamento céu. Houve uma tarde e uma manhã: foi o segundo dia.",
                    "Deus disse: 'Ajuntem-se as águas, que estão debaixo do céu, num só lugar, e apareça o elemento árido.' E assim se fez.",
                    "Deus chamou ao elemento árido terra, e ao ajuntamento das águas mar. E Deus viu que isso era bom."
                ]
            }
        },
        mateus: {
            5: {
                titulo: "As Bem-aventuranças",
                versiculos: [
                    "Vendo Jesus as multidões, subiu ao monte e, depois de se ter sentado, aproximaram-se os seus discípulos;",
                    "e ele se pôs a ensiná-los dizendo:",
                    "Bem-aventurados os pobres em espírito, porque deles é o Reino dos Céus.",
                    "Bem-aventurados os que choram, porque serão consolados.",
                    "Bem-aventurados os mansos, porque possuirão a terra.",
                    "Bem-aventurados os que têm fome e sede de justiça, porque serão saciados.",
                    "Bem-aventurados os misericordiosos, porque alcançarão misericórdia.",
                    "Bem-aventurados os puros de coração, porque verão a Deus.",
                    "Bem-aventurados os pacíficos, porque serão chamados filhos de Deus.",
                    "Bem-aventurados os que sofrem perseguição por causa da justiça, porque deles é o Reino dos Céus."
                ]
            }
        },
        joao: {
            1: {
                titulo: "O Verbo se fez carne",
                versiculos: [
                    "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
                    "Ele estava no princípio com Deus.",
                    "Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.",
                    "Nele estava a vida e a vida era a luz dos homens.",
                    "A luz resplandece nas trevas, e as trevas não a compreenderam."
                ]
            },
            3: {
                titulo: "Jesus e Nicodemos",
                versiculos: [
                    "Havia entre os fariseus um homem chamado Nicodemos, um dos principais dos judeus.",
                    "Este foi ter com Jesus, de noite, e disse-lhe: Rabi, bem sabemos que és Mestre, vindo de Deus; porque ninguém pode fazer estes sinais que tu fazes, se Deus não for com ele.",
                    "Jesus respondeu, e disse-lhe: Na verdade, na verdade te digo que aquele que não nascer de novo, não pode ver o reino de Deus."
                ]
            },
            14: {
                titulo: "Eu sou o caminho, a verdade e a vida",
                versiculos: [
                    "Não se turbe o vosso coração; credes em Deus, crede também em mim.",
                    "Na casa de meu Pai há muitas moradas; se não fosse assim, eu vo-lo teria dito. Vou preparar-vos lugar.",
                    "E quando eu for, e vos preparar lugar, virei outra vez, e vos levarei para mim mesmo, para que onde eu estiver estejais vós também.",
                    "E para onde eu vou vós sabeis o caminho.",
                    "Disse-lhe Tomé: Senhor, nós não sabemos para onde vais; e como podemos saber o caminho?",
                    "Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim."
                ]
            }
        },
        apocalipse: {
            21: {
                titulo: "Nova Jerusalém",
                versiculos: [
                    "E vi um novo céu, e uma nova terra. Porque já o primeiro céu e a primeira terra passaram, e o mar já não existe.",
                    "E eu, João, vi a santa cidade, a nova Jerusalém, que de Deus descia do céu, adereçada como uma esposa ataviada para o seu marido.",
                    "E ouvi uma grande voz do céu, que dizia: Eis aqui o tabernáculo de Deus com os homens, pois com eles habitará, e eles serão o seu povo, e o mesmo Deus estará com eles, e será o seu Deus.",
                    "E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas.",
                    "E o que estava assentado sobre o trono disse: Eis que faço novas todas as coisas. E disse-me: Escreve; porque estas palavras são verdadeiras e fiéis."
                ]
            }
        },
        salmos: {
            23: {
                titulo: "O Senhor é meu pastor",
                versiculos: [
                    "O Senhor é o meu pastor; nada me faltará.",
                    "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.",
                    "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.",
                    "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
                    "Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.",
                    "Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias."
                ]
            },
            91: {
                titulo: "Aquele que habita no esconderijo do Altíssimo",
                versiculos: [
                    "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.",
                    "Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.",
                    "Porque ele te livrará do laço do passarinheiro e da peste perniciosa.",
                    "Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel.",
                    "Não terás medo do terror de noite nem da seta que voa de dia."
                ]
            }
        },
        proverbios: {
            31: {
                titulo: "A mulher virtuosa",
                versiculos: [
                    "Mulher virtuosa quem a achará? O seu valor muito excede ao de rubis.",
                    "O coração do seu marido está nela confiado; assim ele não necessitará de despojo.",
                    "Ela lhe faz bem, e não mal, todos os dias da sua vida.",
                    "Busca lã e linho, e de boa vontade trabalha com suas mãos.",
                    "É como os navios mercantes, traz de longe o seu pão."
                ]
            }
        }
    };

    // Elementos do DOM
    const testamentoBtns = document.querySelectorAll('.testamento-btn');
    const livroSelect = document.getElementById('livro-select');
    const capituloSelect = document.getElementById('capitulo-select');
    const versiculoSelect = document.getElementById('versiculo-select');
    const buscarBtn = document.querySelector('.biblia-buscar-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    
    // Elementos da busca textual
    const buscaPalavraInput = document.getElementById('busca-palavra');
    const buscarPalavraBtn = document.getElementById('buscar-palavra-btn');
    const buscaExataCheckbox = document.getElementById('busca-exata');
    const apenasTestamentoCheckbox = document.getElementById('apenas-testamento');
    const resultadosBusca = document.getElementById('resultados-busca');
    const resultadosLista = document.getElementById('resultados-lista');
    const fecharBuscaBtn = document.getElementById('fechar-busca');
    const bibliaTextoPrincipal = document.getElementById('biblia-texto-principal');

    if (!testamentoBtns.length || !livroSelect) return;

    // Estado atual da navegação
    let estadoAtual = {
        testamento: 'at',
        livro: null,
        capitulo: null,
        versiculoInicio: null
    };

    // Alternar entre testamentos
    testamentoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            testamentoBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            estadoAtual.testamento = this.dataset.testamento;
            const livros = estadoAtual.testamento === 'at' ? bibliaCompleta.antigoTestamento : bibliaCompleta.novoTestamento;
            updateLivroSelect(livros);
        });
    });

    // Atualizar lista de livros
    function updateLivroSelect(livros) {
        livroSelect.innerHTML = '<option value="">Selecione um livro</option>';
        livros.forEach(livro => {
            const option = document.createElement('option');
            option.value = livro.value;
            option.textContent = livro.text;
            option.dataset.capitulos = livro.capitulos;
            option.dataset.abrev = livro.abrev;
            livroSelect.appendChild(option);
        });
        
        // Limpar seleções dependentes
        capituloSelect.innerHTML = '<option value="">Cap.</option>';
        versiculoSelect.innerHTML = '<option value="">Vers.</option>';
        estadoAtual.livro = null;
        estadoAtual.capitulo = null;
    }

    // Atualizar capítulos quando livro é selecionado
    livroSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const totalCapitulos = selectedOption.dataset.capitulos || 0;
        
        estadoAtual.livro = this.value;
        estadoAtual.capitulo = null;
        
        capituloSelect.innerHTML = '<option value="">Cap.</option>';
        for (let i = 1; i <= totalCapitulos; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            capituloSelect.appendChild(option);
        }
        
        versiculoSelect.innerHTML = '<option value="">Vers.</option>';
    });

    // Atualizar versículos quando capítulo é selecionado
    capituloSelect.addEventListener('change', function() {
        estadoAtual.capitulo = this.value;
        versiculoSelect.innerHTML = '<option value="">Vers.</option>';
        
        // Verificar se temos o texto deste capítulo
        const textoCapitulo = textosExemplo[estadoAtual.livro]?.[estadoAtual.capitulo];
        const totalVersiculos = textoCapitulo ? textoCapitulo.versiculos.length : Math.floor(Math.random() * 30) + 10;
        
        for (let i = 1; i <= totalVersiculos; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            versiculoSelect.appendChild(option);
        }
    });

    // Funcionalidade de busca
    if (buscarBtn) {
        buscarBtn.addEventListener('click', function() {
            const livro = livroSelect.value;
            const capitulo = capituloSelect.value || 1;
            const versiculo = versiculoSelect.value;
            
            if (!livro) {
                alert('Selecione um livro da Bíblia');
                return;
            }
            
            const livroNome = livroSelect.options[livroSelect.selectedIndex].text;
            const abrev = livroSelect.options[livroSelect.selectedIndex].dataset.abrev;
            
            carregarTexto(livro, capitulo, versiculo, livroNome, abrev);
            
            // Scroll suave para o texto
            document.querySelector('.biblia-texto').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Função para carregar texto bíblico
    async function carregarTexto(livro, capitulo, versiculoDestaque, livroNome, abrev) {
        const capituloHeader = document.querySelector('.capitulo-header h3');
        const subtitulo = document.querySelector('.subtitulo');
        const versiculosContainer = document.querySelector('.versiculos');
        const navInfo = document.querySelector('.nav-info');
        
        // Atualizar cabeçalho
        if (capituloHeader) {
            capituloHeader.textContent = `${livroNome} - Capítulo ${capitulo}`;
        }
        
        if (navInfo) {
            navInfo.textContent = `${abrev} ${capitulo}`;
        }

        // Mostrar indicador de carregamento
        if (versiculosContainer) {
            versiculosContainer.innerHTML = `
                <div class="carregando">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Carregando capítulo...</p>
                </div>
            `;
        }

        try {
            // Tentar buscar na API primeiro
            const dadosAPI = await window.buscarCapituloBiblia(livro, capitulo);
            
            if (dadosAPI && dadosAPI.versiculos) {
                // Usar dados da API
                if (subtitulo) {
                    subtitulo.textContent = `Capítulo ${capitulo}`;
                }
                
                if (versiculosContainer) {
                    versiculosContainer.innerHTML = '';
                    dadosAPI.versiculos.forEach((verso) => {
                        const versiculoDiv = document.createElement('div');
                        versiculoDiv.className = 'versiculo';
                        
                        if (versiculoDestaque && verso.numero == versiculoDestaque) {
                            versiculoDiv.classList.add('destaque');
                        }
                        
                        versiculoDiv.innerHTML = `
                            <span class="numero">${verso.numero}</span>
                            <span class="texto">${verso.texto}</span>
                        `;
                        versiculosContainer.appendChild(versiculoDiv);
                    });
                }
                
                console.log(`📖 Carregado da API: ${livroNome} ${capitulo}`);
                return;
            }
        } catch (error) {
            console.warn('Erro ao carregar da API, usando dados locais:', error);
        }

        // Fallback para dados locais
        const textoCapitulo = textosExemplo[livro]?.[capitulo];
        
        if (textoCapitulo) {
            // Texto local disponível
            if (subtitulo) {
                subtitulo.textContent = textoCapitulo.titulo;
            }
            
            if (versiculosContainer) {
                versiculosContainer.innerHTML = '';
                textoCapitulo.versiculos.forEach((verso, index) => {
                    const versiculoDiv = document.createElement('div');
                    versiculoDiv.className = 'versiculo';
                    
                    if (versiculoDestaque && (index + 1) == versiculoDestaque) {
                        versiculoDiv.classList.add('destaque');
                    }
                    
                    versiculoDiv.innerHTML = `
                        <span class="numero">${index + 1}</span>
                        <span class="texto">${verso}</span>
                    `;
                    versiculosContainer.appendChild(versiculoDiv);
                });
            }
            
            console.log(`📖 Carregado localmente: ${livroNome} ${capitulo}`);
        } else {
            // Texto não disponível
            if (subtitulo) {
                subtitulo.textContent = `Capítulo ${capitulo}`;
            }
            
            if (versiculosContainer) {
                versiculosContainer.innerHTML = `
                    <div class="versiculo-placeholder">
                        <p><strong>📖 Conteúdo em desenvolvimento</strong></p>
                        <p>Este capítulo estará disponível na versão completa do sistema.</p>
                        <p><em>Referência: ${livroNome} ${capitulo}${versiculoDestaque ? ':' + versiculoDestaque : ''}</em></p>
                        <button onclick="tentarCarregarAPI('${livro}', ${capitulo})" class="tentar-api-btn">
                            <i class="fas fa-cloud-download-alt"></i> Tentar carregar da API
                        </button>
                    </div>
                `;
            }
        }
        
        console.log(`📖 Carregando ${livroNome} ${capitulo}${versiculoDestaque ? ':' + versiculoDestaque : ''}`);
    }

    // Função global para tentar carregar da API
    window.tentarCarregarAPI = async function(livro, capitulo) {
        const versiculosContainer = document.querySelector('.versiculos');
        
        if (versiculosContainer) {
            versiculosContainer.innerHTML = `
                <div class="carregando">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Tentando carregar da API...</p>
                </div>
            `;
        }

        try {
            const dadosAPI = await window.buscarCapituloBiblia(livro, capitulo);
            
            if (dadosAPI && dadosAPI.versiculos) {
                if (versiculosContainer) {
                    versiculosContainer.innerHTML = '';
                    dadosAPI.versiculos.forEach((verso) => {
                        const versiculoDiv = document.createElement('div');
                        versiculoDiv.className = 'versiculo';
                        
                        versiculoDiv.innerHTML = `
                            <span class="numero">${verso.numero}</span>
                            <span class="texto">${verso.texto}</span>
                        `;
                        versiculosContainer.appendChild(versiculoDiv);
                    });
                }
                
                // Atualizar subtítulo
                const subtitulo = document.querySelector('.subtitulo');
                if (subtitulo) {
                    subtitulo.textContent = dadosAPI.referencia || `Capítulo ${capitulo}`;
                }
                
                alert('✅ Capítulo carregado com sucesso da API!');
            } else {
                throw new Error('Dados não disponíveis na API');
            }
        } catch (error) {
            if (versiculosContainer) {
                versiculosContainer.innerHTML = `
                    <div class="versiculo-placeholder">
                        <p><strong>❌ Não foi possível carregar da API</strong></p>
                        <p>Erro: ${error.message}</p>
                        <p><em>Tente novamente mais tarde ou verifique sua conexão com a internet.</em></p>
                    </div>
                `;
            }
            console.error('Erro ao carregar da API:', error);
        }
    };

    // Funcionalidade de compartilhamento
    shareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList[1];
            const referencia = document.querySelector('.nav-info')?.textContent || 'Bíblia';
            const texto = `📖 Confira este trecho da Palavra de Deus: ${referencia}`;
            const url = window.location.href;
            
            switch(platform) {
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(texto)}`);
                    break;
                case 'whatsapp':
                    window.open(`https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`);
                    break;
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`);
                    break;
                case 'copy':
                    navigator.clipboard.writeText(`${texto} ${url}`).then(() => {
                        alert('📋 Referência bíblica copiada para a área de transferência!');
                    });
                    break;
            }
        });
    });

    // Navegação entre capítulos
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!estadoAtual.livro || !estadoAtual.capitulo) {
                alert('Selecione um livro e capítulo primeiro');
                return;
            }
            
            const capituloAtual = parseInt(estadoAtual.capitulo);
            const livrosDisponiveis = estadoAtual.testamento === 'at' ? bibliaCompleta.antigoTestamento : bibliaCompleta.novoTestamento;
            const livroAtual = livrosDisponiveis.find(l => l.value === estadoAtual.livro);
            
            if (this.textContent.includes('Anterior')) {
                if (capituloAtual > 1) {
                    capituloSelect.value = capituloAtual - 1;
                    capituloSelect.dispatchEvent(new Event('change'));
                    buscarBtn.click();
                } else {
                    alert('Você já está no primeiro capítulo deste livro');
                }
            } else {
                if (capituloAtual < livroAtual.capitulos) {
                    capituloSelect.value = capituloAtual + 1;
                    capituloSelect.dispatchEvent(new Event('change'));
                    buscarBtn.click();
                } else {
                    alert('Você já está no último capítulo deste livro');
                }
            }
        });
    });

    // Inicializar com Antigo Testamento
    updateLivroSelect(bibliaCompleta.antigoTestamento);
    
    // Atalhos bíblicos
    const atalhosBtns = document.querySelectorAll('.atalho-btn');
    atalhosBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const livro = this.dataset.livro;
            const capitulo = this.dataset.capitulo;
            
            // Encontrar o testamento correto
            const livroAT = bibliaCompleta.antigoTestamento.find(l => l.value === livro);
            const livroNT = bibliaCompleta.novoTestamento.find(l => l.value === livro);
            
            if (livroAT) {
                // Ativar Antigo Testamento
                document.querySelector('[data-testamento="at"]').click();
                setTimeout(() => {
                    livroSelect.value = livro;
                    livroSelect.dispatchEvent(new Event('change'));
                    setTimeout(() => {
                        capituloSelect.value = capitulo;
                        capituloSelect.dispatchEvent(new Event('change'));
                        setTimeout(() => {
                            buscarBtn.click();
                        }, 100);
                    }, 100);
                }, 100);
            } else if (livroNT) {
                // Ativar Novo Testamento
                document.querySelector('[data-testamento="nt"]').click();
                setTimeout(() => {
                    livroSelect.value = livro;
                    livroSelect.dispatchEvent(new Event('change'));
                    setTimeout(() => {
                        capituloSelect.value = capitulo;
                        capituloSelect.dispatchEvent(new Event('change'));
                        setTimeout(() => {
                            buscarBtn.click();
                        }, 100);
                    }, 100);
                }, 100);
            }
        });
    });
    
    // ===== FUNCIONALIDADE DE BUSCA TEXTUAL =====
    if (buscarPalavraBtn && buscaPalavraInput) {
        buscarPalavraBtn.addEventListener('click', function() {
            const termoBusca = buscaPalavraInput.value.trim();
            if (!termoBusca) {
                alert('Digite uma palavra ou frase para buscar');
                return;
            }
            
            realizarBuscaTextual(termoBusca);
        });
        
        // Busca ao pressionar Enter
        buscaPalavraInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarPalavraBtn.click();
            }
        });
    }
    
    // Fechar resultados da busca
    if (fecharBuscaBtn) {
        fecharBuscaBtn.addEventListener('click', function() {
            resultadosBusca.style.display = 'none';
            bibliaTextoPrincipal.style.display = 'block';
        });
    }
    
    // Função para realizar busca textual
    function realizarBuscaTextual(termo) {
        const buscaExata = buscaExataCheckbox?.checked || false;
        const apenasTestamentoAtual = apenasTestamentoCheckbox?.checked || false;
        const testamentoAtual = estadoAtual.testamento;
        
        console.log(`🔍 Buscando: "${termo}" (Exata: ${buscaExata}, Testamento: ${apenasTestamentoAtual ? testamentoAtual : 'ambos'})`);
        
        const resultados = [];
        
        // Buscar nos textos disponíveis
        Object.keys(textosExemplo).forEach(livroKey => {
            const livro = textosExemplo[livroKey];
            
            // Verificar se deve buscar apenas no testamento atual
            if (apenasTestamentoAtual) {
                const livroAT = bibliaCompleta.antigoTestamento.find(l => l.value === livroKey);
                const livroNT = bibliaCompleta.novoTestamento.find(l => l.value === livroKey);
                
                if (testamentoAtual === 'at' && !livroAT) return;
                if (testamentoAtual === 'nt' && !livroNT) return;
            }
            
            Object.keys(livro).forEach(capituloKey => {
                const capitulo = livro[capituloKey];
                
                capitulo.versiculos.forEach((versiculo, index) => {
                    let encontrou = false;
                    
                    if (buscaExata) {
                        encontrou = versiculo.toLowerCase().includes(termo.toLowerCase());
                    } else {
                        // Busca por palavras individuais
                        const palavras = termo.toLowerCase().split(' ');
                        encontrou = palavras.every(palavra => 
                            versiculo.toLowerCase().includes(palavra.trim())
                        );
                    }
                    
                    if (encontrou) {
                        // Encontrar informações do livro
                        const infoLivro = [...bibliaCompleta.antigoTestamento, ...bibliaCompleta.novoTestamento]
                            .find(l => l.value === livroKey);
                        
                        resultados.push({
                            livro: infoLivro?.text || livroKey,
                            livroKey: livroKey,
                            capitulo: capituloKey,
                            versiculo: index + 1,
                            texto: versiculo,
                            abrev: infoLivro?.abrev || livroKey.substring(0, 3).toUpperCase()
                        });
                    }
                });
            });
        });
        
        exibirResultadosBusca(resultados, termo);
    }
    
    // Função para exibir resultados da busca
    function exibirResultadosBusca(resultados, termo) {
        if (!resultadosLista) return;
        
        // Ocultar texto principal e mostrar resultados
        if (bibliaTextoPrincipal) bibliaTextoPrincipal.style.display = 'none';
        if (resultadosBusca) resultadosBusca.style.display = 'block';
        
        if (resultados.length === 0) {
            resultadosLista.innerHTML = `
                <div class="sem-resultados">
                    <i class="fas fa-search"></i>
                    <h4>Nenhum resultado encontrado</h4>
                    <p>Não foi possível encontrar "${termo}" nos textos disponíveis.</p>
                    <p><small>Tente usar palavras diferentes ou desmarque "Busca exata"</small></p>
                </div>
            `;
            return;
        }
        
        const resultadosHTML = resultados.map(resultado => {
            // Destacar termo encontrado no texto
            let textoDestacado = resultado.texto;
            const regex = new RegExp(`(${termo})`, 'gi');
            textoDestacado = textoDestacado.replace(regex, '<span class="palavra-destacada">$1</span>');
            
            return `
                <div class="resultado-item" onclick="irParaVersiculo('${resultado.livroKey}', ${resultado.capitulo}, ${resultado.versiculo})">
                    <div class="resultado-referencia">
                        <i class="fas fa-book-open"></i>
                        ${resultado.abrev} ${resultado.capitulo}:${resultado.versiculo}
                    </div>
                    <div class="resultado-texto">${textoDestacado}</div>
                </div>
            `;
        }).join('');
        
        resultadosLista.innerHTML = `
            <div style="margin-bottom: var(--space-lg); padding: var(--space-md); background: #e3f2fd; border-radius: var(--radius-md);">
                <strong>${resultados.length} resultado(s) encontrado(s) para "${termo}"</strong>
            </div>
            ${resultadosHTML}
        `;
        
        // Scroll para os resultados
        resultadosBusca.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Função para ir para versículo específico a partir dos resultados
    window.irParaVersiculo = function(livroKey, capitulo, versiculo) {
        // Fechar resultados da busca
        if (fecharBuscaBtn) fecharBuscaBtn.click();
        
        // Encontrar o testamento correto
        const livroAT = bibliaCompleta.antigoTestamento.find(l => l.value === livroKey);
        const livroNT = bibliaCompleta.novoTestamento.find(l => l.value === livroKey);
        
        if (livroAT) {
            document.querySelector('[data-testamento="at"]').click();
        } else if (livroNT) {
            document.querySelector('[data-testamento="nt"]').click();
        }
        
        // Aguardar atualização da lista de livros e selecionar
        setTimeout(() => {
            livroSelect.value = livroKey;
            livroSelect.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                capituloSelect.value = capitulo;
                capituloSelect.dispatchEvent(new Event('change'));
                
                setTimeout(() => {
                    versiculoSelect.value = versiculo;
                    buscarBtn.click();
                }, 100);
            }, 100);
        }, 100);
    };
    
    // Carregar Gênesis 1 por padrão
    setTimeout(() => {
        livroSelect.value = 'genesis';
        livroSelect.dispatchEvent(new Event('change'));
        setTimeout(() => {
            capituloSelect.value = '1';
            capituloSelect.dispatchEvent(new Event('change'));
            setTimeout(() => {
                buscarBtn.click();
            }, 100);
        }, 100);
    }, 100);
}

function loadDemoData() {
    // Simula carregamento de notícias
    setTimeout(() => {
        console.log('📰 Notícias carregadas');
    }, 1000);

    // Simula carregamento de horários
    setTimeout(() => {
        console.log('⏰ Horários carregados');
    }, 1500);

    // Simula carregamento de eventos
    setTimeout(() => {
        console.log('📅 Eventos carregados');
    }, 2000);
}

// Função para demonstrar integração com WhatsApp (futura)
function demoWhatsApp() {
    const phoneNumber = '5515999999999'; // Número da paróquia
    const message = 'Olá! Gostaria de informações sobre os horários de missa.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    return whatsappUrl;
}

// Inicializar dados demo
loadDemoData();