import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LiturgiaApi } from '../../services/liturgia-api';
import { LiturgiaDiaCompleta, LiturgiaData, SantoData } from '../../models/liturgia';

@Component({
  selector: 'app-liturgia-diaria',
  imports: [CommonModule, RouterModule],
  templateUrl: './liturgia-diaria.html',
  styleUrl: './liturgia-diaria.scss'
})
export class LiturgiaDiaria implements OnInit {
  
  liturgiaCompleta: LiturgiaDiaCompleta | null = null;
  carregando: boolean = true;
  erro: string | null = null;
  dataHoje: string = '';

  constructor(private liturgiaApi: LiturgiaApi) {
    this.dataHoje = this.formatarDataPorExtenso();
  }

  ngOnInit() {
    this.carregarLiturgiaDoDia();
  }

  carregarLiturgiaDoDia() {
    this.carregando = true;
    this.erro = null;

    this.liturgiaApi.getLiturgiaDiaCompleta().subscribe({
      next: (data) => {
        this.liturgiaCompleta = data;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar liturgia:', error);
        this.erro = 'Não foi possível carregar as informações litúrgicas.';
        this.carregando = false;
      }
    });
  }

  private formatarDataPorExtenso(): string {
    const hoje = new Date();
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const diaSemana = diasSemana[hoje.getDay()];
    const dia = hoje.getDate();
    const mes = meses[hoje.getMonth()];
    const ano = hoje.getFullYear();
    
    return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
  }

  get liturgia(): LiturgiaData | null {
    return this.liturgiaCompleta?.liturgia || null;
  }

  get santo(): SantoData | null {
    return this.liturgiaCompleta?.santo || null;
  }

  // Método para truncar texto longo
  truncarTexto(texto: string, limite: number = 150): string {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  }

  // Método para obter cor da liturgia
  getCorLiturgica(): string {
    const cor = this.liturgia?.cor_liturgica?.toLowerCase();
    switch (cor) {
      case 'verde': return '#28a745';
      case 'roxo': 
      case 'violeta': return '#6f42c1';
      case 'branco': return '#f8f9fa';
      case 'vermelho': return '#dc3545';
      case 'rosa': return '#e83e8c';
      default: return '#28a745';
    }
  }
}
