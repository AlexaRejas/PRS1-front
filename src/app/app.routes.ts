import { Routes } from '@angular/router';  
import { provideHttpClient, withFetch } from '@angular/common/http';  // Importa withFetch
provideHttpClient(withFetch())  // Agrega withFetch() aquí


export const routes: Routes = [
  
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'dashboard-nph',
        title: 'Dashboard',
        loadComponent: () => import('./dashboard/pages/dashboard/dashboard.component'),
      },
      {
        path: 'asistencias',
        title: 'Asistencias',
        loadComponent: () => import('./dashboard/pages/asistencias/asistencias.component').then(m => m.AsistenciasComponent),
      },
      {
        path: 'reportes',
        title: 'Reportes',
        loadComponent: () => import('./dashboard/pages/reportes/reportes.component').then(m => m.ReportesComponent),
      },
      {
        path: 'personas',
        title: 'Personas',
        loadComponent: () => import('./dashboard/pages/personas/personas.component').then(m => m.PersonasComponent),
      },
      {
        path: 'familia',
        title: 'Familia',
        loadComponent: () => import('./dashboard/pages/familia/familia.component').then(m => m.FamiliaComponent),
      },
      {
        path: 'section',
        title: 'Section',
        loadComponent: () => import('./dashboard/pages/section/section.component').then(m => m.SectionComponent),
      },
      {
        path: 'meta',
        title: 'Meta',
        loadComponent: () => import('./dashboard/pages/meta/meta.component').then(m => m.MetaComponent),
      },
      {
        path: '', 
        redirectTo: 'dashboard-nph', 
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
