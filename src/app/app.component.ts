import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MetaComponent } from './dashboard/pages/meta/meta.component';
import { SectionComponent } from './dashboard/pages/section/section.component';
import localeEs from '@angular/common/locales/es';  // Importar datos de localización en español
import { DatePipe } from '@angular/common'; // Asegúrate de importar DatePipe



// Registrar los datos de localización española
registerLocaleData(localeEs, 'es-ES');

@Component({
  selector: 'app-root',
  standalone: true,  // Hace que este componente sea independiente
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nphDashboard';
}
