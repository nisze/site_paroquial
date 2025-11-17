import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Evento {
  id?: number;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
  horaInicio?: string;
  horaFim?: string;
  tipo: string;
  local?: string;
  comunidadeResponsavel?: string;
  responsavelContato?: string;
  telefoneContato?: string;
  observacoes?: string;
  imagemUrl?: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventoAdminService {
  private apiUrl = 'http://localhost:8080/api/admin/eventos';

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

  getAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  getAtivos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/ativos`);
  }

  getProximos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/proximos`);
  }

  getById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  create(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento, { headers: this.getHeaders() });
  }

  update(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
