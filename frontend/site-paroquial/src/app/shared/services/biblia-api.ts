import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Livro, Capitulo, Versiculo, ResultadoBusca, OpcoeBusca } from '../models/biblia';

@Injectable({
  providedIn: 'root'
})
export class BibliaApi {
  private baseURL = 'https://bible-api.com';
  private cache = new Map<string, any>();

  // Lista completa dos livros da Bíblia
  private livros: Livro[] = [
    // Antigo Testamento
    { abbrev: 'gn', name: 'Gênesis', chapters: 50, testamento: 'VT' },
    { abbrev: 'ex', name: 'Êxodo', chapters: 40, testamento: 'VT' },
    { abbrev: 'lv', name: 'Levítico', chapters: 27, testamento: 'VT' },
    { abbrev: 'nm', name: 'Números', chapters: 36, testamento: 'VT' },
    { abbrev: 'dt', name: 'Deuteronômio', chapters: 34, testamento: 'VT' },
    { abbrev: 'js', name: 'Josué', chapters: 24, testamento: 'VT' },
    { abbrev: 'jz', name: 'Juízes', chapters: 21, testamento: 'VT' },
    { abbrev: 'rt', name: 'Rute', chapters: 4, testamento: 'VT' },
    { abbrev: '1sm', name: '1 Samuel', chapters: 31, testamento: 'VT' },
    { abbrev: '2sm', name: '2 Samuel', chapters: 24, testamento: 'VT' },
    { abbrev: '1rs', name: '1 Reis', chapters: 22, testamento: 'VT' },
    { abbrev: '2rs', name: '2 Reis', chapters: 25, testamento: 'VT' },
    { abbrev: '1cr', name: '1 Crônicas', chapters: 29, testamento: 'VT' },
    { abbrev: '2cr', name: '2 Crônicas', chapters: 36, testamento: 'VT' },
    { abbrev: 'ed', name: 'Esdras', chapters: 10, testamento: 'VT' },
    { abbrev: 'ne', name: 'Neemias', chapters: 13, testamento: 'VT' },
    { abbrev: 'et', name: 'Ester', chapters: 10, testamento: 'VT' },
    { abbrev: 'jó', name: 'Jó', chapters: 42, testamento: 'VT' },
    { abbrev: 'sl', name: 'Salmos', chapters: 150, testamento: 'VT' },
    { abbrev: 'pv', name: 'Provérbios', chapters: 31, testamento: 'VT' },
    { abbrev: 'ec', name: 'Eclesiastes', chapters: 12, testamento: 'VT' },
    { abbrev: 'ct', name: 'Cantares', chapters: 8, testamento: 'VT' },
    { abbrev: 'is', name: 'Isaías', chapters: 66, testamento: 'VT' },
    { abbrev: 'jr', name: 'Jeremias', chapters: 52, testamento: 'VT' },
    { abbrev: 'lm', name: 'Lamentações', chapters: 5, testamento: 'VT' },
    { abbrev: 'ez', name: 'Ezequiel', chapters: 48, testamento: 'VT' },
    { abbrev: 'dn', name: 'Daniel', chapters: 12, testamento: 'VT' },
    { abbrev: 'os', name: 'Oséias', chapters: 14, testamento: 'VT' },
    { abbrev: 'jl', name: 'Joel', chapters: 3, testamento: 'VT' },
    { abbrev: 'am', name: 'Amós', chapters: 9, testamento: 'VT' },
    { abbrev: 'ob', name: 'Obadias', chapters: 1, testamento: 'VT' },
    { abbrev: 'jn', name: 'Jonas', chapters: 4, testamento: 'VT' },
    { abbrev: 'mq', name: 'Miqueias', chapters: 7, testamento: 'VT' },
    { abbrev: 'na', name: 'Naum', chapters: 3, testamento: 'VT' },
    { abbrev: 'hc', name: 'Habacuque', chapters: 3, testamento: 'VT' },
    { abbrev: 'sf', name: 'Sofonias', chapters: 3, testamento: 'VT' },
    { abbrev: 'ag', name: 'Ageu', chapters: 2, testamento: 'VT' },
    { abbrev: 'zc', name: 'Zacarias', chapters: 14, testamento: 'VT' },
    { abbrev: 'ml', name: 'Malaquias', chapters: 4, testamento: 'VT' },

    // Novo Testamento
    { abbrev: 'mt', name: 'Mateus', chapters: 28, testamento: 'NT' },
    { abbrev: 'mc', name: 'Marcos', chapters: 16, testamento: 'NT' },
    { abbrev: 'lc', name: 'Lucas', chapters: 24, testamento: 'NT' },
    { abbrev: 'jo', name: 'João', chapters: 21, testamento: 'NT' },
    { abbrev: 'at', name: 'Atos', chapters: 28, testamento: 'NT' },
    { abbrev: 'rm', name: 'Romanos', chapters: 16, testamento: 'NT' },
    { abbrev: '1co', name: '1 Coríntios', chapters: 16, testamento: 'NT' },
    { abbrev: '2co', name: '2 Coríntios', chapters: 13, testamento: 'NT' },
    { abbrev: 'gl', name: 'Gálatas', chapters: 6, testamento: 'NT' },
    { abbrev: 'ef', name: 'Efésios', chapters: 6, testamento: 'NT' },
    { abbrev: 'fp', name: 'Filipenses', chapters: 4, testamento: 'NT' },
    { abbrev: 'cl', name: 'Colossenses', chapters: 4, testamento: 'NT' },
    { abbrev: '1ts', name: '1 Tessalonicenses', chapters: 5, testamento: 'NT' },
    { abbrev: '2ts', name: '2 Tessalonicenses', chapters: 3, testamento: 'NT' },
    { abbrev: '1tm', name: '1 Timóteo', chapters: 6, testamento: 'NT' },
    { abbrev: '2tm', name: '2 Timóteo', chapters: 4, testamento: 'NT' },
    { abbrev: 'tt', name: 'Tito', chapters: 3, testamento: 'NT' },
    { abbrev: 'fm', name: 'Filemom', chapters: 1, testamento: 'NT' },
    { abbrev: 'hb', name: 'Hebreus', chapters: 13, testamento: 'NT' },
    { abbrev: 'tg', name: 'Tiago', chapters: 5, testamento: 'NT' },
    { abbrev: '1pe', name: '1 Pedro', chapters: 5, testamento: 'NT' },
    { abbrev: '2pe', name: '2 Pedro', chapters: 3, testamento: 'NT' },
    { abbrev: '1jo', name: '1 João', chapters: 5, testamento: 'NT' },
    { abbrev: '2jo', name: '2 João', chapters: 1, testamento: 'NT' },
    { abbrev: '3jo', name: '3 João', chapters: 1, testamento: 'NT' },
    { abbrev: 'jd', name: 'Judas', chapters: 1, testamento: 'NT' },
    { abbrev: 'ap', name: 'Apocalipse', chapters: 22, testamento: 'NT' }
  ];

