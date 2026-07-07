import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Añade una animación de aparición ("fade + slide up") cuando el elemento
 * entra en el viewport. Uso: <div appReveal>...</div>
 * Opcional: <div appReveal [revealDelay]="150">...</div> (ms de retraso, útil para listas).
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  readonly revealDelay = input(0);

  ngOnInit(): void {
    const host = this.element.nativeElement;
    host.setAttribute('data-reveal', '');

    if (this.revealDelay()) {
      host.style.transitionDelay = `${this.revealDelay()}ms`;
    }

    if (typeof IntersectionObserver === 'undefined') {
      host.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            host.classList.add('is-visible');
            this.observer?.unobserve(host);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
