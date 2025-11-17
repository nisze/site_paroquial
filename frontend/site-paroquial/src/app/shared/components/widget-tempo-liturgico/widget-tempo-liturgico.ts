import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarioLiturgicoService } from '../../services/calendario-liturgico';
import { WidgetCalendario, CorLiturgica } from '../../models/calendario-liturgico';

@Component({
  selector: 'app-widget-tempo-liturgico',
  imports: [CommonModule, RouterModule],
  templateUrl: './widget-tempo-liturgico.html',
  styleUrl: './widget-tempo-liturgico.scss'
})
export class WidgetTempoLiturgico implements OnInit {

  widget: WidgetCalendario | null = null;
  carregando: boolean = true;

  constructor(private calendarioService: CalendarioLiturgicoService) {}

  ngOnInit() {
    this.carregarWidget();
  }

  carregarWidget() {
    this.carregando = true;
    this.calendarioService.getWidgetTempoAtual().subscribe({
      next: (widget) => {
        this.widget = widget;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar widget do tempo litúrgico:', error);
        this.carregando = false;
      }
    });
  }

  getCorNome(cor: CorLiturgica): string {
    const nomes = {
      [CorLiturgica.GREEN]: 'Verde',
      [CorLiturgica.PURPLE]: 'Roxo', 
      [CorLiturgica.WHITE]: 'Branco',
      [CorLiturgica.RED]: 'Vermelho',
      [CorLiturgica.ROSE]: 'Rosa',
      [CorLiturgica.BLACK]: 'Preto'
    };
    return nomes[cor] || 'Verde';
  }

  getCorClasse(cor: CorLiturgica): string {
    const classes = {
      [CorLiturgica.GREEN]: 'liturgico-green',
      [CorLiturgica.PURPLE]: 'liturgico-purple', 
      [CorLiturgica.WHITE]: 'liturgico-white',
      [CorLiturgica.RED]: 'liturgico-red',
      [CorLiturgica.ROSE]: 'liturgico-rose',
      [CorLiturgica.BLACK]: 'liturgico-black'
    };
    return classes[cor] || 'liturgico-green';
  }

  getIconeTempo(tempoKey: string): string {
    const icones: { [key: string]: string } = {
      'advent': 'fas fa-star',
      'christmas': 'fas fa-baby',
      'ordinary_time': 'fas fa-leaf',
      'lent': 'fas fa-cross',
      'easter': 'fas fa-dove',
      'pentecost': 'fas fa-fire'
    };
    return icones[tempoKey] || 'fas fa-calendar-day';
  }
}