  constructor(private http: HttpClient) { }

  // Obter lista de livros
  getLivros(testamento?: 'VT' | 'NT'): Livro[] {
    if (testamento) {
      return this.livros.filter(livro => livro.testamento === testamento);
    }
    return this.livros;
  }

  // Buscar livro por abreviação ou nome
  getLivro(identificador: string): Livro | undefined {
    return this.livros.find(livro => 
      livro.abbrev === identificador.toLowerCase() || 
      livro.name.toLowerCase() === identificador.toLowerCase()
    );
  }

  // Buscar capítulo específico
  buscarCapitulo(livro: string, capitulo: number): Observable<Capitulo | null> {
    const chave = `${livro}_${capitulo}`;
    
    if (this.cache.has(chave)) {
      return of(this.cache.get(chave));
    }

    // Primeiro tentar dados locais para versículos conhecidos
    const capituloLocal = this.getCapituloLocal(livro, capitulo);
    if (capituloLocal) {
      this.cache.set(chave, capituloLocal);
      return of(capituloLocal);
    }

    // Se não encontrar localmente, tentar API externa
    return this.buscarNaAPIExterna(livro, capitulo);
  }

  // Buscar na API externa
  private buscarNaAPIExterna(livro: string, capitulo: number): Observable<Capitulo | null> {
    const livroObj = this.getLivro(livro);
    if (!livroObj) {
      return of(null);
    }

    // Mapear nome para português para API
    const livroPortugues = this.mapearLivroParaIngles(livroObj.abbrev);
    const url = `${this.baseURL}/${encodeURIComponent(livroPortugues)}+${capitulo}?translation=almeida`;

    return this.http.get<any>(url).pipe(
      map(data => this.processarCapitulo(data, livroObj)),
      catchError(error => {
        console.warn(`Erro ao buscar ${livro} ${capitulo}:`, error);
        return of(this.getCapituloFallback(livroObj, capitulo));
      })
    );
  }

