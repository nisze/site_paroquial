import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SantoAdminService, Santo } from '../../shared/services/santo-admin';
import { LiturgiaApi } from '../../shared/services/liturgia-api';
import { LiturgiaDiaCompleta } from '../../shared/models/liturgia';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, AfterViewInit {
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
  
  dataHoje = new Date();
  santoDoDia: Santo | null = null;
  carregandoSanto = false;
  liturgiaCompleta: LiturgiaDiaCompleta | null = null;

  constructor(
    private santoService: SantoAdminService,
    private liturgiaApi: LiturgiaApi
  ) {}

  ngOnInit() {
    this.carregarSantoDoDia();
    this.carregarLiturgia();
  }

  carregarLiturgia() {
    this.liturgiaApi.getLiturgiaDiaCompleta().subscribe({
      next: (data) => {
        this.liturgiaCompleta = data;
      },
      error: (err) => {
        console.error('Erro ao carregar liturgia:', err);
      }
    });
  }

  ngAfterViewInit() {
    // Força o vídeo a tocar
    if (this.heroVideo?.nativeElement) {
      const video = this.heroVideo.nativeElement;
      video.muted = true;
      video.play().catch(err => {
        console.log('Erro ao reproduzir vídeo:', err);
      });
    }
  }

  carregarSantoDoDia() {
    this.carregandoSanto = true;
    const dia = this.dataHoje.getDate();
    const mes = this.dataHoje.getMonth() + 1; // Janeiro é 0
    
    this.santoService.getByData(dia, mes).subscribe({
      next: (santos) => {
        if (santos && santos.length > 0) {
          // Pega o primeiro santo ativo da lista
          this.santoDoDia = santos.find(s => s.ativo !== false) || santos[0];
        }
        this.carregandoSanto = false;
      },
      error: (err) => {
        console.error('Erro ao carregar santo do dia:', err);
        this.carregandoSanto = false;
      }
    });
  }

  getNomeMes(mes: number): string {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return meses[mes - 1] || '';
  }

  truncarTexto(texto: string, limite: number = 120): string {
    if (!texto) return '';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  }
}
