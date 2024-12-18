import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaService } from '../services/meta.service';
import { SectionService } from '../services/section.service';
import { Meta } from '../models/meta.model';
import { Section } from '../models/section.model';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.css'],
  standalone: true,
  providers: [MetaService, SectionService, DatePipe],
  imports: [CommonModule, ReactiveFormsModule],
})
export class MetaComponent implements OnInit {
  metas: Meta[] = [];
  sections: Section[] = [];
  metaForm: FormGroup;
  selectedSectionDescription: string = ''; // Descripción de la sección seleccionada
  showForm: boolean = false;
  editingMeta: Meta | null = null;  // Ensure it has the full `Meta` type
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  showInactiveMetas: boolean = false;  // Para controlar la visualización de metas inactivas

  constructor(
    private metaService: MetaService,
    private sectionService: SectionService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.metaForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      sectionId: ['', Validators.required],
      objective: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadMetas();
    this.loadSections();
  }

  // Método para alternar entre metas activas e inactivas
  toggleInactiveMetas(): void {
    this.showInactiveMetas = !this.showInactiveMetas;
    this.loadMetas();  // Recargar las metas según el filtro (activas o inactivas)
  }

  // Método para cargar las metas, activas o inactivas, según el estado
  loadMetas(): void {
    this.metaService.getAllMetas().subscribe({
      next: (data) => {
        // Filtrar las metas según el estado activo o inactivo
        if (this.showInactiveMetas) {
          this.metas = data.filter(meta => meta.status === 'I');
        } else {
          this.metas = data.filter(meta => meta.status === 'A');
        }
      },
      error: (err) => console.error('Error al cargar metas:', err),
    });
  }

  loadSections(): void {
    this.sectionService.getAllSections().subscribe({
      next: (data) => {
        this.sections = data;
      },
      error: (err) => console.error('Error al cargar secciones:', err),
    });
  }

  onSectionChange(): void {
    const selectedSectionId = this.metaForm.value.sectionId;
    const selectedSection = this.sections.find(
      (section) => section.idSection === Number(selectedSectionId)
    );
    this.selectedSectionDescription = selectedSection
      ? selectedSection.description
      : ''; // Actualiza la descripción al cambiar de sección
  }

  createMeta(): void {
    if (this.metaForm.valid) {
      const selectedSectionId = this.metaForm.value.sectionId;
      const selectedSection = this.sections.find(
        (section) => section.idSection === Number(selectedSectionId)
      );

      const metaData: Partial<Meta> = {
        ...this.metaForm.value,
        section: selectedSection,
        sectionDescription: selectedSection?.description,
        status: 'A',  // Establecer el estado como 'A' al crear la meta
      };

      this.metaService.createMeta(metaData).subscribe({
        next: (response) => {
          this.loadMetas();
          this.metaForm.reset();
          this.selectedSectionDescription = '';
        },
        error: (error) => {
          console.error('Error al crear meta:', error);
        },
      });
    } else {
      this.markFormControlsAsTouched();
    }
  }

  // Preparar para la edición de una meta
  prepareForEdit(meta: Meta): void {
    // Inicializa el formulario con los valores de la meta seleccionada
    this.editingMeta = meta;

    // Establecer los valores del formulario con los datos de la meta
    this.metaForm.patchValue({
      name: meta.name,
      description: meta.description,
      sectionId: meta.section?.idSection || '',
      objective: meta.objective,
      time: meta.time
    });

    // Si es necesario, puedes también almacenar la descripción de la sección
    this.selectedSectionDescription = meta.sectionDescription || '';
  }

  // Actualizar la meta
  updateMeta(): void {
    if (this.metaForm.valid && this.editingMeta) {
      const selectedSectionId = this.metaForm.value.sectionId;
      const selectedSection = this.sections.find(
        (section) => section.idSection === Number(selectedSectionId)
      );

      const metaData: Meta = {
        ...this.metaForm.value,
        idMeta: this.editingMeta.idMeta,  // Usar idMeta del objeto 'editingMeta'
        section: selectedSection,  // Asignar la sección correctamente
        status: 'A',  // Aseguramos que el estado sea siempre 'A' al actualizar
      };

      console.log('Meta a actualizar:', metaData);  // Para depurar los datos

      this.metaService.updateMeta(metaData).subscribe({
        next: () => {
          this.loadMetas();  // Recargar las metas después de la actualización
          this.metaForm.reset();  // Resetear el formulario
          this.editingMeta = null;  // Limpiar la meta en edición
          this.selectedSectionDescription = '';  // Limpiar la descripción de la sección
        },
        error: (error) => {
          console.error('Error al actualizar meta:', error);
        },
      });
    } else {
      this.markFormControlsAsTouched();
    }
  }

  prepareForCreate(): void {
    this.editingMeta = null;
    this.metaForm.reset();
    this.selectedSectionDescription = '';
  }

  private markFormControlsAsTouched(): void {
    Object.keys(this.metaForm.controls).forEach((key) => {
      const control = this.metaForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Cambiar el estado de la meta a inactivo
  changeMetaStatus(meta: Meta): void {
    const updatedMeta = { ...meta, status: 'I' };
    
    this.metaService.updateMeta(updatedMeta).subscribe({
      next: () => {
        this.loadMetas();
      },
      error: (error) => {
        console.error('Error al cambiar el estado de la meta:', error);
      },
    });
  }

  formatDate(date: string | null): string {
    const formattedDate = this.datePipe.transform(date, 'dd-MMM-yyyy');
    return formattedDate || 'Sin fecha';
  }

  // Eliminar una meta (cambiar estado a inactivo)
  deleteMeta(meta: Meta): void {
    meta.status = 'I';  // Cambiar el estado a inactivo
    this.metaService.updateMeta(meta).subscribe(() => this.loadMetas());
  }

  // Restaurar una meta (cambiar estado a activo)
  restoreMeta(meta: Meta): void {
    if (meta.status === 'I') {
      meta.status = 'A';  // Cambiar el estado de inactiva a activa
      this.metaService.updateMeta(meta).subscribe(() => {
        this.loadMetas();  // Recargar metas para actualizar la lista
      });
    }
  }
}