  // Processar dados da API
  private processarCapitulo(data: any, livro: Livro): Capitulo | null {
    if (!data || !data.verses) {
      return null;
    }

    const versiculos: Versiculo[] = data.verses.map((v: any) => ({
      book: livro.name,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text.trim()
    }));

    return {
      book: livro,
      chapter: data.chapter,
      verses: versiculos
    };
  }

  // Buscar texto na Bíblia
  buscarTexto(termo: string, opcoes: OpcoeBusca = {}): Observable<ResultadoBusca[]> {
    const { buscaExata = false, testamento = null, limite = 50 } = opcoes;
    
    console.log(`🔍 Buscando "${termo}" na Bíblia...`);
    
    // Buscar localmente primeiro
    const resultadosLocais = this.buscarNosTextosSalvos(termo, buscaExata, testamento);
    
    // Se encontrou resultados locais suficientes, retornar
    if (resultadosLocais.length >= 10) {
      return of(resultadosLocais.slice(0, limite));
    }
    
    // Buscar na API externa para complementar
    return this.buscarNaAPIExternaCompleta(termo, buscaExata, testamento, limite).pipe(
      map(resultadosAPI => {
        // Combinar resultados locais com API (evitando duplicatas)
        const todosResultados = [...resultadosLocais];
        
        for (const resultado of resultadosAPI) {
          const jaExiste = todosResultados.some(r =>
            r.livro === resultado.livro &&
            r.capitulo === resultado.capitulo &&
            r.versiculo === resultado.versiculo
          );
          
          if (!jaExiste) {
            todosResultados.push(resultado);
          }
        }
        
        console.log(`✅ Total de ${todosResultados.length} resultados encontrados`);
        return todosResultados.slice(0, limite);
      }),
      catchError(error => {
        console.warn('Erro na busca externa, usando apenas resultados locais:', error);
        return of(resultadosLocais.slice(0, limite));
      })
    );
  }

