import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarioLiturgicoService } from '../../shared/services/calendario-liturgico';
import { 
  CalendarioLiturgico as ICalendarioLiturgico, 
  DiaLiturgico, 
  Celebracao, 
  TempoLiturgico,
  CorLiturgica,
  GrauCelebracao 
} from '../../shared/models/calendario-liturgico';

@Component({
  selector: 'app-calendario-liturgico',
  imports: [CommonModule, RouterModule],
  templateUrl: './calendario-liturgico.html',
  styleUrl: './calendario-liturgico.scss'
})
export class CalendarioLiturgico implements OnInit {

  calendarioHoje: ICalendarioLiturgico | null = null;
  dataAtual: Date = new Date();
  mesAtual: Date = new Date();
  semanasDoMes: DiaLiturgico[][] = [];
  proximasCelebracoes: (Celebracao & { date: string })[] = [];
  temposLiturgicos: TempoLiturgico[] = [];
  carregando: boolean = true;

  constructor(private calendarioService: CalendarioLiturgicoService) {}

  ngOnInit() {
    this.carregarCalendarioHoje();
    this.carregarMes();
    this.carregarProximasCelebracoes();
    this.carregarTemposLiturgicos();
  }

  private carregarCalendarioHoje() {
    this.calendarioService.getCalendarioDia().subscribe({
      next: (calendario) => {
        this.calendarioHoje = calendario;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar calendário de hoje:', error);
        this.carregando = false;
      }
    });
  }

  private carregarMes() {
    // Mock data para o calendário mensal
    this.gerarDiasMes();
  }

  private carregarProximasCelebracoes() {
    const hoje = new Date();
    const proximasCelebracoesMock = [
      {
        id: '1',
        name: 'Todos os Santos',
        rank: GrauCelebracao.SOLENIDADE,
        color: CorLiturgica.WHITE,
        type: 'festa_senhor' as any,
        date: '2025-11-01'
      },
      {
        id: '2',
        name: 'Finados',
        rank: GrauCelebracao.MEMORIAL,
        color: CorLiturgica.BLACK,
        type: 'festa_senhor' as any,
        date: '2025-11-02'
      },
      {
        id: '3', 
        name: 'São José Operário',
        rank: GrauCelebracao.MEMORIAL,
        color: CorLiturgica.WHITE,
        type: 'santo' as any,
        date: '2025-11-15'
      },
      {
        id: '4',
        name: 'Cristo Rei',
        rank: GrauCelebracao.SOLENIDADE,
        color: CorLiturgica.WHITE,
        type: 'festa_senhor' as any,
        date: '2025-11-23'
      },
      {
        id: '5',
        name: '1º Domingo do Advento',
        rank: GrauCelebracao.DOMINGO,
        color: CorLiturgica.PURPLE,
        type: 'tempo_liturgico' as any,
        date: '2025-11-30'
      },
      {
        id: '6',
        name: 'Nossa Senhora da Conceição',
        rank: GrauCelebracao.SOLENIDADE,
        color: CorLiturgica.WHITE,
        type: 'festa_nossa_senhora' as any,
        date: '2025-12-08'
      },
      {
        id: '7',
        name: 'Natal do Senhor',
        rank: GrauCelebracao.SOLENIDADE,
        color: CorLiturgica.WHITE,
        type: 'festa_senhor' as any,
        date: '2025-12-25'
      },
      {
        id: '8',
        name: 'Santa Maria Mãe de Deus',
        rank: GrauCelebracao.SOLENIDADE,
        color: CorLiturgica.WHITE,
        type: 'festa_nossa_senhora' as any,
        date: '2026-01-01'
      },
      {
        id: '9',
        name: 'Epifania do Senhor',
        rank: GrauCelebracao.SOLENIDADE,
        color: CorLiturgica.WHITE,
        type: 'festa_senhor' as any,
        date: '2026-01-06'
      }
    ];

    // Filtrar apenas celebrações futuras e ordenar por data
    this.proximasCelebracoes = proximasCelebracoesMock
      .filter(celebracao => new Date(celebracao.date) >= hoje)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // Mostrar apenas as próximas 5
  }

  private carregarTemposLiturgicos() {
    // Mock data para tempos litúrgicos
    this.temposLiturgicos = [
      {
        name: 'Tempo Comum',
        key: 'ordinary_time',
        start_date: '2025-01-13',
        end_date: '2025-03-05',
        color: CorLiturgica.GREEN
      },
      {
        name: 'Quaresma',
        key: 'lent',
        start_date: '2025-03-05',
        end_date: '2025-04-19',
        color: CorLiturgica.PURPLE
      },
      {
        name: 'Páscoa',
        key: 'easter',
        start_date: '2025-04-20',
        end_date: '2025-06-08',
        color: CorLiturgica.WHITE
      }
    ];
  }

