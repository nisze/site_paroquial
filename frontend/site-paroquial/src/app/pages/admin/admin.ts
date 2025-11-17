import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginResponse } from '../../shared/services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  usuario: LoginResponse | null = null;
  sidebarAberta = true;
  menuAtivo = 'santos';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    
    // MODO DEMO - Criar usuário fake se não houver usuário logado
    if (!this.usuario) {
      const demoUser: LoginResponse = {
        token: 'demo-token-temp',
        tipo: 'Bearer',
        id: 1,
        username: 'admin',
        nomeCompleto: 'Administrador Demo',
        email: 'admin@paroquia.com',
        role: 'ADMIN'
      };
      this.usuario = demoUser;
    }
  }

  toggleSidebar(): void {
    this.sidebarAberta = !this.sidebarAberta;
  }

  setMenuAtivo(menu: string): void {
    this.menuAtivo = menu;
  }

  logout(): void {
    if (confirm('Deseja realmente sair?')) {
      this.authService.logout();
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isEditor(): boolean {
    return this.authService.isEditor();
  }

  getRoleLabel(): string {
    const role = this.usuario?.role;
    switch(role) {
      case 'ADMIN': return 'Administrador';
      case 'EDITOR': return 'Editor';
      case 'VISUALIZADOR': return 'Visualizador';
      default: return 'Usuário';
    }
  }
}