  // Buscar na API externa em múltiplos livros
  private buscarNaAPIExternaCompleta(termo: string, buscaExata: boolean, testamento: 'VT' | 'NT' | null, limite: number): Observable<ResultadoBusca[]> {
    const livrosParaBuscar = testamento ? this.getLivros(testamento) : this.getLivros();
    
    console.log(`🔎 Buscando na API externa em ${livrosParaBuscar.length} livros...`);
    
    // Buscar em livros estratégicos (não apenas os primeiros)
    let livrosEstrategicos: Livro[] = [];
    
    if (testamento === 'NT') {
      // Novo Testamento: Evangelhos + Epístolas principais
      livrosEstrategicos = livrosParaBuscar.filter(l => 
        ['mt', 'mc', 'lc', 'jo', 'at', 'rm', '1co', 'ef', 'fp', 'hb'].includes(l.abbrev)
      );
    } else if (testamento === 'VT') {
      // Antigo Testamento: Pentateuco + Proféticos + Salmos
      livrosEstrategicos = livrosParaBuscar.filter(l => 
        ['gn', 'ex', 'dt', 'js', 'sl', 'pv', 'is', 'jr', 'ez', 'dn'].includes(l.abbrev)
      );
    } else {
      // Toda Bíblia: livros mais importantes de ambos
      livrosEstrategicos = livrosParaBuscar.filter(l => 
        ['gn', 'ex', 'sl', 'is', 'mt', 'jo', 'at', 'rm', '1co', 'ap'].includes(l.abbrev)
      );
    }
    
    // Se não encontrou livros estratégicos, pegar os primeiros 10
    if (livrosEstrategicos.length === 0) {
      livrosEstrategicos = livrosParaBuscar.slice(0, 10);
    }
    
    console.log(`📚 Selecionados ${livrosEstrategicos.length} livros para busca:`, livrosEstrategicos.map(l => l.name).join(', '));
    
    const buscas = livrosEstrategicos.map(livro => 
      this.buscarEmLivro(livro, termo, buscaExata).pipe(
        catchError(error => {
          console.warn(`⚠️ Erro ao buscar em ${livro.name}:`, error);
          return of([]);
        })
      )
    );
    
    // Se não houver buscas, retornar array vazio
    if (buscas.length === 0) {
      return of([]);
    }
    
    return forkJoin(buscas).pipe(
      map(arrays => {
        const resultados = arrays.flat();
        console.log(`✅ API retornou ${resultados.length} resultados`);
        return resultados.slice(0, limite);
      }),
      catchError(error => {
        console.error('❌ Erro no forkJoin:', error);
        return of([]);
      })
    );
  }

  // Buscar termo em um livro específico
  private buscarEmLivro(livro: Livro, termo: string, buscaExata: boolean): Observable<ResultadoBusca[]> {
    const termoLower = termo.toLowerCase();
    
    // Estratégia de amostragem inteligente: buscar em capítulos distribuídos
    const totalCapitulos = livro.chapters;
    let capitulosParaBuscar: number[];
    
    if (totalCapitulos <= 10) {
      // Livros pequenos: buscar todos os capítulos
      capitulosParaBuscar = Array.from({length: totalCapitulos}, (_, i) => i + 1);
    } else {
      // Livros grandes: amostragem distribuída (início, meio, fim + alguns aleatórios)
      capitulosParaBuscar = [
        1, // Primeiro capítulo
        Math.floor(totalCapitulos * 0.25), // 25%
        Math.floor(totalCapitulos * 0.5),  // Meio
        Math.floor(totalCapitulos * 0.75), // 75%
        totalCapitulos // Último capítulo
      ];
    }
    
    console.log(`  📖 Buscando em ${livro.name} (capítulos ${capitulosParaBuscar.join(', ')})`);
    
    const buscasCapitulos: Observable<ResultadoBusca[]>[] = capitulosParaBuscar.map(cap =>
      this.buscarCapitulo(livro.abbrev, cap).pipe(
        map(capitulo => {
          if (!capitulo || !capitulo.verses) return [];
          
          const resultadosCap: ResultadoBusca[] = [];
          for (const versiculo of capitulo.verses) {
            const textoLower = versiculo.text.toLowerCase();
            let encontrou = false;
            
            if (buscaExata) {
              encontrou = textoLower.includes(termoLower);
            } else {
              const palavras = termoLower.split(' ').filter(p => p.length > 2);
              encontrou = palavras.some(palavra => textoLower.includes(palavra));
            }
            
            if (encontrou) {
              resultadosCap.push({
                livro: versiculo.book,
                capitulo: versiculo.chapter,
                versiculo: versiculo.verse,
                texto: versiculo.text,
                referencia: `${versiculo.book} ${versiculo.chapter}:${versiculo.verse}`,
                fonte: 'API'
              });
            }
          }
          return resultadosCap;
        }),
        catchError(error => {
          console.warn(`    ⚠️ Erro no capítulo ${cap}:`, error.message);
          return of([]);
        })
      )
    );
    
    // Se não há capítulos para buscar, retornar array vazio
    if (buscasCapitulos.length === 0) {
      return of([]);
    }
    
    return forkJoin(buscasCapitulos).pipe(
      map(arrays => {
        const resultados = arrays.flat();
        if (resultados.length > 0) {
          console.log(`    ✅ ${resultados.length} resultados em ${livro.name}`);
        }
        return resultados;
      }),
      catchError(error => {
        console.error(`    ❌ Erro em ${livro.name}:`, error);
        return of([]);
      })
    );
  }

