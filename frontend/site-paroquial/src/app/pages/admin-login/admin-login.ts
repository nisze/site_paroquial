import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLoginComponent {
  username = '';
  senha = '';
  erro = '';
  carregando = false;
  mostrarSenha = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Se já estiver logado, redirecionar
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  login(): void {
    if (!this.username || !this.senha) {
      this.erro = 'Preencha todos os campos';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.authService.login(this.username, this.senha).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.erro = err.error?.erro || 'Usuário ou senha inválidos';
        this.carregando = false;
      }
    });
  }

  onEnter(event: Event): void {
    event.preventDefault();
    this.login();
  }
}
