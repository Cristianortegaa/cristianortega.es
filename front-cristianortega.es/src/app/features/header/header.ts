import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';

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
export class Header implements AfterViewInit, OnDestroy {
  protected readonly links: NavLink[] = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Cómo trabajo', href: '#proceso' },
    { label: 'Casos de éxito', href: '#portfolio' },
    { label: 'Presupuesto', href: '#pricing' },
    { label: 'Preguntas', href: '#faq' },
  ];

  protected readonly menuOpen = signal(false);
  protected readonly activeHref = signal<string | null>(null);
  private observer?: IntersectionObserver;

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    // El resto de secciones (renderizadas por el router-outlet) puede que aún
    // no existan en el DOM justo cuando el header termina de inicializarse.
    // Esperamos un tick para asegurarnos de que ya están montadas.
    setTimeout(() => this.setupObserver(), 0);
  }

  private setupObserver(): void {
    const elements = this.links
      .map((link) => ({ link, el: document.getElementById(link.href.slice(1)) }))
      .filter((entry): entry is { link: NavLink; el: HTMLElement } => !!entry.el);

    if (elements.length === 0) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = elements.find((item) => item.el === entry.target);
            if (match) {
              this.activeHref.set(match.link.href);
            }
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    elements.forEach(({ el }) => this.observer?.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
