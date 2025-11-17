import { Component, OnInit, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BibliaApi } from '../../shared/services/biblia-api';
import { Livro, Capitulo, Versiculo, ResultadoBusca, OpcoeBusca } from '../../shared/models/biblia';

@Component({
  selector: 'app-biblia',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './biblia.html',
  styleUrl: './biblia.scss'
})
export class Biblia implements OnInit, AfterViewInit {
  
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
  // Propriedades principais
  livros: Livro[] = [];
  livrosVT: Livro[] = [];
  livrosNT: Livro[] = [];
  
  // Estado da leitura
  livroSelecionado: Livro | null = null;
  capituloAtual: Capitulo | null = null;
  numeroCapitulo: number = 1;
  
  // Busca
  termoBusca: string = '';
  resultadosBusca: ResultadoBusca[] = [];
  buscandoTexto: boolean = false;
  buscaExata: boolean = false;
  testamentoFiltro: 'VT' | 'NT' | null = null;
  
  // UI Estado
  visualizacao: 'navegacao' | 'leitura' | 'busca' = 'navegacao';
  carregandoCapitulo: boolean = false;
  
  // Controle dos dropdowns separados
  menuAntigoTestamentoAberto: boolean = false;
  menuNovoTestamentoAberto: boolean = false;
  
  // Favoritos (mock - no futuro pode integrar com localStorage)
  versiculosFavoritos: any[] = [];

  constructor(private bibliaApi: BibliaApi) {}