  // Buscar nos textos salvos localmente
  private buscarNosTextosSalvos(termo: string, buscaExata: boolean, testamento: 'VT' | 'NT' | null): ResultadoBusca[] {
    const resultados: ResultadoBusca[] = [];
    const termoLower = termo.toLowerCase();

    // Buscar nos versículos conhecidos (exemplos)
    const versiculosConhecidos = this.getVersiculosConhecidos();
    
    for (const versiculo of versiculosConhecidos) {
      const livroObj = this.getLivro(versiculo.livro);
      if (testamento && livroObj && livroObj.testamento !== testamento) {
        continue;
      }

      const textoLower = versiculo.texto.toLowerCase();
      let encontrou = false;

      if (buscaExata) {
        encontrou = textoLower.includes(termoLower);
      } else {
        const palavras = termoLower.split(' ').filter(p => p.length > 2); // Ignorar palavras muito curtas
        encontrou = palavras.some(palavra => textoLower.includes(palavra));
      }

      if (encontrou) {
        resultados.push({
          livro: versiculo.livro,
          capitulo: versiculo.capitulo,
          versiculo: versiculo.versiculo,
          texto: versiculo.texto,
          referencia: `${versiculo.livro} ${versiculo.capitulo}:${versiculo.versiculo}`,
          fonte: 'Local'
        });
      }
    }

    // Buscar também nos capítulos já carregados no cache
    this.cache.forEach((capitulo: Capitulo, chave: string) => {
      if (!capitulo || !capitulo.verses) return;
      
      const livroObj = capitulo.book;
      if (testamento && livroObj.testamento !== testamento) {
        return;
      }

      for (const versiculo of capitulo.verses) {
        const textoLower = versiculo.text.toLowerCase();
        let encontrou = false;

        if (buscaExata) {
          encontrou = textoLower.includes(termoLower);
        } else {
          const palavras = termoLower.split(' ').filter(p => p.length > 2);
          encontrou = palavras.some(palavra => textoLower.includes(palavra));
        }

        if (encontrou) {
          // Verificar se já não foi adicionado (evitar duplicatas)
          const jaExiste = resultados.some(r => 
            r.livro === versiculo.book && 
            r.capitulo === versiculo.chapter && 
            r.versiculo === versiculo.verse
          );

          if (!jaExiste) {
            resultados.push({
              livro: versiculo.book,
              capitulo: versiculo.chapter,
              versiculo: versiculo.verse,
              texto: versiculo.text,
              referencia: `${versiculo.book} ${versiculo.chapter}:${versiculo.verse}`,
              fonte: 'Cache'
            });
          }
        }
      }
    });

    console.log(`✅ Encontrados ${resultados.length} resultados para "${termo}"`);
    return resultados;
  }

