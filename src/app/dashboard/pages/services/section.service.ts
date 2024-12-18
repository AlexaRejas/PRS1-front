import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Section } from '../models/section.model';  // Importa el modelo Section

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private apiUrl = 'http://localhost:8080/sections';  // Cambia si tu API está en otro puerto

  constructor(private http: HttpClient) {}

  // Obtener todas las secciones
  getAllSections(): Observable<Section[]> {
    return this.http.get<Section[]>(this.apiUrl).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Obtener una sección por id
  getSectionById(id: number): Observable<Section> {
    return this.http.get<Section>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Crear una nueva sección
  createSection(section: Section): Observable<Section> {
    return this.http.post<Section>(this.apiUrl, section).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Actualizar una sección
  updateSection(id: number, section: Section): Observable<Section> {
    return this.http.put<Section>(`${this.apiUrl}/${id}`, section).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Eliminar una sección
  deleteSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Manejo de errores genérico
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Error en el lado del cliente o red
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    // Aquí puedes usar un servicio de notificación para mostrar el error al usuario
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