  // Listener para fechar dropdowns ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Verificar se clicou fora dos dropdowns
    if (!target.closest('.testamento-selector')) {
      this.menuAntigoTestamentoAberto = false;
      this.menuNovoTestamentoAberto = false;
    }
  }

  // Listener para ESC key
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.menuAntigoTestamentoAberto = false;
    this.menuNovoTestamentoAberto = false;
  }

  ngOnInit() {
    this.carregarLivros();
    // Não carregar capítulo inicial - deixar apenas os botões visíveis
    // this.carregarCapituloInicial();
  }

  ngAfterViewInit() {
    if (this.heroVideo?.nativeElement) {
      const video = this.heroVideo.nativeElement;
      video.muted = true;
      video.play().catch(err => console.log('Erro ao reproduzir vídeo:', err));
    }
  }

  // Carregar lista de livros
  carregarLivros() {
    this.livros = this.bibliaApi.getLivros();
    this.livrosVT = this.bibliaApi.getLivros('VT');
    this.livrosNT = this.bibliaApi.getLivros('NT');
  }

  // Carregar capítulo inicial (Salmo 23)
  carregarCapituloInicial() {
    const salmos = this.bibliaApi.getLivro('sl');
    if (salmos) {
      this.selecionarLivro(salmos);
      this.navegarParaCapitulo(23);
    }
  }

  // Alternar dropdown do Antigo Testamento
  alternarMenuAntigoTestamento() {
    this.menuAntigoTestamentoAberto = !this.menuAntigoTestamentoAberto;
    if (this.menuAntigoTestamentoAberto) {
      this.menuNovoTestamentoAberto = false; // Fechar o outro
    }
  }

  // Alternar dropdown do Novo Testamento
  alternarMenuNovoTestamento() {
    this.menuNovoTestamentoAberto = !this.menuNovoTestamentoAberto;
    if (this.menuNovoTestamentoAberto) {
      this.menuAntigoTestamentoAberto = false; // Fechar o outro
    }
  }

  // Selecionar livro
  selecionarLivro(livro: Livro) {
    this.livroSelecionado = livro;
    this.numeroCapitulo = 1;
    this.carregarCapitulo(livro, 1);
    
    // Fechar ambos os dropdowns ao selecionar livro
    this.menuAntigoTestamentoAberto = false;
    this.menuNovoTestamentoAberto = false;
  }

  // Carregar capítulo
  carregarCapitulo(livro: Livro, capitulo: number) {
    this.carregandoCapitulo = true;
    this.numeroCapitulo = capitulo;
    
    this.bibliaApi.buscarCapitulo(livro.abbrev, capitulo).subscribe({
      next: (capituloData) => {
        this.capituloAtual = capituloData;
        this.visualizacao = 'leitura';
        this.carregandoCapitulo = false;
      },
      error: (error) => {
        console.error('Erro ao carregar capítulo:', error);
        this.carregandoCapitulo = false;
      }
    });
  }

  // Navegar para capítulo específico
  navegarParaCapitulo(numeroCap: number) {
    if (this.livroSelecionado && numeroCap >= 1 && numeroCap <= this.livroSelecionado.chapters) {
      this.carregarCapitulo(this.livroSelecionado, numeroCap);
    }
  }

  // Capítulo anterior
  capituloAnterior() {
    if (this.numeroCapitulo > 1) {
      this.navegarParaCapitulo(this.numeroCapitulo - 1);
    }
  }

  // Próximo capítulo
  proximoCapitulo() {
    if (this.livroSelecionado && this.numeroCapitulo < this.livroSelecionado.chapters) {
      this.navegarParaCapitulo(this.numeroCapitulo + 1);
    }
  }

  // Buscar texto
  buscarTexto() {
    if (!this.termoBusca.trim()) {
      console.warn('⚠️ Termo de busca vazio');
      return;
    }
    
    console.log(`🔍 Iniciando busca por: "${this.termoBusca}"`);
    console.log(`   Opções: Exata=${this.buscaExata}, Testamento=${this.testamentoFiltro}`);
    
    this.buscandoTexto = true;
    this.visualizacao = 'busca';
    
    const opcoes: OpcoeBusca = {
      buscaExata: this.buscaExata,
      testamento: this.testamentoFiltro,
      limite: 50
    };

    this.bibliaApi.buscarTexto(this.termoBusca, opcoes).subscribe({
      next: (resultados) => {
        console.log(`✅ Busca concluída: ${resultados.length} resultados`);
        this.resultadosBusca = resultados;
        this.buscandoTexto = false;
      },
      error: (error) => {
        console.error('❌ Erro na busca:', error);
        console.error('Detalhes:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
        this.buscandoTexto = false;
        // Mesmo com erro, manter os resultados locais se houver
      }
    });
  }

  // Ir para versículo dos resultados da busca
  irParaVersiculo(resultado: ResultadoBusca) {
    const livro = this.bibliaApi.getLivro(resultado.livro);
    if (livro) {
      this.selecionarLivro(livro);
      this.carregarCapitulo(livro, resultado.capitulo);
    }
  }

  // Limpar busca
  limparBusca() {
    this.termoBusca = '';
    this.resultadosBusca = [];
    this.visualizacao = 'leitura';
  }

  // Voltar para navegação
  voltarParaNavegacao() {
    this.visualizacao = 'navegacao';
    // Fechar dropdowns quando voltar para navegação
    this.menuAntigoTestamentoAberto = false;
    this.menuNovoTestamentoAberto = false;
  }

  // Adicionar aos favoritos (mock)
  adicionarFavorito(versiculo: Versiculo) {
    const favorito = {
      livro: versiculo.book,
      capitulo: versiculo.chapter,
      versiculo: versiculo.verse,
      texto: versiculo.text,
      referencia: `${versiculo.book} ${versiculo.chapter}:${versiculo.verse}`
    };
    
    this.versiculosFavoritos.push(favorito);
    // No futuro: salvar no localStorage ou backend
  }

  // Gerar array de capítulos para navegação
  getCapitulos(livro: Livro): number[] {
    return Array.from({ length: livro.chapters }, (_, i) => i + 1);
  }

  // Formatar referência
  formatarReferencia(): string {
    if (!this.livroSelecionado) return '';
    return `${this.livroSelecionado.name} ${this.numeroCapitulo}`;
  }

  // TrackBy para performance
  trackByVersiculo(index: number, versiculo: Versiculo): string {
    return `${versiculo.book}_${versiculo.chapter}_${versiculo.verse}`;
  }

  // Verificar se algum dropdown está aberto
  isAnyDropdownOpen(): boolean {
    return this.menuAntigoTestamentoAberto || this.menuNovoTestamentoAberto;
  }

  // Obter nome do testamento atual selecionado
  getTestamentoAtual(): string {
    if (!this.livroSelecionado) return 'Selecionar Livro';
    return this.livroSelecionado.testamento === 'VT' ? 'Antigo Testamento' : 'Novo Testamento';
  }
}
