import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PastoralAdminService, Pastoral } from '../../shared/services/pastoral-admin';

interface Grupo {
  id: number;
  nome: string;
  descricao: string;
  categoria: 'pastorais' | 'ministerios' | 'movimentos' | 'servicos';
  coordenador: string;
  diasReuniao: string;
  horario: string;
  local: string;
  imagem: string;
  whatsapp?: string;
  email?: string;
  ativo: boolean;
  vagas: number;
}

interface Estatisticas {
  totalGrupos: number;
  totalParticipantes: number;
  totalCoordenadores: number;
  gruposAbertos: number;
}

@Component({
  selector: 'app-grupos',
  imports: [CommonModule, RouterModule],
  templateUrl: './grupos.html',
  styleUrl: './grupos.scss'
})
export class Grupos implements OnInit {
  
  grupos: Grupo[] = [];
  gruposFiltrados: Grupo[] = [];
  filtroAtivo: string = 'todos';
  carregando = false;
  
  estatisticas: Estatisticas = {
    totalGrupos: 0,
    totalParticipantes: 0,
    totalCoordenadores: 0,
    gruposAbertos: 0
  };

  constructor(private pastoralService: PastoralAdminService) {}

  ngOnInit() {
    this.carregarGrupos();
  }

  filtrarPor(categoria: string) {
    this.filtroAtivo = categoria;
    
    if (categoria === 'todos') {
      this.gruposFiltrados = this.grupos;
    } else {
      this.gruposFiltrados = this.grupos.filter(
        grupo => grupo.categoria === categoria
      );
    }
  }

  getBadgeClass(categoria: string): string {
    const classes = {
      'pastorais': 'bg-success',
      'ministerios': 'bg-info',
      'movimentos': 'bg-warning text-dark',
      'servicos': 'bg-secondary'
    };
    return classes[categoria as keyof typeof classes] || 'bg-primary';
  }

  getCategoriaLabel(categoria: string): string {
    const labels = {
      'pastorais': 'Pastoral',
      'ministerios': 'Ministério',
      'movimentos': 'Movimento',
      'servicos': 'Serviço'
    };
    return labels[categoria as keyof typeof labels] || categoria;
  }

  private carregarGrupos() {
    this.carregando = true;
    
    this.pastoralService.getAll().subscribe({
      next: (pastorais) => {
        // Converte pastorais do backend para formato de grupos
        this.grupos = pastorais
          .filter(p => p.ativo !== false)
          .map(p => this.converterPastoralParaGrupo(p));
        
        this.gruposFiltrados = this.grupos;
        this.calcularEstatisticas();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar grupos:', err);
        // Fallback para dados mockados se backend não estiver disponível
        this.carregarGruposMock();
        this.carregando = false;
      }
    });
  }

  private converterPastoralParaGrupo(pastoral: Pastoral): Grupo {
    return {
      id: pastoral.id || 0,
      nome: pastoral.nome,
      descricao: pastoral.descricao || '',
      categoria: this.mapearTipo(pastoral.tipo),
      coordenador: pastoral.coordenador || 'A definir',
      diasReuniao: this.extrairDias(pastoral.horario),
      horario: this.extrairHorario(pastoral.horario),
      local: 'Paróquia',
      imagem: pastoral.imagemUrl || '/pastorais.jpeg',
      whatsapp: pastoral.contato,
      ativo: pastoral.ativo !== false,
      vagas: 10
    };
  }

