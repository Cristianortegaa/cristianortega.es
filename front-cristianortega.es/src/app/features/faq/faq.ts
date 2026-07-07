import { Component, signal } from '@angular/core';

import { RevealDirective } from '../../shared/directives/reveal.directive';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  imports: [RevealDirective],
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly items: FaqItem[] = [
    {
      question: '¿Cuánto tarda en estar lista mi web?',
      answer: 'Depende del alcance, pero la mayoría de proyectos están listos en 2-4 semanas.',
    },
    {
      question: '¿El precio incluye el hosting y el dominio?',
      answer: 'Te asesoro y puedo gestionar ambos si lo necesitas; te explico las opciones sin líos técnicos.',
    },
    {
      question: '¿Podré editar la web yo mismo después?',
      answer: 'Sí, si quieres te dejo un panel sencillo para que gestiones el contenido sin tocar código.',
    },
    {
      question: '¿Qué pasa si no me gusta el diseño?',
      answer: 'Revisamos juntos hasta que estés conforme antes de dar nada por cerrado.',
    },
    {
      question: '¿Das soporte después de entregar la web?',
      answer: 'Sí, sigo disponible para resolver dudas e incidencias después del lanzamiento.',
    },
  ];

  protected readonly openIndex = signal<number | null>(0);

  protected toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }

  protected isOpen(index: number): boolean {
    return this.openIndex() === index;
  }
}
