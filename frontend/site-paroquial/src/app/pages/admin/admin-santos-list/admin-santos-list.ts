import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SantoAdminService, Santo } from '../../../shared/services/santo-admin';

@Component({
  selector: 'app-admin-santos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-santos-list.html',
  styleUrl: './admin-santos-list.scss'
})
export class AdminSantosList implements OnInit {
  santos: Santo[] = [];
  santosFiltrados: Santo[] = [];
  carregando = false;
  termoBusca = '';
  mesFiltro: number | null = null;

  meses = [
    { valor: null, nome: 'Todos os meses' },
    { valor: 1, nome: 'Janeiro' },
    { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' },
    { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' },
    { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' },
    { valor: 12, nome: 'Dezembro' }
  ];

  constructor(
    private santoService: SantoAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarSantos();
  }

  carregarSantos(): void {
    this.carregando = true;
    this.santoService.getAll().subscribe({
      next: (santos) => {
        this.santos = santos.sort((a, b) => {
          if (a.mes !== b.mes) return a.mes - b.mes;
          return a.dia - b.dia;
        });
        this.filtrar();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        this.santos = [];
        this.filtrar();
        this.carregando = false;
      }
    });
  }

  filtrar(): void {
    this.santosFiltrados = this.santos.filter(santo => {
      const matchBusca = !this.termoBusca || 
        santo.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        santo.titulo?.toLowerCase().includes(this.termoBusca.toLowerCase());
      
      const matchMes = this.mesFiltro === null || santo.mes === this.mesFiltro;
      
      return matchBusca && matchMes;
    });
  }

  novo(): void {
    console.log('Navegando para /admin/santos/novo');
    this.router.navigate(['/admin/santos/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/admin/santos', id]);
  }

  deletar(santo: Santo): void {
    if (!santo.id) return;

    const confirmacao = confirm(`Deseja realmente deletar o santo "${santo.nome}"?`);
    if (!confirmacao) return;

    this.santoService.delete(santo.id).subscribe({
      next: () => {
        console.log('Santo deletado com sucesso!');
        this.carregarSantos();
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        console.log('Santo deletado (simulado)');
        this.carregarSantos();
      }
    });
  }

  getNomeMes(mes: number): string {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return meses[mes - 1] || '';
  }

  getDataFormatada(santo: Santo): string {
    return `${santo.dia} de ${this.meses.find(m => m.valor === santo.mes)?.nome || ''}`;
  }
}
