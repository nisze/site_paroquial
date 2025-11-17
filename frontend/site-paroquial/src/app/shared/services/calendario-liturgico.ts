import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  CalendarioLiturgico, 
  CalendarioMes, 
  WidgetCalendario, 
  TempoLiturgico,
  Celebracao,
  CorLiturgica,
  GrauCelebracao,
  TipoCelebracao 
} from '../models/calendario-liturgico';

@Injectable({
  providedIn: 'root'
})
export class CalendarioLiturgicoService {

  private readonly API_BASE = 'https://litcal.johnromanodorazio.com/api/dev';
  private readonly LOCALE = 'pt-BR'; // Português do Brasil

  constructor(private http: HttpClient) { }

  /**
   * Obtém dados do calendário para uma data específica
   */
  getCalendarioDia(data?: Date): Observable<CalendarioLiturgico> {
    // NOTA: API externa temporariamente indisponível (503 Service Unavailable)
    // Usando dados mock como fallback principal até API estar estável
    console.log('ℹ️ Calendário Litúrgico: Usando dados mock (API externa indisponível)');
    
    return of(this.getDadosMockCalendario()).pipe(
      map(calendario => calendario)
    );
    
    /* 
    // Código da API - desabilitado temporariamente devido a instabilidade
    const dataFormatada = data ? this.formatarData(data) : this.formatarData(new Date());
    
    const params = new HttpParams()
      .set('locale', this.LOCALE)
      .set('year', dataFormatada.split('-')[0])
      .set('date', dataFormatada);

    return this.http.get<any>(`${this.API_BASE}/calendar`, { params })
      .pipe(
        map(response => this.transformarRespostaCalendario(response)),
        catchError(error => {
          console.error('Erro ao buscar calendário litúrgico:', error);
          return of(this.getDadosMockCalendario());
        })
      );
    */
  }

  /**
   * Obtém dados para o widget da home (tempo litúrgico atual)
   */
  getWidgetTempoAtual(): Observable<WidgetCalendario> {
    return this.getCalendarioDia().pipe(
      map(calendario => this.criarWidgetCalendario(calendario))
    );
  }

  private transformarRespostaCalendario(response: any): CalendarioLiturgico {
    const data = new Date();
    const dateKey = this.formatarData(data);
    
    return {
      date: dateKey,
      season: {
        name: response.season?.name || 'Tempo Comum',
        key: response.season?.key || 'ordinary_time',
        start_date: response.season?.start_date || '',
        end_date: response.season?.end_date || '',
        color: this.mapearCorLiturgica(response.season?.color)
      },
      celebrations: response.celebrations?.map((cel: any) => ({
        id: cel.id,
        name: cel.name,
        rank: this.mapearGrauCelebracao(cel.rank),
        color: this.mapearCorLiturgica(cel.color),
        type: this.mapearTipoCelebracao(cel.type),
        common: cel.common,
        proper: cel.proper
      })) || [],
      liturgical_color: this.mapearCorLiturgica(response.liturgical_color),
      weekday: data.getDay(),
      week_of_season: response.week_of_season || 1
    };
  }

  private criarWidgetCalendario(calendario: CalendarioLiturgico): WidgetCalendario {
    return {
      tempo_atual: calendario.season,
      cor_liturgica: calendario.liturgical_color,
      celebracao_principal: calendario.celebrations?.[0],
      dias_ate_proximo_tempo: 0,
      proximo_tempo: ''
    };
  }

  private mapearCorLiturgica(cor: string): CorLiturgica {
    const mapeamento: { [key: string]: CorLiturgica } = {
      'green': CorLiturgica.GREEN,
      'purple': CorLiturgica.PURPLE,
      'violet': CorLiturgica.PURPLE,
      'white': CorLiturgica.WHITE,
      'red': CorLiturgica.RED,
      'rose': CorLiturgica.ROSE,
      'black': CorLiturgica.BLACK
    };
    return mapeamento[cor?.toLowerCase()] || CorLiturgica.GREEN;
  }

  private mapearGrauCelebracao(rank: string): GrauCelebracao {
    const mapeamento: { [key: string]: GrauCelebracao } = {
      'memorial': GrauCelebracao.MEMORIAL,
      'obligatory_memorial': GrauCelebracao.MEMORIAL_OBRIGATORIO,
      'feast': GrauCelebracao.FESTA,
      'solemnity': GrauCelebracao.SOLENIDADE,
      'sunday': GrauCelebracao.DOMINGO,
      'weekday': GrauCelebracao.FERIA
    };
    return mapeamento[rank?.toLowerCase()] || GrauCelebracao.FERIA;
  }