  private gerarDiasMes() {
    const ano = this.mesAtual.getFullYear();
    const mes = this.mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const primeiroDiaSemana = primeiroDia.getDay();
    
    const dias: DiaLiturgico[] = [];
    
    // Dias do mês anterior
    for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
      const data = new Date(primeiroDia);
      data.setDate(data.getDate() - (i + 1));
      dias.push(this.criarDiaLiturgico(data, false));
    }
    
    // Dias do mês atual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const data = new Date(ano, mes, dia);
      dias.push(this.criarDiaLiturgico(data, true));
    }
    
    // Dias do próximo mês
    const diasNecessarios = 42 - dias.length; // 6 semanas x 7 dias
    for (let dia = 1; dia <= diasNecessarios; dia++) {
      const data = new Date(ano, mes + 1, dia);
      dias.push(this.criarDiaLiturgico(data, false));
    }
    
    // Dividir em semanas
    this.semanasDoMes = [];
    for (let i = 0; i < dias.length; i += 7) {
      this.semanasDoMes.push(dias.slice(i, i + 7));
    }
  }

  private criarDiaLiturgico(data: Date, mesAtual: boolean): DiaLiturgico {
    return {
      date: this.formatarData(data),
      day: data.getDate(),
      weekday: this.getDiaSemana(data.getDay()),
      season: 'Tempo Comum',
      season_week: 1,
      liturgical_color: CorLiturgica.GREEN,
      celebrations: [],
      is_sunday: data.getDay() === 0,
      is_holy_day: false
    };
  }

  private getDiaSemana(dia: number): string {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[dia];
  }

  mesAnterior() {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() - 1, 1);
    this.carregarMes();
  }

  proximoMes() {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
    this.carregarMes();
  }

  irParaHoje() {
    this.mesAtual = new Date();
    this.carregarMes();
  }

  ehHoje(data: string): boolean {
    const hoje = this.formatarData(new Date());
    return data === hoje;
  }

  ehMesAtual(data: string): boolean {
    const dataObj = new Date(data);
    return dataObj.getMonth() === this.mesAtual.getMonth() && 
           dataObj.getFullYear() === this.mesAtual.getFullYear();
  }

  getCorClasse(cor: CorLiturgica): string {
    const classes = {
      [CorLiturgica.GREEN]: 'liturgico-green',
      [CorLiturgica.PURPLE]: 'liturgico-purple', 
      [CorLiturgica.WHITE]: 'liturgico-white',
      [CorLiturgica.RED]: 'liturgico-red',
      [CorLiturgica.ROSE]: 'liturgico-rose',
      [CorLiturgica.BLACK]: 'liturgico-black'
    };
    return classes[cor] || 'liturgico-green';
  }

  getCorNome(cor: CorLiturgica): string {
    const nomes = {
      [CorLiturgica.GREEN]: 'Verde',
      [CorLiturgica.PURPLE]: 'Roxo', 
      [CorLiturgica.WHITE]: 'Branco',
      [CorLiturgica.RED]: 'Vermelho',
      [CorLiturgica.ROSE]: 'Rosa',
      [CorLiturgica.BLACK]: 'Preto'
    };
    return nomes[cor] || 'Verde';
  }

  getBadgeCelebracao(grau: GrauCelebracao): string {
    const badges = {
      [GrauCelebracao.SOLENIDADE]: 'bg-warning text-dark',
      [GrauCelebracao.FESTA]: 'bg-primary',
      [GrauCelebracao.MEMORIAL_OBRIGATORIO]: 'bg-success',
      [GrauCelebracao.MEMORIAL]: 'bg-info',
      [GrauCelebracao.DOMINGO]: 'bg-secondary',
      [GrauCelebracao.FERIA]: 'bg-light text-dark'
    };
    return badges[grau] || 'bg-secondary';
  }

  getGrauNome(grau: GrauCelebracao): string {
    const nomes = {
      [GrauCelebracao.SOLENIDADE]: 'Solenidade',
      [GrauCelebracao.FESTA]: 'Festa',
      [GrauCelebracao.MEMORIAL_OBRIGATORIO]: 'Memorial Obr.',
      [GrauCelebracao.MEMORIAL]: 'Memorial',
      [GrauCelebracao.DOMINGO]: 'Domingo',
      [GrauCelebracao.FERIA]: 'Dia da Semana'
    };
    return nomes[grau] || '';
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
