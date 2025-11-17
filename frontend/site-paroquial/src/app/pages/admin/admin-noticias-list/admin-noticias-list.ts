import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticiaAdminService, Noticia } from '../../../shared/services/noticia-admin';

@Component({
  selector: 'app-admin-noticias-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-noticias-list.html',
  styleUrl: './admin-noticias-list.scss'
})
export class AdminNoticiasList implements OnInit {
  noticias: Noticia[] = [];
  noticiasFiltradas: Noticia[] = [];
  carregando = false;
  termoBusca = '';
  tipoFiltro = '';

  tipos = [
    { valor: '', nome: 'Todos os tipos' },
    { valor: 'COMUNICADO', nome: 'Comunicado' },
    { valor: 'AVISO', nome: 'Aviso' },
    { valor: 'EVENTO', nome: 'Evento' },
    { valor: 'GERAL', nome: 'Geral' }
  ];

  constructor(
    private noticiaService: NoticiaAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarNoticias();
  }

  carregarNoticias(): void {
    this.carregando = true;
    this.noticiaService.getAll().subscribe({
      next: (noticias) => {
        this.noticias = noticias;
        this.filtrar();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        // Backend offline - trabalhar apenas com frontend
        this.noticias = [];
        this.filtrar();
        this.carregando = false;
      }
    });
  }

  filtrar(): void {
    let resultado = [...this.noticias];

    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(n =>
        n.titulo.toLowerCase().includes(termo) ||
        n.resumo?.toLowerCase().includes(termo)
      );
    }

    if (this.tipoFiltro) {
      resultado = resultado.filter(n => n.tipo === this.tipoFiltro);
    }

    resultado.sort((a, b) => {
      const dateA = a.dataPublicacao ? new Date(a.dataPublicacao).getTime() : 0;
      const dateB = b.dataPublicacao ? new Date(b.dataPublicacao).getTime() : 0;
      return dateB - dateA;
    });

    this.noticiasFiltradas = resultado;
  }

  novo(): void {
    this.router.navigate(['/admin/noticias/novo']);
  }

  editar(id: number): void {
    this.router.navigate([`/admin/noticias/${id}`]);
  }

  deletar(noticia: Noticia): void {
    if (!noticia.id) return;

    const confirmacao = confirm(`Deseja realmente deletar a notícia "${noticia.titulo}"?`);
    if (!confirmacao) return;

    this.noticiaService.delete(noticia.id).subscribe({
      next: () => {
        console.log('Notícia deletada com sucesso!');
        this.carregarNoticias();
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        console.log('Notícia deletada (simulado)');
        this.carregarNoticias();
      }
    });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
