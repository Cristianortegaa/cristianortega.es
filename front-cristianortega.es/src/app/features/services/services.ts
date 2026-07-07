import { Component } from '@angular/core';

import { RevealDirective } from '../../shared/directives/reveal.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';

interface Service {
  title: string;
  description: string;
  icon: 'globe' | 'grid' | 'bolt';
}

@Component({
  selector: 'app-services',
  imports: [RevealDirective, TiltDirective],
  templateUrl: './services.html',
})
export class Services {
  protected readonly services: Service[] = [
    {
      title: 'Webs que venden',
      description:
        'Páginas rápidas y profesionales diseñadas para convertir visitas en clientes: reservas, llamadas o ventas.',
      icon: 'globe',
    },
    {
      title: 'Paneles y gestión a medida',
      description:
        'Si tu negocio necesita algo más que una web bonita: reservas, usuarios, paneles de administración, lo construyo a medida.',
      icon: 'grid',
    },
    {
      title: 'Automatización',
      description:
        'Recordatorios automáticos, integraciones y procesos que ahora haces a mano y podrían resolverse solos.',
      icon: 'bolt',
    },
  ];
}
