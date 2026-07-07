import { Component } from '@angular/core';

import { RevealDirective } from '../../shared/directives/reveal.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';

interface Project {
  title: string;
  description: string;
  image?: string;
  tag: string;
  imageFit?: 'cover' | 'contain';
  illustration?: boolean;
}

@Component({
  selector: 'app-portfolio-grid',
  imports: [RevealDirective, TiltDirective],
  templateUrl: './portfolio-grid.html',
})
export class PortfolioGrid {
  protected readonly projects: Project[] = [
    {
      title: 'Sala Koala Fuenlabrada',
      description:
        'Digitalización de negocio local. Optimización web, interfaz estética y captación de reservas.',
      image: '/logo-salakoala-fiestas-infantiles-fuenlabrada-marron.png',
      tag: 'Web & Reservas',
      imageFit: 'contain',
    },
    {
      title: 'Derby',
      description:
        'Plataforma centralizada de gestión deportiva. Lógica compleja, panel de administración y bases de datos.',
      image: '/logo.png',
      tag: 'Plataforma de Gestión',
      imageFit: 'contain',
    },
    {
      title: 'Eventos y Automatización',
      description:
        'Espacios digitales para bodas con sistemas de invitaciones integrados en tiempo real.',
      tag: 'Automatización',
      illustration: true,
    },
  ];
}
