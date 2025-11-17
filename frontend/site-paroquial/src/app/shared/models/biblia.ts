export interface Livro {
  abbrev: string;
  name: string;
  chapters: number;
  testamento: 'VT' | 'NT';
}

export interface Versiculo {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Capitulo {
  book: Livro;
  chapter: number;
  verses: Versiculo[];
}

export interface ResultadoBusca {
  livro: string;
  capitulo: number;
  versiculo: number;
  texto: string;
  referencia: string;
  fonte?: string;
}

export interface OpcoeBusca {
  buscaExata?: boolean;
  testamento?: 'VT' | 'NT' | null;
  limite?: number;
}
