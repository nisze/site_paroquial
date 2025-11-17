import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventoAdminService, Evento } from '../../../shared/services/evento-admin';

@Component({
  selector: 'app-admin-eventos-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-eventos-form.html',
  styleUrl: './admin-eventos-form.scss'
})
export class AdminEventosForm implements OnInit {
  evento: Evento = {
    titulo: '',
    dataInicio: '',
    tipo: 'MISSA',
    ativo: true
  };
  
  modo: 'criar' | 'editar' = 'criar';
  carregando = false;
  salvando = false;
  eventoId?: number;
  previewImagem: string | null = null;
  arquivoImagem: File | null = null;
  uploadingImagem = false;

  tipos = [
    { valor: 'MISSA', nome: 'Missa' },
    { valor: 'FESTA', nome: 'Festa Religiosa' },
    { valor: 'RETIRO', nome: 'Retiro' },
    { valor: 'ENCONTRO', nome: 'Encontro' },
    { valor: 'CELEBRACAO', nome: 'Celebração' },
    { valor: 'OUTRO', nome: 'Outro' }
  ];

  constructor(
    private eventoService: EventoAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.eventoId) {
      this.modo = 'editar';
      this.carregarEvento();
    }
  }

  carregarEvento(): void {
    if (!this.eventoId) return;
    
    this.carregando = true;
    this.eventoService.getById(this.eventoId).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.previewImagem = evento.imagemUrl || null;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar evento:', err);
        // Backend não disponível - trabalhando apenas com frontend
        this.carregando = false;
      }
    });
  }

  async salvar(): Promise<void> {
    if (!this.validar()) return;
    
    this.salvando = true;

    if (this.arquivoImagem) {
      const imageUrl = await this.uploadImagem();
      if (imageUrl) {
        this.evento.imagemUrl = imageUrl;
      }
    }
    
    const operacao = this.modo === 'criar'
      ? this.eventoService.create(this.evento)
      : this.eventoService.update(this.eventoId!, this.evento);
    
    operacao.subscribe({
      next: () => {
        console.log(`Evento ${this.modo === 'criar' ? 'criado' : 'atualizado'} com sucesso!`);
        this.voltar();
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        // Simular sucesso para modo frontend-only
        console.log(`Evento ${this.modo === 'criar' ? 'criado' : 'atualizado'} (simulado)`);
        this.salvando = false;
        this.voltar();
      }
    });
  }

  validar(): boolean {
    if (!this.evento.titulo?.trim()) {
      console.warn('Validação: O título é obrigatório');
      return false;
    }
    
    if (!this.evento.dataInicio) {
      console.warn('Validação: A data de início é obrigatória');
      return false;
    }
    
    return true;
  }

  voltar(): void {
    this.router.navigate(['/admin/eventos']);
  }

  onImagemSelecionada(event: any): void {
    const arquivo = event.target.files[0];
    if (arquivo) {
      this.arquivoImagem = arquivo;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImagem = e.target.result;
      };
      reader.readAsDataURL(arquivo);
    }
  }

  async uploadImagem(): Promise<string | null> {
    if (!this.arquivoImagem) return null;
    const formData = new FormData();
    formData.append('file', this.arquivoImagem);
    this.uploadingImagem = true;
    try {
      const response: any = await this.http.post('http://localhost:8080/api/upload', formData).toPromise();
      this.uploadingImagem = false;
      return 'http://localhost:8080' + response.url;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      this.uploadingImagem = false;
      return null;
    }
  }

  removerImagem(): void {
    this.previewImagem = null;
    this.arquivoImagem = null;
    this.evento.imagemUrl = undefined;
  }
}
