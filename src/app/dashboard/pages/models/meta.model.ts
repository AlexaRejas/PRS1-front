import { Section } from "./section.model";

// meta.model.ts
export interface Meta {
  idMeta: number;
  initializationDate: string;  // Asegúrate de que la fecha esté en el formato correcto
  name: string;
  description: string;
  objective: string;
  time: string;  // Fecha también
  status: string;  // 'A' o 'I'
  section: Section;  // Relación con Section
  sectionDescription?: string; // Añade esta línea

  
}

