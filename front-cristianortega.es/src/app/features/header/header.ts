import { Component, signal } from '@angular/core';

import { MagneticDirective } from '../../shared/directives/magnetic.directive';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  imports: [MagneticDirective],
  templateUrl: './header.html',
})
export class Header {
  protected readonly links: NavLink[] = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Cómo trabajo', href: '#proceso' },
    { label: 'Casos de éxito', href: '#portfolio' },
    { label: 'Presupuesto', href: '#pricing' },
    { label: 'Preguntas', href: '#faq' },
  ];

  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
