import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LiturgiaData, SantoData, LiturgiaDiaCompleta, ApiLiturgiaResponse, ApiSantoResponse } from '../models/liturgia';

@Injectable({
  providedIn: 'root'
})
export class LiturgiaApi {

  // URLs das APIs reais
  private readonly API_LITURGIA = 'https://liturgia.up.railway.app/v2'; // API Liturgia Diária
  private readonly API_CALENDARIO = 'https://church-calendar-api.herokuapp.com/api/v0/en/calendars/default'; // API Calendário Litúrgico
  
  constructor(private http: HttpClient) { }

  /**
   * Busca a liturgia do dia usando a API real
   */
  getLiturgiaDoDia(data?: string): Observable<LiturgiaData> {
    let apiUrl = this.API_LITURGIA;
    
    // Se data específica foi fornecida, formata a URL
    if (data) {
      // Converte formato YYYY-MM-DD para DD/MM/YYYY se necessário
      let dataFormatada = data;
      if (data.includes('-')) {
        const [ano, mes, dia] = data.split('-');
        dataFormatada = `${dia}/${mes}/${ano}`;
      }
      
      const [dia, mes, ano] = dataFormatada.split('/');
      apiUrl += `?dia=${dia}&mes=${mes}&ano=${ano}`;
    }
    
    return this.http.get<any>(apiUrl).pipe(
      map(response => this.transformarRespostaLiturgia(response)),
      catchError(error => {
        console.error('Erro ao buscar liturgia:', error);
        return of(this.getLiturgiaFallback(data || this.formatarDataHoje()));
      })
    );
  }

  /**
   * Busca múltiplos dias da liturgia (período)
   */
  getLiturgiaPeriodo(dias: number = 7): Observable<LiturgiaData[]> {
    const apiUrl = `${this.API_LITURGIA}?periodo=${Math.min(dias, 7)}`;
    
    return this.http.get<any[]>(apiUrl).pipe(
      map(responses => responses.map(response => this.transformarRespostaLiturgia(response))),
      catchError(error => {
        console.error('Erro ao buscar período de liturgia:', error);
        return of([this.getLiturgiaFallback(this.formatarDataHoje())]);
      })
    );
  }

  /**
   * Busca informações do calendário litúrgico
   */
  getCalendarioLiturgico(ano?: number): Observable<any> {
    const anoConsulta = ano || new Date().getFullYear();
    const apiUrl = `${this.API_CALENDARIO}/${anoConsulta}`;
    
    return this.http.get<any>(apiUrl).pipe(
      catchError(error => {
        console.error('Erro ao buscar calendário litúrgico:', error);
        return of({
          year: anoConsulta,
          seasons: [
            { name: 'Advento', start: '2025-12-01', end: '2025-12-24', color: 'roxo' },
            { name: 'Natal', start: '2025-12-25', end: '2026-01-13', color: 'branco' },
            { name: 'Tempo Comum', start: '2026-01-14', end: '2026-03-05', color: 'verde' },
            { name: 'Quaresma', start: '2026-03-06', end: '2026-04-18', color: 'roxo' },
            { name: 'Páscoa', start: '2026-04-19', end: '2026-06-07', color: 'branco' },
            { name: 'Tempo Comum', start: '2026-06-08', end: '2026-11-30', color: 'verde' }
          ]
        });
      })
    );
  }

  /**
   * Busca o santo do dia
   */
  getSantoDoDia(data?: string): Observable<SantoData> {
    const dataConsulta = data || this.formatarDataHoje();
    
    // TODO: Implementar chamada para API real quando disponível
    // return this.http.get<ApiSantoResponse>(`${this.API_SANTO}/santo/${dataConsulta}`)
    //   .pipe(
    //     map(response => response.data),
    //     catchError(() => this.getSantoFallback(dataConsulta))
    //   );

    // Por enquanto, retorna dados mock
    return of(this.getSantoFallback(dataConsulta));
  }