  // Mapear livro para nome em português (para API externa)
  private mapearLivroParaIngles(abbrev: string): string {
    const mapeamento: { [key: string]: string } = {
      // Antigo Testamento
      'gn': 'Gênesis',
      'ex': 'Êxodo',
      'lv': 'Levítico',
      'nm': 'Números',
      'dt': 'Deuteronômio',
      'js': 'Josué',
      'jz': 'Juízes',
      'rt': 'Rute',
      '1sm': '1%20Samuel',
      '2sm': '2%20Samuel',
      '1rs': '1%20Reis',
      '2rs': '2%20Reis',
      '1cr': '1%20Crônicas',
      '2cr': '2%20Crônicas',
      'ed': 'Esdras',
      'ne': 'Neemias',
      'et': 'Ester',
      'jó': 'Jó',
      'sl': 'Salmos',
      'pv': 'Provérbios',
      'ec': 'Eclesiastes',
      'ct': 'Cantares',
      'is': 'Isaías',
      'jr': 'Jeremias',
      'lm': 'Lamentações',
      'ez': 'Ezequiel',
      'dn': 'Daniel',
      'os': 'Oséias',
      'jl': 'Joel',
      'am': 'Amós',
      'ob': 'Obadias',
      'jn': 'Jonas',
      'mq': 'Miqueias',
      'na': 'Naum',
      'hc': 'Habacuque',
      'sf': 'Sofonias',
      'ag': 'Ageu',
      'zc': 'Zacarias',
      'ml': 'Malaquias',
      
      // Novo Testamento
      'mt': 'Mateus',
      'mc': 'Marcos',
      'lc': 'Lucas',
      'jo': 'João',
      'at': 'Atos',
      'rm': 'Romanos',
      '1co': '1%20Coríntios',
      '2co': '2%20Coríntios',
      'gl': 'Gálatas',
      'ef': 'Efésios',
      'fp': 'Filipenses',
      'cl': 'Colossenses',
      '1ts': '1%20Tessalonicenses',
      '2ts': '2%20Tessalonicenses',
      '1tm': '1%20Timóteo',
      '2tm': '2%20Timóteo',
      'tt': 'Tito',
      'fm': 'Filemom',
      'hb': 'Hebreus',
      'tg': 'Tiago',
      '1pe': '1%20Pedro',
      '2pe': '2%20Pedro',
      '1jo': '1%20João',
      '2jo': '2%20João',
      '3jo': '3%20João',
      'jd': 'Judas',
      'ap': 'Apocalipse'
    };
    
    return mapeamento[abbrev] || abbrev;
  }

