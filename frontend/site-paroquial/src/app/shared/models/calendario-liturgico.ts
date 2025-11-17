export interface CalendarioLiturgico {
  date: string;
  season: TempoLiturgico;
  celebrations: Celebracao[];
  liturgical_color: CorLiturgica;
  weekday: number;
  week_of_season: number;
}

export interface Celebracao {
  id: string;
  name: string;
  rank: GrauCelebracao;
  color: CorLiturgica;
  type: TipoCelebracao;
  common?: string;
  proper?: string;
}

export interface TempoLiturgico {
  name: string;
  key: string;
  start_date: string;
  end_date: string;
  color: CorLiturgica;
}

export interface CalendarioMes {
  year: number;
  month: number;
  days: DiaLiturgico[];
}

export interface DiaLiturgico {
  date: string;
  day: number;
  weekday: string;
  season: string;
  season_week: number;
  liturgical_color: CorLiturgica;
  celebrations: Celebracao[];
  is_sunday: boolean;
  is_holy_day: boolean;
}

export interface WidgetCalendario {
  tempo_atual: TempoLiturgico;
  cor_liturgica: CorLiturgica;
  celebracao_principal?: Celebracao;
  dias_ate_proximo_tempo?: number;
  proximo_tempo?: string;
}

export enum CorLiturgica {
  GREEN = 'green',     // Verde - Tempo Comum
  PURPLE = 'purple',   // Roxo - Advento/Quaresma
  WHITE = 'white',     // Branco - Natal/Páscoa/Festas
  RED = 'red',         // Vermelho - Pentecostes/Mártires
  ROSE = 'rose',       // Rosa - Gaudete/Laetare
  BLACK = 'black'      // Preto - Finados
}

export enum GrauCelebracao {
  MEMORIAL = 'memorial',
  MEMORIAL_OBRIGATORIO = 'memorial_obrigatorio', 
  FESTA = 'festa',
  SOLENIDADE = 'solenidade',
  DOMINGO = 'domingo',
  FERIA = 'feria'
}

export enum TipoCelebracao {
  SANTO = 'santo',
  FESTA_SENHOR = 'festa_senhor',
  FESTA_NOSSA_SENHORA = 'festa_nossa_senhora',
  TEMPO_LITURGICO = 'tempo_liturgico',
  DOMINGO = 'domingo',
  FERIA = 'feria'
}
