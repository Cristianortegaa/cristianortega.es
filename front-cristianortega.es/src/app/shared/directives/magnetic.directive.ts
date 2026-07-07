import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Hace que el elemento (normalmente un botón) "persiga" ligeramente al cursor.
 * Uso: <a appMagnetic class="...">...</a>
 * Se desactiva automáticamente si el usuario prefiere menos movimiento.
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    if (!this.reduced) {
      this.element.nativeElement.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.reduced) {
      return;
    }
    const host = this.element.nativeElement;
    const rect = host.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.3;
    host.style.transform = `translate(${x}px, ${y}px)`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.reduced) {
      return;
    }
    this.element.nativeElement.style.transform = 'translate(0, 0)';
  }
}
