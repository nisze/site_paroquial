import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  username: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  id: number;
  username: string;
  nomeCompleto: string;
  email: string;
  role: string;
}

export interface Usuario {
  id: number;
  username: string;
  nomeCompleto: string;
  email: string;
  role: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getUserFromStorage(): LoginResponse | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(username: string, senha: string): Observable<LoginResponse> {
    // Credenciais de demonstração (funciona offline)
    if (username === 'admin' && senha === 'admin') {
      const demoResponse: LoginResponse = {
        token: 'demo-token-' + Date.now(),
        tipo: 'Bearer',
        id: 1,
        username: 'demo',
        nomeCompleto: 'Usuário Demonstração',
        email: 'demo@paroquia.com',
        role: 'ADMIN'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(demoResponse));
      localStorage.setItem('token', demoResponse.token);
      this.currentUserSubject.next(demoResponse);
      
      // Retorna um Observable com os dados demo
      return new Observable(observer => {
        observer.next(demoResponse);
        observer.complete();
      });
    }

    // Login real via backend
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, senha })
      .pipe(
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/admin-login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN';
  }

  isEditor(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN' || user?.role === 'EDITOR';
  }

  validateToken(): Observable<{valid: boolean}> {
    return this.http.post<{valid: boolean}>(`${this.apiUrl}/validate`, {});
  }

  getCurrentUserDetails(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`);
  }
}
