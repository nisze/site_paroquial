import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface HorarioMissa {
  dia: string;
  horarios: string[];
  local?: string;
  observacao?: string;
}

interface HorarioEspecial {
  titulo: string;
  data: string;
  horarios: string[];
  local?: string;
  descricao?: string;
}

@Component({
  selector: 'app-horarios-missas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './horarios-missas.html',
  styleUrl: './horarios-missas.scss'
})
export class HorariosMissas implements OnInit, AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  horariosSemana: HorarioMissa[] = [
    {
      dia: 'Quarta-Feira',
      horarios: ['19h30'],
      local: 'Igreja Matriz Nossa Senhora Aparecida'
    },
    {
      dia: 'Quinta-Feira',
      horarios: ['7h00'],
      local: 'Igreja Matriz Nossa Senhora Aparecida'
    },
    {
      dia: 'Domingo',
      horarios: ['11h00', '19h00'],
      local: 'Igreja Matriz Nossa Senhora Aparecida'
    }
  ];

  horariosEspeciais: HorarioEspecial[] = [
    {
      titulo: '1º Sexta-Feira do mês',
      data: 'Primeira Sexta-feira',
      horarios: ['19h30'],
      local: 'Igreja Matriz Nossa Senhora Aparecida',
      descricao: 'Devoção ao Sagrado Coração de Jesus'
    },
    {
      titulo: '1º Sábado do mês',
      data: 'Primeiro Sábado',
      horarios: ['12h00'],
      local: 'Igreja Matriz Nossa Senhora Aparecida',
      descricao: 'Devoção ao Imaculado Coração de Maria'
    }
  ];

  comunidades = [
    {
      nome: 'Comunidade Imaculada Conceição',
      endereco: '',
      imagem: 'igreja1.png',
      horarios: [
        { dia: '1ª e 3ª Quinta-Feira', hora: '19h30' }
      ]
    },
    {
      nome: 'Comunidade Nossa Senhora das Graças',
      endereco: '',
      imagem: 'igreja2.png',
      horarios: [
        { dia: '2ª e 4ª Quarta-Feira', hora: '19h30' }
      ]
    },
    {
      nome: 'Comunidade Sant\'Ana',
      endereco: '',
      imagem: 'igreja3.png',
      horarios: [
        { dia: '2º e 4º Sábado', hora: '19h00' }
      ]
    },
    {
      nome: 'Comunidade Santa Cruz e São Roque',
      endereco: '',
      imagem: 'igreja4.png',
      horarios: [
        { dia: 'Sábado', hora: '19h00' }
      ]
    },
    {
      nome: 'Comunidade Sagrado Coração de Jesus',
      endereco: '',
      imagem: 'igreja5.png',
      horarios: [
        { dia: 'Domingo', hora: '8h00' }
      ]
    },
    {
      nome: 'Comunidade Bom Pastor',
      endereco: '',
      imagem: 'igreja6.png',
      horarios: [
        { dia: 'Domingo', hora: '9h30' }
      ]
    }
  ];

  confissoes = [
    {
      dia: 'Terça a Sexta',
      horario: '18h30 - 19h00',
      local: 'Antes da Missa'
    },
    {
      dia: 'Sábado',
      horario: '16h00 - 18h00',
      local: 'Confessionário'
    },
    {
      dia: 'Domingo',
      horario: '8h00 - 8h45',
      local: 'Confessionário'
    }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.heroVideo?.nativeElement) {
      this.heroVideo.nativeElement.playbackRate = 0.75;
    }
  }
}
