import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FamilyDTO } from '../familia/familiaDto';
@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private apiUrl = 'http://localhost:8080/api/families';

  constructor(private http: HttpClient) { }

  // Modificar para manejar Flux de Spring
  getFamiliesActive(): Observable<FamilyDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/active`).pipe(
      map(response => {
        // Si la respuesta es directamente un array, devolverlo
        if (Array.isArray(response)) {
          return response;
        }
        // Si la respuesta tiene una estructura diferente, ajustar según sea necesario
        return response.body || [];
      })
    );
  }

  // Los otros métodos similarmente
  getFamiliesInactive(): Observable<FamilyDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/inactive`).pipe(
      map(response => Array.isArray(response) ? response : (response.body || []))
    );
  }

  getFamilyById(id: number): Observable<FamilyDTO> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.body || response)
    );
  }

  createFamily(family: FamilyDTO): Observable<FamilyDTO> {
    return this.http.post<any>(this.apiUrl, family).pipe(
      map(response => response.body || response)
    );
  }

  updateFamily(id: number, family: FamilyDTO): Observable<FamilyDTO> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, family).pipe(
      map(response => response.body || response)
    );
  }
}