  private mapearTipo(tipo: string | undefined): 'pastorais' | 'ministerios' | 'movimentos' | 'servicos' {
    if (!tipo) return 'pastorais';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('ministerio')) return 'ministerios';
    if (tipoLower.includes('movimento')) return 'movimentos';
    if (tipoLower.includes('servico')) return 'servicos';
    return 'pastorais';
  }

  private extrairDias(horario: string | undefined): string {
    if (!horario) return 'A definir';
    // Extrai dias da semana do texto
    const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    for (const dia of dias) {
      if (horario.toLowerCase().includes(dia)) {
        return dia.charAt(0).toUpperCase() + dia.slice(1) + 's';
      }
    }
    return horario.split(' ')[0] || 'A definir';
  }

  private extrairHorario(horario: string | undefined): string {
    if (!horario) return 'A definir';
    // Busca padrão de horário (HH:MM ou HHh)
    const match = horario.match(/(\d{1,2}):?(\d{2})?h?/);
    if (match) {
      return match[2] ? `${match[1]}:${match[2]}` : `${match[1]}:00`;
    }
    return horario;
  }

  private carregarGruposMock() {
    const imagemPadrao = '/pastorais.jpeg';
    this.grupos = [
      {
        id: 1,
        nome: 'Pastoral da Juventude',
        descricao: 'Grupo para jovens entre 16 e 30 anos que desejam viver a fé de forma dinâmica e participativa, através de encontros, retiros e ações sociais.',
        categoria: 'pastorais',
        coordenador: 'Maria Silva',
        diasReuniao: 'Domingos',
        horario: '19:00',
        local: 'Salão Paroquial',
        imagem: imagemPadrao,
        whatsapp: '+5511999999999',
        email: 'pj@paroquia.com.br',
        ativo: true,
        vagas: 15
      },
      {
        id: 2,
        nome: 'Pastoral Familiar',
        descricao: 'Acompanhamento e formação de famílias cristãs, preparação para casamento e fortalecimento dos laços familiares.',
        categoria: 'pastorais',
        coordenador: 'João e Ana Santos',
        diasReuniao: 'Sábados',
        horario: '15:00',
        local: 'Sala de Reuniões',
        imagem: imagemPadrao,
        whatsapp: '+5511888888888',
        ativo: true,
        vagas: 10
      },
      {
        id: 3,
        nome: 'Ministério de Música',
        descricao: 'Grupo responsável pela animação litúrgica através de cantos e instrumentos, levando alegria e louvor às celebrações.',
        categoria: 'ministerios',
        coordenador: 'Carlos Oliveira',
        diasReuniao: 'Terças e Quintas',
        horario: '20:00',
        local: 'Igreja Matriz',
        imagem: imagemPadrao,
        whatsapp: '+5511777777777',
        ativo: true,
        vagas: 8
      },
      {
        id: 4,
        nome: 'Ministério da Palavra',
        descricao: 'Formação de leitores e comentaristas para as celebrações litúrgicas, aprofundando o conhecimento das Sagradas Escrituras.',
        categoria: 'ministerios',
        coordenador: 'Helena Costa',
        diasReuniao: 'Quartas',
        horario: '19:30',
        local: 'Biblioteca Paroquial',
        imagem: imagemPadrao,
        email: 'palavra@paroquia.com.br',
        ativo: true,
        vagas: 12
      },
      {
        id: 5,
        nome: 'Renovação Carismática',
        descricao: 'Movimento de renovação espiritual através da oração carismática, adoração ao Santíssimo e grupos de oração.',
        categoria: 'movimentos',
        coordenador: 'Padre João Silva',
        diasReuniao: 'Sextas',
        horario: '20:00',
        local: 'Capela da Adoração',
        imagem: imagemPadrao,
        whatsapp: '+5511666666666',
        ativo: true,
        vagas: 20
      },
      {
        id: 6,
        nome: 'Legião de Maria',
        descricao: 'Movimento mariano dedicado à oração, visitas aos enfermos e evangelização, seguindo o exemplo de Nossa Senhora.',
        categoria: 'movimentos',
        coordenador: 'Rosário Ferreira',
        diasReuniao: 'Segundas',
        horario: '14:00',
        local: 'Gruta de Nossa Senhora',
        imagem: imagemPadrao,
        ativo: true,
        vagas: 6
      },
      {
        id: 7,
        nome: 'Equipe de Limpeza',
        descricao: 'Voluntários dedicados à manutenção e limpeza dos espaços paroquiais, cuidando da casa de Deus com amor.',
        categoria: 'servicos',
        coordenador: 'Antônio Ramos',
        diasReuniao: 'Sábados',
        horario: '08:00',
        local: 'Igreja e Dependências',
        imagem: imagemPadrao,
        ativo: true,
        vagas: 5
      },
      {
        id: 8,
        nome: 'Pastoral Social',
        descricao: 'Atendimento às famílias carentes da comunidade através de doações, cestas básicas e apoio social.',
        categoria: 'pastorais',
        coordenador: 'Lucia Mendes',
        diasReuniao: 'Quartas',
        horario: '09:00',
        local: 'Secretaria Social',
        imagem: imagemPadrao,
        whatsapp: '+5511555555555',
        ativo: true,
        vagas: 10
      },
      {
        id: 9,
        nome: 'Ministério da Eucaristia',
        descricao: 'Ministros extraordinários que auxiliam na distribuição da Sagrada Comunhão durante as celebrações.',
        categoria: 'ministerios',
        coordenador: 'Roberto Lima',
        diasReuniao: 'Domingos',
        horario: '18:00',
        local: 'Sacristia',
        imagem: imagemPadrao,
        ativo: true,
        vagas: 4
      },
      {
        id: 10,
        nome: 'Catequese de Adultos',
        descricao: 'Formação cristã para adultos que desejam receber os sacramentos ou aprofundar sua fé.',
        categoria: 'pastorais',
        coordenador: 'Fernanda Alves',
        diasReuniao: 'Terças',
        horario: '19:00',
        local: 'Sala de Catequese',
        imagem: imagemPadrao,
        email: 'catequese@paroquia.com.br',
        ativo: true,
        vagas: 8
      },
      {
        id: 11,
        nome: 'Equipe Técnica',
        descricao: 'Responsáveis pelo som, iluminação e transmissões ao vivo das celebrações e eventos paroquiais.',
        categoria: 'servicos',
        coordenador: 'Marcos Pereira',
        diasReuniao: 'Domingos',
        horario: '17:00',
        local: 'Mesa de Som',
        imagem: imagemPadrao,
        whatsapp: '+5511444444444',
        ativo: true,
        vagas: 3
      },
      {
        id: 12,
        nome: 'Pastoral da Criança',
        descricao: 'Acompanhamento de crianças e gestantes em situação de vulnerabilidade, promovendo saúde e cidadania.',
        categoria: 'pastorais',
        coordenador: 'Isabel Rodrigues',
        diasReuniao: 'Sábados',
        horario: '14:00',
        local: 'Centro Comunitário',
        imagem: imagemPadrao,
        whatsapp: '+5511333333333',
        ativo: true,
        vagas: 12
      }
    ];

    this.gruposFiltrados = this.grupos;
  }

  private calcularEstatisticas() {
    this.estatisticas = {
      totalGrupos: this.grupos.length,
      totalParticipantes: 350, // Número estimado
      totalCoordenadores: this.grupos.length,
      gruposAbertos: this.grupos.filter(g => g.vagas > 0).length
    };
  }
}
