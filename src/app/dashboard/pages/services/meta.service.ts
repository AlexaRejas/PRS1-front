import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meta } from '../models/meta.model';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private apiUrl = 'http://localhost:8080/metas';

  constructor(private http: HttpClient) {}

  getAllMetas(): Observable<Meta[]> {
    return this.http.get<Meta[]>(this.apiUrl);
  }

  getMetasByStatus(status: string): Observable<Meta[]> {
    return this.http.get<Meta[]>(`${this.apiUrl}/status/${status}`);
  }

  createMeta(meta: Partial<Meta>): Observable<Meta> {
    const metaData = {
      name: meta.name,
      description: meta.description,
      objective: meta.objective,
      time: meta.time,
      status: 'A',
      section: {
        idSection: meta.section?.idSection,
      },
    };

    console.log('Enviando datos de meta:', metaData);
    return this.http.post<Meta>(this.apiUrl, metaData);
  }

  updateMeta(meta: Partial<Meta>): Observable<Meta> {
    if (!meta.idMeta) {
      throw new Error('Meta id is required for updating');
    }
  
    const url = `${this.apiUrl}/${meta.idMeta}`;  // Use idMeta instead of id
    const metaData = {
      name: meta.name,
      description: meta.description,
      objective: meta.objective,
      time: meta.time,
      status: meta.status,
      section: {
        idSection: meta.section?.idSection,
      },
    };
  
    console.log('Enviando datos para actualizar meta:', metaData);
    return this.http.put<Meta>(url, metaData);
  }
  updateMetaStatus(id: number, status: string): Observable<Meta> {
    const url = `${this.apiUrl}/${id}/status`;
    return this.http.put<Meta>(url, { status });
  }  
  
  deleteMeta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