  // Dados locais para alguns capítulos (fallback)
  private getCapituloLocal(livro: string, capitulo: number): Capitulo | null {
    const livroObj = this.getLivro(livro);
    if (!livroObj) return null;

    // Salmo 23 como exemplo
    if (livroObj.abbrev === 'sl' && capitulo === 23) {
      return {
        book: livroObj,
        chapter: 23,
        verses: [
          { book: 'Salmos', chapter: 23, verse: 1, text: 'O Senhor é o meu pastor; nada me faltará.' },
          { book: 'Salmos', chapter: 23, verse: 2, text: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.' },
          { book: 'Salmos', chapter: 23, verse: 3, text: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.' },
          { book: 'Salmos', chapter: 23, verse: 4, text: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
          { book: 'Salmos', chapter: 23, verse: 5, text: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.' },
          { book: 'Salmos', chapter: 23, verse: 6, text: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' }
        ]
      };
    }

    // João 3:16
    if (livroObj.abbrev === 'jo' && capitulo === 3) {
      return {
        book: livroObj,
        chapter: 3,
        verses: [
          { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' }
        ]
      };
    }

    return null;
  }

  // Fallback para capítulo
  private getCapituloFallback(livro: Livro, capitulo: number): Capitulo {
    return {
      book: livro,
      chapter: capitulo,
      verses: [
        {
          book: livro.name,
          chapter: capitulo,
          verse: 1,
          text: `Conteúdo de ${livro.name} ${capitulo} estará disponível em breve. Esta é uma versão de demonstração.`
        }
      ]
    };
  }

  // Versículos conhecidos para busca
  private getVersiculosConhecidos() {
    return [
      // Versículos sobre amor
      { livro: 'João', capitulo: 3, versiculo: 16, texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
      { livro: '1 Coríntios', capitulo: 13, versiculo: 4, texto: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.' },
      { livro: '1 Coríntios', capitulo: 13, versiculo: 13, texto: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três; porém o maior destes é o amor.' },
      { livro: '1 João', capitulo: 4, versiculo: 8, texto: 'Aquele que não ama não conhece a Deus, porque Deus é amor.' },
      { livro: 'Romanos', capitulo: 8, versiculo: 39, texto: 'Nem a altura, nem a profundidade, nem qualquer outra coisa na criação será capaz de nos separar do amor de Deus que está em Cristo Jesus, nosso Senhor.' },
      
      // Versículos sobre fé e esperança
      { livro: 'Hebreus', capitulo: 11, versiculo: 1, texto: 'Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.' },
      { livro: 'Romanos', capitulo: 10, versiculo: 17, texto: 'Consequentemente, a fé vem por ouvir a mensagem, e a mensagem é ouvida mediante a palavra de Cristo.' },
      { livro: 'Jeremias', capitulo: 29, versiculo: 11, texto: 'Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.' },
      
      // Versículos sobre força e coragem
      { livro: 'Filipenses', capitulo: 4, versiculo: 13, texto: 'Posso todas as coisas em Cristo que me fortalece.' },
      { livro: 'Josué', capitulo: 1, versiculo: 9, texto: 'Não fui eu que lhe ordenei? Seja forte e corajoso! Não se apavore, nem se desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.' },
      { livro: 'Isaías', capitulo: 41, versiculo: 10, texto: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.' },
      { livro: 'Salmos', capitulo: 46, versiculo: 1, texto: 'Deus é o nosso refúgio e fortaleza, auxílio sempre presente na adversidade.' },
      
      // Versículos sobre paz
      { livro: 'João', capitulo: 14, versiculo: 27, texto: 'Deixo-lhes a paz; a minha paz lhes dou. Não a dou como o mundo a dá. Não se perturbe o seu coração, nem tenham medo.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: 7, texto: 'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e as vossas mentes em Cristo Jesus.' },
      { livro: 'Mateus', capitulo: 5, versiculo: 9, texto: 'Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus.' },
      
      // Salmos conhecidos
      { livro: 'Salmos', capitulo: 23, versiculo: 1, texto: 'O Senhor é o meu pastor; nada me faltará.' },
      { livro: 'Salmos', capitulo: 23, versiculo: 4, texto: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
      { livro: 'Salmos', capitulo: 27, versiculo: 1, texto: 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?' },
      { livro: 'Salmos', capitulo: 91, versiculo: 1, texto: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.' },
      { livro: 'Salmos', capitulo: 121, versiculo: 1, texto: 'Levanto os meus olhos para os montes; de onde me virá o socorro?' },
      { livro: 'Salmos', capitulo: 121, versiculo: 2, texto: 'O meu socorro vem do Senhor, que fez o céu e a terra.' },
      
      // Versículos sobre sabedoria
      { livro: 'Provérbios', capitulo: 3, versiculo: 5, texto: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.' },
      { livro: 'Provérbios', capitulo: 3, versiculo: 6, texto: 'Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.' },
      { livro: 'Tiago', capitulo: 1, versiculo: 5, texto: 'Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente, de boa vontade; e lhe será concedida.' },
      
      // Versículos sobre salvação e graça
      { livro: 'Efésios', capitulo: 2, versiculo: 8, texto: 'Porque pela graça sois salvos, por meio da fé; e isto não vem de vós; é dom de Deus.' },
      { livro: 'Atos', capitulo: 4, versiculo: 12, texto: 'E em nenhum outro há salvação, porque também debaixo do céu nenhum outro nome há, dado entre os homens, pelo qual devamos ser salvos.' },
      { livro: 'Romanos', capitulo: 3, versiculo: 23, texto: 'Porque todos pecaram e destituídos estão da glória de Deus.' },
      { livro: 'Romanos', capitulo: 6, versiculo: 23, texto: 'Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna, por Cristo Jesus nosso Senhor.' },
      
      // Versículos sobre oração
      { livro: 'Mateus', capitulo: 6, versiculo: 9, texto: 'Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome.' },
      { livro: 'Mateus', capitulo: 7, versiculo: 7, texto: 'Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.' },
      { livro: '1 Tessalonicenses', capitulo: 5, versiculo: 17, texto: 'Orai sem cessar.' },
      
      // Versículos sobre vida e propósito
      { livro: 'Romanos', capitulo: 8, versiculo: 28, texto: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.' },
      { livro: 'Eclesiastes', capitulo: 3, versiculo: 1, texto: 'Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.' },
      { livro: 'Provérbios', capitulo: 16, versiculo: 3, texto: 'Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.' },
      
      // Versículos sobre perdão
      { livro: 'Mateus', capitulo: 6, versiculo: 14, texto: 'Porque, se perdoardes aos homens as suas ofensas, também vosso Pai celestial vos perdoará a vós.' },
      { livro: '1 João', capitulo: 1, versiculo: 9, texto: 'Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça.' },
      
      // Versículos sobre família
      { livro: 'Provérbios', capitulo: 22, versiculo: 6, texto: 'Ensina a criança no caminho em que deve andar; e até quando envelhecer não se desviará dele.' },
      { livro: 'Josué', capitulo: 24, versiculo: 15, texto: 'Porém, se vos parece mal aos vossos olhos servir ao Senhor, escolhei hoje a quem sirvais; mas eu e a minha casa serviremos ao Senhor.' },
      
      // Versículos sobre alegria
      { livro: 'Salmos', capitulo: 118, versiculo: 24, texto: 'Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: 4, texto: 'Regozijai-vos sempre no Senhor; outra vez digo, regozijai-vos.' },
      { livro: 'Neemias', capitulo: 8, versiculo: 10, texto: 'Não vos entristeçais; porque a alegria do Senhor é a vossa força.' }
    ];
  }

  /**
   * Buscar versículo específico na API com tradução Almeida
   * Exemplo: buscarVersiculo('João', 3, 16)
   */
  buscarVersiculo(livro: string, capitulo: number, versiculo: number): Observable<Versiculo | null> {
    const livroObj = this.getLivro(livro);
    if (!livroObj) {
      return of(null);
    }

    const livroPortugues = this.mapearLivroParaIngles(livroObj.abbrev);
    const url = `${this.baseURL}/${encodeURIComponent(livroPortugues)}+${capitulo}:${versiculo}?translation=almeida`;

    return this.http.get<any>(url).pipe(
      map(data => {
        if (!data || !data.verses || data.verses.length === 0) {
          return null;
        }
        
        const verse = data.verses[0];
        return {
          book: livroObj.name,
          chapter: capitulo,
          verse: versiculo,
          text: verse.text || 'Texto não disponível'
        };
      }),
      catchError(error => {
        console.warn(`Erro ao buscar ${livro} ${capitulo}:${versiculo}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Buscar passagem bíblica completa com tradução Almeida
   * Exemplo: buscarPassagem('João', 3, 16, 17) para João 3:16-17
   */
  buscarPassagem(livro: string, capitulo: number, versiculoInicio: number, versiculoFim?: number): Observable<Versiculo[]> {
    const livroObj = this.getLivro(livro);
    if (!livroObj) {
      return of([]);
    }

    const livroPortugues = this.mapearLivroParaIngles(livroObj.abbrev);
    let url: string;
    
    if (versiculoFim && versiculoFim !== versiculoInicio) {
      url = `${this.baseURL}/${encodeURIComponent(livroPortugues)}+${capitulo}:${versiculoInicio}-${versiculoFim}?translation=almeida`;
    } else {
      url = `${this.baseURL}/${encodeURIComponent(livroPortugues)}+${capitulo}:${versiculoInicio}?translation=almeida`;
    }

    return this.http.get<any>(url).pipe(
      map(data => {
        if (!data || !data.verses) {
          return [];
        }
        
        return data.verses.map((verse: any) => ({
          book: livroObj.name,
          chapter: capitulo,
          verse: this.extrairNumeroVersiculo(verse.verse),
          text: verse.text || 'Texto não disponível'
        }));
      }),
      catchError(error => {
        console.warn(`Erro ao buscar passagem ${livro} ${capitulo}:${versiculoInicio}-${versiculoFim}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Extrair número do versículo da string de referência da API
   */
  private extrairNumeroVersiculo(verseReference: string): number {
    const match = verseReference.match(/:(\d+)$/);
    return match ? parseInt(match[1], 10) : 1;
  }
}
