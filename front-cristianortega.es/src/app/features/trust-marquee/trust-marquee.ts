import { Component } from '@angular/core';

@Component({
  selector: 'app-trust-marquee',
  templateUrl: './trust-marquee.html',
})
export class TrustMarquee {
  protected readonly items = [
    'Angular + .NET a medida',
    '+10 proyectos entregados',
    'Respuesta en 24-48h',
    'Sin permanencia',
    'Trato directo, sin intermediarios',
    '3 testimonios reales verificados',
  ];
}
