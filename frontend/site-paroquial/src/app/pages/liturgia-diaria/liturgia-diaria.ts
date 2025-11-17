import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LiturgiaApi } from '../../shared/services/liturgia-api';
import { LiturgiaDiaCompleta, LiturgiaData, SantoData } from '../../shared/models/liturgia';
import { SantoAdminService, Santo } from '../../shared/services/santo-admin';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-liturgia-diaria-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './liturgia-diaria.html',
  styleUrl: './liturgia-diaria.scss'
})
export class LiturgiaDiariaPage implements OnInit, AfterViewInit {
  
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
  
  liturgiaCompleta: LiturgiaDiaCompleta | null = null;
  santoBackend: Santo | null = null;
  carregando: boolean = true;
  erro: string | null = null;
  dataHoje: string = '';

  constructor(
    private liturgiaApi: LiturgiaApi,
    private santoService: SantoAdminService
  ) {
    this.dataHoje = this.formatarDataPorExtenso();
  }

  ngOnInit() {
    this.carregarLiturgiaDoDia();
  }

  ngAfterViewInit() {
    if (this.heroVideo?.nativeElement) {
      const video = this.heroVideo.nativeElement;
      video.muted = true;
      video.play().catch(err => console.log('Erro ao reproduzir vídeo:', err));
    }
  }

  carregarLiturgiaDoDia() {
    this.carregando = true;
    this.erro = null;

    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.getMonth() + 1;

    // Carrega liturgia da API externa e santo do backend em paralelo
    forkJoin({
      liturgia: this.liturgiaApi.getLiturgiaDiaCompleta(),
      santos: this.santoService.getByData(dia, mes)
    }).subscribe({
      next: (data) => {
        this.liturgiaCompleta = data.liturgia;
        // Pega o primeiro santo ativo
        if (data.santos && data.santos.length > 0) {
          this.santoBackend = data.santos.find(s => s.ativo !== false) || data.santos[0];
        }
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
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

  // Método para obter cor da liturgia
  getCorLiturgica(): string {
    const cor = this.liturgia?.cor_liturgica?.toLowerCase();
    switch (cor) {
      case 'verde': return '#8B7355';
      case 'roxo': 
      case 'violeta': return '#8B7355';
      case 'branco': return '#f8f9fa';
      case 'vermelho': return '#dc3545';
      case 'rosa': return '#C4A57B';
      default: return '#8B7355';
    }
  }
}
