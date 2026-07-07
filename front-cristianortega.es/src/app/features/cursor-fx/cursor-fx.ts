import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

/**
 * Halo luminoso decorativo que sigue al cursor con un ligero retraso ("lerp")
 * y crece al pasar por encima de elementos interactivos. Puramente decorativo:
 * no sustituye al cursor nativo. Se desactiva en táctil y con menos movimiento.
 */
@Component({
  selector: 'app-cursor-fx',
  template: `<div #glow class="cursor-fx" aria-hidden="true"></div>`,
})
export class CursorFx implements AfterViewInit, OnDestroy {
  @ViewChild('glow', { static: true }) glowRef!: ElementRef<HTMLElement>;

  private readonly enabled =
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(pointer: fine)').matches;

  private mouseX = 0;
  private mouseY = 0;
  private curX = 0;
  private curY = 0;
  private frame?: number;
  private started = false;

  private readonly onMouseMove = (event: MouseEvent) => {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    if (!this.started) {
      this.curX = this.mouseX;
      this.curY = this.mouseY;
      this.started = true;
      this.glowRef.nativeElement.style.opacity = '0.7';
    }
  };

  private readonly onOver = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button, [appTilt], input, textarea')) {
      this.glowRef.nativeElement.classList.add('cursor-fx--active');
    }
  };

  private readonly onOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button, [appTilt], input, textarea')) {
      this.glowRef.nativeElement.classList.remove('cursor-fx--active');
    }
  };

  ngAfterViewInit(): void {
    if (!this.enabled) {
      return;
    }
    window.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseover', this.onOver, true);
    document.addEventListener('mouseout', this.onOut, true);
    this.tick();
  }

  private readonly tick = (): void => {
    this.curX += (this.mouseX - this.curX) * 0.16;
    this.curY += (this.mouseY - this.curY) * 0.16;
    this.glowRef.nativeElement.style.transform = `translate3d(${this.curX}px, ${this.curY}px, 0) translate(-50%, -50%)`;
    this.frame = requestAnimationFrame(this.tick);
  };

  ngOnDestroy(): void {
    if (!this.enabled) {
      return;
    }
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseover', this.onOver, true);
    document.removeEventListener('mouseout', this.onOut, true);
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
    }
  }
}
