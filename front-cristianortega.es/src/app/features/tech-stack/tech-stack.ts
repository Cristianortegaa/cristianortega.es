import { Component } from '@angular/core';

interface Pillar {
  title: string;
  description: string;
  icon: 'bolt' | 'shield' | 'layers';
}

@Component({
  selector: 'app-tech-stack',
  imports: [],
  templateUrl: './tech-stack.html',
})
export class TechStack {
  protected readonly pillars: Pillar[] = [
    {
      title: 'Trato directo',
      description:
        'Hablas conmigo, no con un comercial ni con un ticket de soporte. Yo diseño, desarrollo y respondo tus dudas.',
      icon: 'shield',
    },
    {
      title: 'Tecnología seria',
      description:
        'Trabajo con Angular y .NET, la misma base que usan bancos y grandes empresas: tu web carga rápido, funciona bien y aguanta el crecimiento de tu negocio.',
      icon: 'bolt',
    },
    {
      title: 'Compromiso con los plazos',
      description:
        'Sé lo que cuesta esperar sin noticias. Cumplo lo que prometo y te mantengo informado en cada fase.',
      icon: 'layers',
    },
  ];
}