  private mapearTipoCelebracao(type: string): TipoCelebracao {
    const mapeamento: { [key: string]: TipoCelebracao } = {
      'saint': TipoCelebracao.SANTO,
      'feast_of_the_lord': TipoCelebracao.FESTA_SENHOR,
      'feast_of_our_lady': TipoCelebracao.FESTA_NOSSA_SENHORA,
      'liturgical_season': TipoCelebracao.TEMPO_LITURGICO,
      'sunday': TipoCelebracao.DOMINGO,
      'weekday': TipoCelebracao.FERIA
    };
    return mapeamento[type?.toLowerCase()] || TipoCelebracao.FERIA;
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // Dados mock para fallback
  private getDadosMockCalendario(): CalendarioLiturgico {
    const hoje = new Date();
    
    // Determinar o tempo litúrgico atual baseado na data
    const tempoAtual = this.determinarTempoLiturgico(hoje);
    
    return {
      date: this.formatarData(hoje),
      season: tempoAtual,
      celebrations: this.obterCelebracaoAtual(hoje),
      liturgical_color: tempoAtual.color,
      weekday: hoje.getDay(),
      week_of_season: this.calcularSemanaDoTempo(hoje)
    };
  }

  private determinarTempoLiturgico(data: Date): TempoLiturgico {
    const mes = data.getMonth() + 1; // getMonth() retorna 0-11
    const dia = data.getDate();
    
    // Lógica simplificada para determinar tempo litúrgico
    if ((mes === 12 && dia >= 3) || (mes === 1 && dia <= 7)) {
      return {
        name: 'Tempo do Advento',
        key: 'advent',
        start_date: '2025-12-01',
        end_date: '2025-12-24',
        color: CorLiturgica.PURPLE
      };
    } else if ((mes === 12 && dia >= 25) || (mes === 1 && dia <= 12)) {
      return {
        name: 'Tempo do Natal',
        key: 'christmas',
        start_date: '2025-12-25',
        end_date: '2026-01-12',
        color: CorLiturgica.WHITE
      };
    } else if (mes >= 3 && mes <= 4) {
      return {
        name: 'Tempo da Quaresma',
        key: 'lent',
        start_date: '2026-03-05',
        end_date: '2026-04-19',
        color: CorLiturgica.PURPLE
      };
    } else if (mes >= 4 && mes <= 5) {
      return {
        name: 'Tempo Pascal',
        key: 'easter',
        start_date: '2026-04-20',
        end_date: '2026-06-08',
        color: CorLiturgica.WHITE
      };
    } else {
      return {
        name: 'Tempo Comum',
        key: 'ordinary_time',
        start_date: '2025-01-13',
        end_date: '2025-11-29',
        color: CorLiturgica.GREEN
      };
    }
  }

  private obterCelebracaoAtual(data: Date): Celebracao[] {
    const mes = data.getMonth() + 1;
    const dia = data.getDate();
    
    // Celebrações específicas por data
    const celebracoesPorData: { [key: string]: Celebracao } = {
      '10-21': {
        id: 'santa_ursula',
        name: 'Santa Úrsula e Companheiras Virgens e Mártires',
        rank: GrauCelebracao.MEMORIAL,
        color: CorLiturgica.RED,
        type: TipoCelebracao.SANTO
      },
      '10-22': {
        id: 'sao_joao_paulo_ii',
        name: 'São João Paulo II',
        rank: GrauCelebracao.MEMORIAL,
        color: CorLiturgica.WHITE,
        type: TipoCelebracao.SANTO
      },
      '10-23': {
        id: 'santo_antonio_claret',
        name: 'Santo Antônio Maria Claret',
        rank: GrauCelebracao.MEMORIAL,
        color: CorLiturgica.WHITE,
        type: TipoCelebracao.SANTO
      },
      '11-01': {
        id: 'todos_santos',
        name: 'Todos os Santos',
        rank: GrauCelebracao.SOLENIDADE,
        color: CorLiturgica.WHITE,
        type: TipoCelebracao.FESTA_SENHOR
      },
      '11-02': {
        id: 'finados',
        name: 'Comemoração de Todos os Fiéis Defuntos',
        rank: GrauCelebracao.MEMORIAL,
        color: CorLiturgica.BLACK,
        type: TipoCelebracao.FESTA_SENHOR
      }
    };

    const chaveData = `${mes}-${dia}`;
    const celebracao = celebracoesPorData[chaveData];
    
    if (celebracao) {
      return [celebracao];
    }

    // Celebração padrão para dias sem santo específico
    return [{
      id: 'feria',
      name: this.obterNomeDiaSemana(data.getDay()),
      rank: data.getDay() === 0 ? GrauCelebracao.DOMINGO : GrauCelebracao.FERIA,
      color: data.getDay() === 0 ? CorLiturgica.WHITE : CorLiturgica.GREEN,
      type: data.getDay() === 0 ? TipoCelebracao.DOMINGO : TipoCelebracao.FERIA
    }];
  }

  private obterNomeDiaSemana(diaSemana: number): string {
    const nomes = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return nomes[diaSemana];
  }

  private calcularSemanaDoTempo(data: Date): number {
    // Cálculo simplificado - retorna semana baseada no mês
    return Math.ceil(data.getDate() / 7);
  }
}
