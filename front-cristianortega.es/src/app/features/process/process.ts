import { Component } from '@angular/core';

import { RevealDirective } from '../../shared/directives/reveal.directive';

interface Step {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-process',
  imports: [RevealDirective],
  templateUrl: './process.html',
})
export class Process {
  protected readonly steps: Step[] = [
    {
      number: '01',
      title: 'Cuéntame tu proyecto',
      description: 'Escríbeme o llama, sin compromiso. Hablamos de lo que necesita tu negocio.',
    },
    {
      number: '02',
      title: 'Presupuesto claro en 24-48h',
      description: 'Recibes una propuesta cerrada, sin sorpresas ni letra pequeña.',
    },
    {
      number: '03',
      title: 'Diseño y desarrollo',
      description: 'Te enseño avances durante el proceso. Tú decides y ajustamos juntos.',
    },
    {
      number: '04',
      title: 'Entrega y puesta en marcha',
      description: 'Tu web lista, funcionando y publicada.',
    },
    {
      number: '05',
      title: 'Soporte',
      description: 'Sigo disponible después del lanzamiento para lo que necesites.',
    },
  ];
}
