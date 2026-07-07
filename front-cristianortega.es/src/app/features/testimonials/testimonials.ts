import { Component } from '@angular/core';

import { RevealDirective } from '../../shared/directives/reveal.directive';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [RevealDirective],
  templateUrl: './testimonials.html',
})
export class Testimonials {
  protected readonly testimonials: Testimonial[] = [
    {
      quote:
        'Desde que Cristian nos rehízo la página, la imagen digital de la sala ha dado un salto increíble. La galería de fotos ahora carga súper rápido en los móviles, y automatizar el sistema de reservas nos ha quitado muchísimos dolores de cabeza los fines de semana. Un trabajo de 10, muy profesional y siempre atento para resolver cualquier duda al momento.',
      author: 'Sala Koala Fuenlabrada',
      role: 'Negocio local',
    },
    {
      quote:
        'Manejar toda la liga de fútbol antes era un caos. Con la plataforma a medida que nos ha desarrollado, ahora tenemos todo centralizado en un mismo panel. Es súper intuitiva, funciona rapidísimo y nos ahorra horas de gestión administrativa cada jornada. Se nota que domina la programación a medida para proyectos complejos.',
      author: 'Derby',
      role: 'Gestión deportiva',
    },
    {
      quote:
        'Cristian captó al instante la idea estética que buscábamos para nuestro gran día. El diseño de la página es precioso, pero lo que nos ha salvado la vida ha sido el sistema de invitaciones. Que la gente confirme su asistencia desde el móvil y se nos organice todo automáticamente en un Excel es una maravilla. Nos está quitando muchísimo estrés con los preparativos.',
      author: 'Cliente de boda',
      role: 'Espacios digitales',
    },
  ];
}
