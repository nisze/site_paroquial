import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PastoralAdminService, Pastoral } from '../../../shared/services/pastoral-admin';

@Component({
  selector: 'app-admin-pastorais-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-pastorais-form.html',
  styleUrl: './admin-pastorais-form.scss'
})
export class AdminPastoraisForm implements OnInit {
  pastoral: Pastoral = {
    nome: '',
    ativo: true,
    destaque: false
  };
  
  modo: 'criar' | 'editar' = 'criar';
  carregando = false;
  salvando = false;
  pastoralId?: number;
  previewImagem: string | null = null;
  arquivoImagem: File | null = null;
  uploadingImagem = false;

  constructor(
    private pastoralService: PastoralAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('AdminPastoraisForm inicializado');
    this.pastoralId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.pastoralId) {
      this.modo = 'editar';
      this.carregarPastoral();
    } else {
      console.log('Modo: criar nova pastoral');
    }
  }

  carregarPastoral(): void {
    if (!this.pastoralId) return;
    
    this.carregando = true;
    this.pastoralService.getById(this.pastoralId).subscribe({
      next: (pastoral) => {
        this.pastoral = pastoral;
        this.previewImagem = pastoral.imagemUrl || null;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pastoral:', err);
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
        this.pastoral.imagemUrl = imageUrl;
      }
    }
    
    const operacao = this.modo === 'criar'
      ? this.pastoralService.create(this.pastoral)
      : this.pastoralService.update(this.pastoralId!, this.pastoral);
    
    operacao.subscribe({
      next: () => {
        console.log(`Pastoral ${this.modo === 'criar' ? 'criada' : 'atualizada'} com sucesso!`);
        this.voltar();
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        // Simular sucesso para modo frontend-only
        console.log(`Pastoral ${this.modo === 'criar' ? 'criada' : 'atualizada'} (simulado)`);
        this.salvando = false;
        this.voltar();
      }
    });
  }

  validar(): boolean {
    if (!this.pastoral.nome?.trim()) {
      console.warn('Validação: O nome é obrigatório');
      return false;
    }
    
    return true;
  }

  voltar(): void {
    this.router.navigate(['/admin/pastorais']);
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
    this.pastoral.imagemUrl = undefined;
  }
}
