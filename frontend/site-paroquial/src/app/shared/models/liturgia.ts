// Interfaces para dados litúrgicos
export interface LiturgiaData {
  data: string;
  titulo: string;
  cor_liturgica: string;
  tempo_liturgico: string;
  primeira_leitura: Leitura;
  segunda_leitura?: Leitura;
  salmo: Salmo;
  evangelho: Leitura;
  oracao_coleta: string;
  oracao_oferendas: string;
  oracao_comunhao: string;
  reflexao?: string;
}

export interface Leitura {
  titulo: string;
  referencia: string;
  texto: string;
}

export interface Salmo {
  referencia: string;
  refrao: string;
  texto: string;
}

export interface SantoData {
  data: string;
  santo_principal: Santo;
  outros_santos?: Santo[];
}

export interface Santo {
  nome: string;
  titulo?: string;
  biografia: string;
  oracao?: string;
  data_nascimento?: string;
  data_morte?: string;
  canonizado_por?: string;
  festa_liturgica: string;
  padroeiro_de?: string[];
  imagem_url?: string;
}

export interface LiturgiaDiaCompleta {
  liturgia: LiturgiaData;
  santo: SantoData;
}

// Para respostas da API
export interface ApiLiturgiaResponse {
  success: boolean;
  data: LiturgiaData;
  message?: string;
}

export interface ApiSantoResponse {
  success: boolean;
  data: SantoData;
  message?: string;
}
