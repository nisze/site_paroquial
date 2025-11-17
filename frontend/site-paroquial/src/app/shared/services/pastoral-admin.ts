import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Pastoral {
  id?: number;
  nome: string;
  descricao?: string;
  descricaoCurta?: string;
  coordenador?: string;
  contato?: string;
  telefoneContato?: string;
  emailContato?: string;
  horario?: string;
  horarioReuniao?: string;
  localReuniao?: string;
  tipo?: string;
  ativo?: boolean;
  destaque?: boolean;
  ordemExibicao?: number;
  imagemUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PastoralAdminService {
  private apiUrl = 'http://localhost:8081/api/admin/pastorais';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<Pastoral[]> {
    return this.http.get<Pastoral[]>(this.apiUrl);
  }

  getAtivas(): Observable<Pastoral[]> {
    return this.http.get<Pastoral[]>(`${this.apiUrl}/ativas`);
  }

  getDestaque(): Observable<Pastoral[]> {
    return this.http.get<Pastoral[]>(`${this.apiUrl}/destaque`);
  }

  getById(id: number): Observable<Pastoral> {
    return this.http.get<Pastoral>(`${this.apiUrl}/${id}`);
  }

  create(pastoral: Pastoral): Observable<Pastoral> {
    return this.http.post<Pastoral>(this.apiUrl, pastoral, { headers: this.getHeaders() });
  }

  update(id: number, pastoral: Pastoral): Observable<Pastoral> {
    return this.http.put<Pastoral>(`${this.apiUrl}/${id}`, pastoral, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  buscar(nome: string): Observable<Pastoral[]> {
    return this.http.get<Pastoral[]>(`${this.apiUrl}/buscar?nome=${nome}`);
  }
}
