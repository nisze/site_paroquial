import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NoticiaAdminService, Noticia } from '../../../shared/services/noticia-admin';

@Component({
  selector: 'app-admin-noticias-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-noticias-form.html',
  styleUrl: './admin-noticias-form.scss'
})
export class AdminNoticiasForm implements OnInit {
  noticia: Noticia = {
    titulo: '',
    tipo: 'COMUNICADO',
    prioridade: 'MEDIA',
    ativo: true,
    destaque: false
  };
  
  modo: 'criar' | 'editar' = 'criar';
  carregando = false;
  salvando = false;
  noticiaId?: number;
  previewImagem: string | null = null;
  arquivoImagem: File | null = null;
  uploadingImagem = false;

  tipos = [
    { valor: 'COMUNICADO', nome: 'Comunicado' },
    { valor: 'AVISO', nome: 'Aviso' },
    { valor: 'EVENTO', nome: 'Evento' },
    { valor: 'GERAL', nome: 'Geral' }
  ];

  prioridades = [
    { valor: 'BAIXA', nome: 'Baixa' },
    { valor: 'MEDIA', nome: 'Média' },
    { valor: 'ALTA', nome: 'Alta' },
    { valor: 'URGENTE', nome: 'Urgente' }
  ];

  constructor(
    private noticiaService: NoticiaAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.noticiaId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.noticiaId) {
      this.modo = 'editar';
      this.carregarNoticia();
    }
  }

  carregarNoticia(): void {
    if (!this.noticiaId) return;
    
    this.carregando = true;
    this.noticiaService.getById(this.noticiaId).subscribe({
      next: (noticia) => {
        this.noticia = noticia;
        this.previewImagem = noticia.imagemUrl || null;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar notícia:', err);
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
        this.noticia.imagemUrl = imageUrl;
      }
    }
    
    const operacao = this.modo === 'criar'
      ? this.noticiaService.create(this.noticia)
      : this.noticiaService.update(this.noticiaId!, this.noticia);
    
    operacao.subscribe({
      next: () => {
        console.log(`Notícia ${this.modo === 'criar' ? 'criada' : 'atualizada'} com sucesso!`);
        this.voltar();
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        // Simular sucesso para modo frontend-only
        console.log(`Notícia ${this.modo === 'criar' ? 'criada' : 'atualizada'} (simulado)`);
        this.salvando = false;
        this.voltar();
      }
    });
  }

  validar(): boolean {
    if (!this.noticia.titulo?.trim()) {
      console.warn('Validação: O título é obrigatório');
      return false;
    }
    
    return true;
  }

  voltar(): void {
    this.router.navigate(['/admin/noticias']);
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
    this.noticia.imagemUrl = undefined;
  }
}
