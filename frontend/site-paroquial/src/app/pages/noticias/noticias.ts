import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoticiaAdminService } from '../../shared/services/noticia-admin';

interface NoticiaDisplay {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  categoria: 'avisos' | 'eventos' | 'pastorais' | 'liturgia';
  data: Date;
  autor: string;
  visualizacoes: number;
  destaque: boolean;
}

interface Aviso {
  id: number;
  titulo: string;
  texto: string;
  data: Date;
  urgente: boolean;
}

interface Evento {
  id: number;
  titulo: string;
  data: Date;
  horario: string;
  local: string;
  descricao: string;
}

@Component({
  selector: 'app-noticias',
  imports: [CommonModule, RouterModule],
  templateUrl: './noticias.html',
  styleUrl: './noticias.scss'
})
export class Noticias implements OnInit {
  
  noticias: NoticiaDisplay[] = [];
  noticiasFiltradas: NoticiaDisplay[] = [];
  filtroAtivo: string = 'todas';
  
  avisosImportantes: Aviso[] = [];
  proximosEventos: Evento[] = [];

  constructor(private noticiaService: NoticiaAdminService) {}

  ngOnInit() {
    this.carregarNoticias();
    this.carregarAvisos();
    this.carregarEventos();
  }

  filtrarPor(categoria: string) {
    this.filtroAtivo = categoria;
    
    if (categoria === 'todas') {
      this.noticiasFiltradas = this.noticias;
    } else {
      this.noticiasFiltradas = this.noticias.filter(
        noticia => noticia.categoria === categoria
      );
    }
    
    // Atualizar classe ativa dos botões
    this.atualizarBotoesAtivos();
  }

  getBadgeClass(categoria: string): string {
    const classes = {
      'avisos': 'bg-warning text-dark',
      'eventos': 'bg-primary',
      'pastorais': 'bg-success',
      'liturgia': 'bg-info'
    };
    return classes[categoria as keyof typeof classes] || 'bg-secondary';
  }

  private atualizarBotoesAtivos() {
    // Esta função pode ser expandida para gerenciar estado dos botões
    console.log(`Filtro ativo: ${this.filtroAtivo}`);
  }

  private carregarNoticias() {
    this.noticiaService.getAtivas().subscribe({
      next: (noticiasBackend) => {
        this.noticias = noticiasBackend.map(n => this.converterNoticiaParaDisplay(n));
        this.noticiasFiltradas = this.noticias;
      },
      error: (erro) => {
        console.error('Erro ao carregar notícias:', erro);
        // Fallback para dados mock em caso de erro
        this.carregarNoticiasMock();
      }
    });
  }

  private converterNoticiaParaDisplay(noticia: any): NoticiaDisplay {
    return {
      id: noticia.id || 0,
      titulo: noticia.titulo || 'Sem título',
      resumo: noticia.resumo || noticia.conteudo?.substring(0, 150) || '',
      conteudo: noticia.conteudo || '',
      imagem: noticia.imagemUrl || '/noticiasim.jpeg',
      categoria: this.mapearTipoParaCategoria(noticia.tipo),
      data: noticia.dataPublicacao ? new Date(noticia.dataPublicacao) : new Date(),
      autor: noticia.autor || 'Paróquia',
      visualizacoes: 0,
      destaque: noticia.destaque || false
    };
  }

  private mapearTipoParaCategoria(tipo: string): 'avisos' | 'eventos' | 'pastorais' | 'liturgia' {
    const mapa: { [key: string]: 'avisos' | 'eventos' | 'pastorais' | 'liturgia' } = {
      'AVISO': 'avisos',
      'EVENTO': 'eventos',
      'PASTORAL': 'pastorais',
      'LITURGIA': 'liturgia',
      'GERAL': 'avisos'
    };
    return mapa[tipo?.toUpperCase()] || 'avisos';
  }

  private carregarNoticiasMock() {
    this.noticias = [
      {
        id: 1,
        titulo: 'Festa de Nossa Senhora Aparecida 2025',
        resumo: 'Celebre conosco a festa da nossa padroeira! Programação especial com missas, procissão e festividades.',
        conteudo: 'Conteúdo completo da notícia...',
        imagem: '/festa.png',
        categoria: 'eventos',
        data: new Date('2025-10-12'),
        autor: 'Pe. João Silva',
        visualizacoes: 1245,
        destaque: true
      },
      {
        id: 2,
        titulo: 'Nova Pastoral da Juventude',
        resumo: 'Convidamos todos os jovens entre 16 e 30 anos para participar da nossa nova pastoral.',
        conteudo: 'Conteúdo completo da notícia...',
        imagem: '/pastorais.jpeg',
        categoria: 'pastorais',
        data: new Date('2025-10-15'),
        autor: 'Coordenação Pastoral',
        visualizacoes: 892,
        destaque: false
      },
      {
        id: 3,
        titulo: 'Mudança nos Horários das Missas',
        resumo: 'A partir do próximo domingo, os horários das missas serão alterados. Confira os novos horários.',
        conteudo: 'Conteúdo completo da notícia...',
        imagem: '/horamissa.jpeg',
        categoria: 'avisos',
        data: new Date('2025-10-18'),
        autor: 'Secretaria Paroquial',
        visualizacoes: 2156,
        destaque: false
      }
    ];
    this.noticiasFiltradas = this.noticias;
  }

  private carregarAvisos() {
    this.avisosImportantes = [
      {
        id: 1,
        titulo: 'Novo Horário de Atendimento',
        texto: 'Secretaria funcionará de segunda a sexta, das 8h às 17h.',
        data: new Date('2025-10-20'),
        urgente: true
      },
      {
        id: 2,
        titulo: 'Confissões Especiais',
        texto: 'Sábados das 16h às 18h para preparação da festa da padroeira.',
        data: new Date('2025-10-19'),
        urgente: false
      },
      {
        id: 3,
        titulo: 'Estacionamento',
        texto: 'Durante a festa, utilize o estacionamento da escola vizinha.',
        data: new Date('2025-10-18'),
        urgente: false
      }
    ];
  }

  private carregarEventos() {
    this.proximosEventos = [
      {
        id: 1,
        titulo: 'Missa Solene da Padroeira',
        data: new Date('2025-10-12'),
        horario: '10:00',
        local: 'Igreja Matriz',
        descricao: 'Celebração principal da festa'
      },
      {
        id: 2,
        titulo: 'Reunião Pastoral da Família',
        data: new Date('2025-10-25'),
        horario: '19:30',
        local: 'Salão Paroquial',
        descricao: 'Reunião mensal da pastoral'
      },
      {
        id: 3,
        titulo: 'Catequese Infantil',
        data: new Date('2025-10-27'),
        horario: '14:00',
        local: 'Salas de Catequese',
        descricao: 'Encontro semanal das crianças'
      },
      {
        id: 4,
        titulo: 'Novena de Nossa Senhora',
        data: new Date('2025-11-01'),
        horario: '19:00',
        local: 'Igreja Matriz',
        descricao: 'Início da novena mensal'
      }
    ];
  }
}
