import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Santo {
  id?: number;
  nome: string;
  titulo?: string;
  descricaoResumida?: string;
  descricaoCompleta?: string;
  biografia?: string; // Mantido para compatibilidade
  oracao?: string;
  dia: number;
  mes: number;
  festaLiturgica?: string;
  padroeiroDe?: string[];
  dataNascimento?: string;
  dataMorte?: string;
  canonizadoPor?: string;
  imagemUrl?: string;
  fonte?: string; // Vatican News URL
  ativo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SantoAdminService {
  private apiUrl = 'http://localhost:8081/api/admin/santos';

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

  getAll(): Observable<Santo[]> {
    return this.http.get<Santo[]>(this.apiUrl);
  }

  getById(id: number): Observable<Santo> {
    return this.http.get<Santo>(`${this.apiUrl}/${id}`);
  }

  getByData(dia: number, mes: number): Observable<Santo[]> {
    return this.http.get<Santo[]>(`${this.apiUrl}/data/${dia}/${mes}`);
  }

  create(santo: Santo): Observable<Santo> {
    return this.http.post<Santo>(this.apiUrl, santo, { headers: this.getHeaders() });
  }

  update(id: number, santo: Santo): Observable<Santo> {
    return this.http.put<Santo>(`${this.apiUrl}/${id}`, santo, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  buscar(termo: string): Observable<Santo[]> {
    return this.http.get<Santo[]>(`${this.apiUrl}/buscar?nome=${termo}`);
  }
}
