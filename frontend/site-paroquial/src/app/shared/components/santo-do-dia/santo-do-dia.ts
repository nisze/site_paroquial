import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LiturgiaApi } from '../../services/liturgia-api';
import { SantoData } from '../../models/liturgia';

@Component({
  selector: 'app-santo-do-dia',
  imports: [CommonModule, RouterModule],
  templateUrl: './santo-do-dia.html',
  styleUrl: './santo-do-dia.scss'
})
export class SantoDoDia implements OnInit {
  
  santo: SantoData | null = null;
  carregando: boolean = true;
  erro: string | null = null;

  constructor(private liturgiaApi: LiturgiaApi) {}

  ngOnInit() {
    this.carregarSantoDoDia();
  }

  carregarSantoDoDia() {
    this.carregando = true;
    this.erro = null;

    this.liturgiaApi.getSantoDoDia().subscribe({
      next: (data) => {
        this.santo = data;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar santo do dia:', error);
        this.erro = 'Não foi possível carregar as informações do santo.';
        this.carregando = false;
      }
    });
  }

  // Método para truncar biografia
  truncarTexto(texto: string, limite: number = 120): string {
    if (!texto) return '';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  }

  // Método para formatar data corretamente
  getDataFormatada(): string {
    if (!this.santo?.data) return '';
    
    // Converte a string da data (formato DD/MM/YYYY) para Date
    const partesData = this.santo.data.split('/');
    if (partesData.length === 3) {
      const dia = parseInt(partesData[0]);
      const mes = parseInt(partesData[1]) - 1; // mês é 0-indexed
      const ano = parseInt(partesData[2]);
      const dataObj = new Date(ano, mes, dia);
      
      // Retorna formatado para português
      return dataObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      });
    }
    
    return this.santo.data; // fallback para string original
  }
}
