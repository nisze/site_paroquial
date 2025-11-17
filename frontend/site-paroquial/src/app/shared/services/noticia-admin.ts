import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Noticia {
  id?: number;
  titulo: string;
  resumo?: string;
  conteudo?: string;
  tipo: string;
  prioridade: string;
  dataPublicacao?: string;
  dataExpiracao?: string;
  comunidadeOrigem?: string;
  autor?: string;
  imagemUrl?: string;
  ativo: boolean;
  destaque: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NoticiaAdminService {
  private apiUrl = 'http://localhost:8080/api/admin/noticias';

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

  getAll(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiUrl);
  }

  getAtivas(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.apiUrl}/ativas`);
  }

  getDestaque(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.apiUrl}/destaque`);
  }

  getById(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.apiUrl}/${id}`);
  }

  create(noticia: Noticia): Observable<Noticia> {
    return this.http.post<Noticia>(this.apiUrl, noticia, { headers: this.getHeaders() });
  }

  update(id: number, noticia: Noticia): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.apiUrl}/${id}`, noticia, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
