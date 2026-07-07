import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';

interface NavDot {
  id: string;
  label: string;
}

@Component({
  selector: 'app-section-nav',
  templateUrl: './section-nav.html',
})
export class SectionNav implements AfterViewInit, OnDestroy {
  protected readonly dots: NavDot[] = [
    { id: 'top', label: 'Inicio' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'proceso', label: 'Cómo trabajo' },
    { id: 'portfolio', label: 'Casos de éxito' },
    { id: 'pricing', label: 'Presupuesto' },
    { id: 'faq', label: 'Preguntas' },
  ];

  protected readonly active = signal('top');
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const elements = this.dots
      .map((dot) => document.getElementById(dot.id))
      .filter((el): el is HTMLElement => !!el);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.active.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    elements.forEach((el) => this.observer?.observe(el));
  }

  protected dotClasses(id: string): string {
    const base = 'block rounded-full border-2 transition-all duration-300';
    return this.active() === id
      ? `${base} h-3.5 w-3.5 border-accent bg-accent`
      : `${base} h-2.5 w-2.5 border-slate-300 bg-white group-hover:border-accent/60`;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
