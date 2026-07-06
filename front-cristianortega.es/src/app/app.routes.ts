import { Routes } from '@angular/router';

import { Home } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Cristian Ortega — Desarrollo Web & Software a Medida',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
