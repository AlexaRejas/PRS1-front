import { Component, OnInit } from '@angular/core';
import { SectionService } from '../services/section.service';
import { Section } from '../models/section.model';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel

@Component({
  selector: 'app-section',
  standalone: true, // Marca este componente como standalone
  imports: [CommonModule, FormsModule], // Incluye FormsModule para ngModel
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  sections: Section[] = [];
  activeSections: Section[] = [];
  inactiveSections: Section[] = [];
  newSection: Section = {
    idSection: 0,
    name: '',
    description: '',
    updateDate: '',
    status: 'A', // Estado predeterminado: activo
  };
  isEditing = false; // Flag para diferenciar entre creación y edición
  showInactive = false; // Flag para mostrar/ocultar secciones inactivas

  constructor(private sectionService: SectionService) {}

  ngOnInit(): void {
    this.loadSections();
  }

  // Cargar todas las secciones
  loadSections(): void {
    this.sectionService.getAllSections().subscribe(
      (sections: Section[]) => {
        this.sections = sections;
        this.filterSections();
      },
      error => {
        console.error('Error al cargar las secciones:', error);
      }
    );
  }

  // Filtrar secciones activas e inactivas
  filterSections(): void {
    this.activeSections = this.sections.filter(section => section.status === 'A');
    this.inactiveSections = this.sections.filter(section => section.status === 'I');
  }

  // Abrir el modal
  openModal(): void {
    const modalElement = document.getElementById('sectionModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  // Crear una nueva sección
  createSection(): void {
    this.sectionService.createSection(this.newSection).subscribe(
      (createdSection: Section) => {
        this.sections.push(createdSection);
        this.filterSections();
        this.resetForm();
        this.closeModal();
      },
      error => {
        console.error('Error al crear la sección:', error);
      }
    );
  }


  // Editar una sección (preparar el formulario para edición)
  editSection(section: Section): void {
    this.isEditing = true;
    this.newSection = { ...section }; // Clonar la sección seleccionada
    this.openModal();
  }

  // Actualizar una sección
  updateSection(): void {
    this.sectionService.updateSection(this.newSection.idSection, this.newSection).subscribe(
      (updatedSection: Section) => {
        const index = this.sections.findIndex(s => s.idSection === updatedSection.idSection);
        if (index !== -1) {
          this.sections[index] = updatedSection;
          this.filterSections();
        }
        this.resetForm();
        this.closeModal();
      },
      error => {
        console.error('Error al actualizar la sección:', error);
      }
    );
  }

  // Eliminar una sección (cambiar su estado a inactivo)
  deleteSection(section: Section): void {
    section.status = 'I'; // Cambiar el estado a inactivo
    this.sectionService.updateSection(section.idSection, section).subscribe(
      () => {
        // Mover la sección a la lista de inactivos
        this.filterSections(); // Filtrar las secciones nuevamente para que se actualicen las listas
      },
      error => {
        console.error('Error al eliminar la sección:', error);
      }
    );
  }

  // Restaurar una sección
  restoreSection(section: Section): void {
    section.status = 'A'; // Cambiar el estado a "activo"
    this.sectionService.updateSection(section.idSection, section).subscribe(
      () => {
        this.filterSections(); // Actualizar la lista de secciones
      },
      error => {
        console.error('Error al restaurar la sección:', error);
      }
    );
  }

  // Resetear el formulario
  resetForm(): void {
    this.isEditing = false;
    this.newSection = {
      idSection: 0,
      name: '',
      description: '',
      updateDate: '',
      status: 'A', // Restablecer a estado activo
    };
  }

  // Cerrar el modal
  closeModal(): void {
    const modalElement = document.getElementById('sectionModal');
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.hide();
    }
  }

  // Mostrar u ocultar secciones inactivas
  toggleInactiveSections(): void {
    this.showInactive = !this.showInactive;
  }

  createOrUpdateSection(): void {
    if (this.isEditing) {
      // Ajuste para evitar el desfase de zona horaria
      this.newSection.updateDate = this.convertDateToUTC(this.newSection.updateDate);
      this.updateSection();
    } else {
      this.newSection.updateDate = this.convertDateToUTC(this.newSection.updateDate);
      this.createSection();
    }
  }
  
  convertDateToUTC(date: string): string {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0]; // Retorna la fecha en formato 'yyyy-MM-dd'
  }
  
}
