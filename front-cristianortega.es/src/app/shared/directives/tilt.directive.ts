import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Inclina la tarjeta en 3D siguiendo la posición del cursor (efecto "tilt").
 * Uso: <div appTilt class="...">...</div>
 * Se desactiva automáticamente si el usuario prefiere menos movimiento.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    if (!this.reduced) {
      this.element.nativeElement.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
      this.element.nativeElement.style.willChange = 'transform';
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.reduced) {
      return;
    }
    const host = this.element.nativeElement;
    const rect = host.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 12;
    host.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.reduced) {
      return;
    }
    this.element.nativeElement.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
  }
}
