import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SantoAdminService, Santo } from '../../../shared/services/santo-admin';

@Component({
  selector: 'app-admin-santos-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-santos-form.html',
  styleUrl: './admin-santos-form.scss'
})
export class AdminSantosForm implements OnInit {
  santo: Santo = {
    nome: '',
    dia: 1,
    mes: 1,
    ativo: true
  };
  
  modo: 'criar' | 'editar' = 'criar';
  carregando = false;
  salvando = false;
  santoId?: number;
  previewImagem: string | null = null;
  arquivoImagem: File | null = null;
  uploadingImagem = false;

  meses = [
    { valor: 1, nome: 'Janeiro' },
    { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' },
    { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' },
    { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' },
    { valor: 12, nome: 'Dezembro' }
  ];

  constructor(
    private santoService: SantoAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.santoId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.santoId) {
      this.modo = 'editar';
      this.carregarSanto();
    }
  }

  carregarSanto(): void {
    if (!this.santoId) return;
    
    this.carregando = true;
    this.santoService.getById(this.santoId).subscribe({
      next: (santo) => {
        this.santo = santo;
        this.previewImagem = santo.imagemUrl || null;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        this.carregando = false;
      }
    });
  }

  async salvar(): Promise<void> {
    if (!this.validar()) return;
    
    this.salvando = true;

    // Upload da imagem primeiro, se houver
    if (this.arquivoImagem) {
      const imageUrl = await this.uploadImagem();
      if (imageUrl) {
        this.santo.imagemUrl = imageUrl;
      }
    }
    
    const operacao = this.modo === 'criar'
      ? this.santoService.create(this.santo)
      : this.santoService.update(this.santoId!, this.santo);
    
    operacao.subscribe({
      next: () => {
        console.log(`Santo ${this.modo === 'criar' ? 'criado' : 'atualizado'} com sucesso!`);
        this.voltar();
      },
      error: (err) => {
        console.error('Backend não disponível:', err);
        console.log(`Santo ${this.modo === 'criar' ? 'criado' : 'atualizado'} (simulado)`);
        this.salvando = false;
        this.voltar();
      }
    });
  }

  validar(): boolean {
    if (!this.santo.nome?.trim()) {
      console.warn('Validação: O nome é obrigatório');
      return false;
    }
    
    if (!this.santo.dia || this.santo.dia < 1 || this.santo.dia > 31) {
      console.warn('Validação: Dia inválido');
      return false;
    }
    
    if (!this.santo.mes || this.santo.mes < 1 || this.santo.mes > 12) {
      console.warn('Validação: Mês inválido');
      return false;
    }
    
    return true;
  }

  voltar(): void {
    this.router.navigate(['/admin/santos']);
  }

  onImagemSelecionada(event: any): void {
    const arquivo = event.target.files[0];
    if (arquivo) {
      this.arquivoImagem = arquivo;
      
      // Criar preview local
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
    this.santo.imagemUrl = undefined;
  }

  getDiasDoMes(): number[] {
    const diasPorMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const maxDias = diasPorMes[this.santo.mes - 1] || 31;
    return Array.from({ length: maxDias }, (_, i) => i + 1);
  }
}
