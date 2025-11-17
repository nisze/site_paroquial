import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PastoralAdminService, Pastoral } from '../../../shared/services/pastoral-admin';

@Component({
  selector: 'app-admin-pastorais-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-pastorais-list.html',
  styleUrl: './admin-pastorais-list.scss'
})
export class AdminPastoraisList implements OnInit {
  pastorais: Pastoral[] = [];
  pastoraisFiltradas: Pastoral[] = [];
  carregando = false;
  termoBusca = '';

  constructor(
    private pastoralService: PastoralAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPastorais();
  }

  carregarPastorais(): void {
    this.carregando = true;
    this.pastoralService.getAll().subscribe({
      next: (pastorais) => {
        this.pastorais = pastorais;
        this.filtrar();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        // Backend offline - trabalhar apenas com frontend
        this.pastorais = [];
        this.filtrar();
        this.carregando = false;
      }
    });
  }

  filtrar(): void {
    let resultado = [...this.pastorais];

    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.coordenador?.toLowerCase().includes(termo)
      );
    }

    resultado.sort((a, b) => (a.ordemExibicao || 0) - (b.ordemExibicao || 0));

    this.pastoraisFiltradas = resultado;
  }

  novo(): void {
    console.log('Navegando para /admin/pastorais/novo');
    this.router.navigate(['/admin/pastorais/novo']);
  }

  editar(id: number): void {
    this.router.navigate([`/admin/pastorais/${id}`]);
  }

  deletar(pastoral: Pastoral): void {
    if (!pastoral.id) return;

    const confirmacao = confirm(`Deseja realmente deletar a pastoral "${pastoral.nome}"?`);
    if (!confirmacao) return;

    this.pastoralService.delete(pastoral.id).subscribe({
      next: () => {
        console.log('Pastoral deletada com sucesso!');
        this.carregarPastorais();
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        console.log('Pastoral deletada (simulado)');
        this.carregarPastorais();
      }
    });
  }
}
