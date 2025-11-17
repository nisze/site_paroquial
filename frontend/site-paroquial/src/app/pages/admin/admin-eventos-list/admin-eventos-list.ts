import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoAdminService, Evento } from '../../../shared/services/evento-admin';

@Component({
  selector: 'app-admin-eventos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-eventos-list.html',
  styleUrl: './admin-eventos-list.scss'
})
export class AdminEventosList implements OnInit {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  carregando = false;
  termoBusca = '';
  tipoFiltro = '';

  tipos = [
    { valor: '', nome: 'Todos os tipos' },
    { valor: 'MISSA', nome: 'Missa' },
    { valor: 'FESTA', nome: 'Festa Religiosa' },
    { valor: 'RETIRO', nome: 'Retiro' },
    { valor: 'ENCONTRO', nome: 'Encontro' },
    { valor: 'OUTRO', nome: 'Outro' }
  ];

  constructor(
    private eventoService: EventoAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.carregando = true;
    this.eventoService.getAll().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.filtrar();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        // Backend offline - trabalhar apenas com frontend
        this.eventos = [];
        this.filtrar();
        this.carregando = false;
      }
    });
  }

  filtrar(): void {
    let resultado = [...this.eventos];

    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(e =>
        e.titulo.toLowerCase().includes(termo) ||
        e.local?.toLowerCase().includes(termo)
      );
    }

    if (this.tipoFiltro) {
      resultado = resultado.filter(e => e.tipo === this.tipoFiltro);
    }

    resultado.sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

    this.eventosFiltrados = resultado;
  }

  novo(): void {
    this.router.navigate(['/admin/eventos/novo']);
  }

  editar(id: number): void {
    this.router.navigate([`/admin/eventos/${id}`]);
  }

  deletar(evento: Evento): void {
    if (!evento.id) return;

    const confirmacao = confirm(`Deseja realmente deletar o evento "${evento.titulo}"?`);
    if (!confirmacao) return;

    this.eventoService.delete(evento.id).subscribe({
      next: () => {
        console.log('Evento deletado com sucesso!');
        this.carregarEventos();
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        console.log('Evento deletado (simulado)');
        this.carregarEventos();
      }
    });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