  /**
   * Busca liturgia e santo do dia em uma única chamada
   */
  getLiturgiaDiaCompleta(data?: string): Observable<LiturgiaDiaCompleta> {
    const dataConsulta = data || this.formatarDataHoje();
    
    return new Observable(observer => {
      // Busca liturgia e santo em paralelo
      Promise.all([
        this.getLiturgiaDoDia(dataConsulta).toPromise(),
        this.getSantoDoDia(dataConsulta).toPromise()
      ]).then(([liturgia, santo]) => {
        observer.next({
          liturgia: liturgia!,
          santo: santo!
        });
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  /**
   * Busca liturgia de uma data específica
   */
  getLiturgiaPorData(ano: number, mes: number, dia: number): Observable<LiturgiaData> {
    const data = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    return this.getLiturgiaDoDia(data);
  }

  /**
   * Dados de fallback para quando a API não estiver disponível
   */
  private getLiturgiaFallback(data: string): LiturgiaData {
    const hoje = new Date();
    const diaDaSemana = this.getDiaDaSemana(hoje.getDay());
    
    return {
      data: data,
      titulo: `${this.getSemanaTempo()} | ${diaDaSemana}`,
      tempo_liturgico: "tempo_comum",
      cor_liturgica: "verde",
      primeira_leitura: {
        titulo: "Primeira Leitura",
        referencia: "Rm 4,20-25",
        texto: "Irmãos, diante da promessa divina, Abraão não duvidou por falta de fé, mas revigorou-se na fé e deu glória a Deus, convencido de que Deus tem poder para cumprir o que prometeu..."
      },
      salmo: {
        referencia: "Sl 1,1-3.4-6",
        refrao: "Bem-aventurados os que esperam no Senhor!",
        texto: "Bem-aventurado o homem que não anda segundo o conselho dos ímpios, nem se detém no caminho dos pecadores, nem se assenta na roda dos escarnecedores. — Mas tem seu prazer na lei do Senhor, e na sua lei medita de dia e de noite."
      },
      evangelho: {
        titulo: "Evangelho",
        referencia: "Lc 12,13-21",
        texto: "Naquele tempo, alguém da multidão disse a Jesus: 'Mestre, dize a meu irmão que reparta comigo a herança.' Jesus respondeu: 'Homem, quem me constituiu juiz ou repartidor entre vós?'"
      },
      oracao_coleta: "Ó Deus todo-poderoso e eterno, a quem ousamos chamar de Pai, fazei crescer em nossos corações o espírito filial.",
      oracao_oferendas: "Acolhei, ó Deus, as oferendas que vos apresentamos e fazei que nos sirvam de remédio para a vida eterna.",
      oracao_comunhao: "Derramai sobre nós, Senhor, o espírito do vosso amor, e fazei que vivam na concórdia os que nutris com o mesmo pão do céu.",
      reflexao: "A liturgia de hoje nos convida a refletir sobre a fé de Abraão e nossa confiança em Deus..."
    };
  }

  private getSantoFallback(data: string): SantoData {
    return {
      data: data,
      santo_principal: {
        nome: "Santa Maria Bertilla Boscardin",
        titulo: "Enfermeira e Religiosa",
        biografia: "Santa Maria Bertilla Boscardin nasceu em 1888, em Brendola, Itália. Dedicou sua vida ao cuidado dos doentes, especialmente durante a Primeira Guerra Mundial. Foi canonizada em 1961 pelo Papa João XXIII.",
        oracao: "Santa Maria Bertilla, enfermeira do corpo e da alma, amparai os doentes que a ti recorrem, dando a eles a cura completa e total. Intercedei pelos hospitais e clínicas, pelos médicos e profissionais da saúde. Amém.",
        data_nascimento: "06/10/1888",
        data_morte: "20/10/1922",
        canonizado_por: "Papa João XXIII",
        festa_liturgica: "20 de outubro",
        padroeiro_de: ["Enfermeiros", "Hospitais", "Doentes"],
        imagem_url: "assets/images/santos/santa-maria-bertilla.jpg"
      },
      outros_santos: [
        {
          nome: "São Cornélio",
          titulo: "Centurião e Mártir",
          biografia: "Centurião romano que foi batizado por São Pedro, sendo uma das primícias da Igreja dos gentios.",
          festa_liturgica: "20 de outubro"
        }
      ]
    };
  }

  /**
   * Transforma a resposta da API externa para o formato interno
   */
  private transformarRespostaLiturgia(apiResponse: any): LiturgiaData {
    // Log para debug
    console.log('Resposta da API:', apiResponse);
    
    // Extrair título correto - priorizar dia da semana do tempo comum
    const tituloExtraido = this.extrairTituloLiturgico(apiResponse);
    
    return {
      data: apiResponse.data || this.formatarDataHoje(),
      titulo: tituloExtraido,
      cor_liturgica: this.mapearCorLiturgica(apiResponse.cor),
      tempo_liturgico: this.extrairTempoLiturgico(apiResponse.liturgia),
      primeira_leitura: this.extrairPrimeiraLeitura(apiResponse.leituras),
      salmo: this.extrairSalmo(apiResponse.leituras),
      segunda_leitura: this.extrairSegundaLeitura(apiResponse.leituras),
      evangelho: this.extrairEvangelho(apiResponse.leituras),
      oracao_coleta: apiResponse.oracoes?.coleta || '',
      oracao_oferendas: apiResponse.oracoes?.oferendas || '',
      oracao_comunhao: apiResponse.oracoes?.comunhao || '',
      reflexao: this.gerarReflexaoPadrao(apiResponse.leituras?.evangelho?.[0]?.texto)
    };
  }

  private mapearCorLiturgica(cor: string): string {
    const mapeamento: { [key: string]: string } = {
      'Verde': 'verde',
      'Vermelho': 'vermelho', 
      'Roxo': 'roxo',
      'Rosa': 'rosa',
      'Branco': 'branco'
    };
    return mapeamento[cor] || 'verde';
  }

  private extrairTituloLiturgico(apiResponse: any): string {
    // Se existe um campo específico para o dia/título litúrgico
    if (apiResponse.dia) return apiResponse.dia;
    
    // Tenta extrair do campo liturgia
    const liturgia = apiResponse.liturgia || '';
    
    // Se contém informação de semana do tempo comum, extrai isso
    const regexSemana = /(\d+ª Semana do Tempo Comum|Domingo do Tempo Comum|Segunda-feira da \d+ª Semana|Terça-feira da \d+ª Semana|Quarta-feira da \d+ª Semana|Quinta-feira da \d+ª Semana|Sexta-feira da \d+ª Semana|Sábado da \d+ª Semana)/i;
    const match = liturgia.match(regexSemana);
    if (match) return match[0];
    
    // Gera título baseado no dia da semana atual
    const hoje = new Date();
    const diaSemana = this.getDiaDaSemana(hoje.getDay());
    const numeroSemana = Math.ceil((hoje.getDate() + 6) / 7); // Estimativa
    
    // Se é uma celebração especial (santo, memória, etc), mostra o dia do tempo comum
    if (liturgia.includes('Santa') || liturgia.includes('Santo') || liturgia.includes('Memória') || liturgia.includes('Festa')) {
      return `${diaSemana} da ${numeroSemana}ª Semana do Tempo Comum`;
    }
    
    return liturgia || 'Liturgia do dia';
  }

  private extrairTempoLiturgico(liturgia: string): string {
    if (liturgia?.includes('Tempo Comum')) return 'Tempo Comum';
    if (liturgia?.includes('Advento')) return 'Advento';
    if (liturgia?.includes('Natal')) return 'Natal';
    if (liturgia?.includes('Quaresma')) return 'Quaresma';
    if (liturgia?.includes('Páscoa')) return 'Tempo Pascal';
    return 'Tempo Comum';
  }

  private extrairPrimeiraLeitura(leituras: any) {
    const primeira = leituras?.primeiraLeitura?.[0];
    return {
      referencia: primeira?.referencia || '',
      titulo: primeira?.titulo || 'Primeira Leitura',
      texto: primeira?.texto || 'Texto não disponível'
    };
  }

  private extrairSalmo(leituras: any) {
    const salmo = leituras?.salmo?.[0];
    return {
      referencia: salmo?.referencia || '',
      refrao: salmo?.refrao || '',
      texto: salmo?.texto || 'Texto não disponível'
    };
  }

  private extrairSegundaLeitura(leituras: any) {
    const segunda = leituras?.segundaLeitura?.[0];
    if (!segunda) return undefined;
    
    return {
      referencia: segunda.referencia || '',
      titulo: segunda.titulo || 'Segunda Leitura',
      texto: segunda.texto || 'Texto não disponível'
    };
  }

  private extrairEvangelho(leituras: any) {
    const evangelho = leituras?.evangelho?.[0];
    return {
      referencia: evangelho?.referencia || '',
      titulo: evangelho?.titulo || 'Evangelho',
      texto: evangelho?.texto || 'Texto não disponível'
    };
  }

  private gerarReflexaoPadrao(textoEvangelho?: string): string {
    if (!textoEvangelho) return 'Meditemos sobre as leituras de hoje e como elas nos convidam à conversão e ao amor fraterno.';
    
    const palavrasChave = textoEvangelho.toLowerCase();
    if (palavrasChave.includes('amor')) return 'Hoje somos convidados a refletir sobre o amor de Deus e como podemos vivenciá-lo em nossas relações.';
    if (palavrasChave.includes('perdão')) return 'A liturgia de hoje nos convida ao perdão e à reconciliação, seguindo o exemplo de Cristo.';
    if (palavrasChave.includes('paz')) return 'Que possamos ser instrumentos de paz em nosso mundo, levando a mensagem de Cristo.';
    
    return 'Meditemos sobre as leituras de hoje e como elas nos convidam à conversão e ao amor fraterno.';
  }

  private formatarDataHoje(): string {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  }

  private getDiaDaSemana(dia: number): string {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return dias[dia];
  }

  private getSemanaTempo(): string {
    // Lógica simples para determinar a semana do tempo comum
    // Em uma implementação real, seria mais complexa considerando o ano litúrgico
    return "29ª Semana do Tempo Comum";
  }

  /**
   * Método para tentar buscar dados de APIs externas
   * Pode ser expandido para integrar com diferentes fontes
   */
  private tentarApiExterna(url: string): Observable<any> {
    return this.http.get(url).pipe(
      catchError(error => {
        console.warn(`Erro ao acessar API externa: ${url}`, error);
        return throwError(error);
      })
    );
  }
}
