import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Anima un número de 0 hasta el valor indicado cuando el elemento entra en el
 * viewport. Uso: <span appCountUp="10">0</span>
 * Opcional: [countSuffix]="'+'" [countDuration]="1200"
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private frame?: number;

  readonly appCountUp = input.required<number | string>();
  readonly countSuffix = input('');
  readonly countDuration = input(1400);

  ngOnInit(): void {
    const host = this.element.nativeElement;
    const target = Number(this.appCountUp());

    if (!Number.isFinite(target) || typeof IntersectionObserver === 'undefined') {
      host.textContent = `${this.appCountUp()}${this.countSuffix()}`;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.animate(target);
            this.observer?.unobserve(host);
          }
        }
      },
      { threshold: 0.4 }
    );

    this.observer.observe(host);
  }

  private animate(target: number): void {
    const host = this.element.nativeElement;
    const suffix = this.countSuffix();
    const duration = this.countDuration();
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      host.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) {
        this.frame = requestAnimationFrame(step);
      }
    };

    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
    }
  }
}
