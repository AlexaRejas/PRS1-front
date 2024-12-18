import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FamilyDTO } from './familiaDto';
import { FamilyService } from '../services/family.service';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs'; // Asegúrate de importar throwError correctamente

@Component({
  selector: 'app-familia',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './familia.component.html',
  styleUrl: './familia.component.css'
})
export class FamiliaComponent implements OnInit {
  familias: FamilyDTO[] = [];
  familySelected: FamilyDTO | null = null;
  loading = false;
  error: string | null = null;

  constructor(private familyService: FamilyService) {}

  ngOnInit(): void {
    this.cargarFamiliasActivas();
  }

  cargarFamiliasActivas() {
    this.loading = true;
    this.familyService.getFamiliesActive()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error detallado:', error);
          this.error = this.procesarError(error);
          this.loading = false;
          return of([]); // Devuelve un array vacío en lugar de lanzar un error
        })
      )
      .subscribe({
        next: (data) => {
          this.familias = data;
          this.loading = false;
          this.error = null;
        }
      });
  }

  private procesarError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      return `Error: ${error.error.message}` || 'Error desconocido';
    } else {
      // Error del lado del servidor
      return `Código de error ${error.status}: ${error.error?.error || 'Error desconocido'}`;
    }
  }

  seleccionarFamilia(familia: FamilyDTO) {
    this.familySelected = familia;
  }
}