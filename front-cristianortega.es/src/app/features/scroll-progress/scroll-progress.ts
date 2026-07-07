import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  template: `
    <div class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
      <div
        class="h-full origin-left bg-gradient-to-r from-accent via-accent-emerald to-accent shadow-[0_0_12px_rgba(37,99,235,0.6)] transition-transform duration-150 ease-out"
        [style.transform]="'scaleX(' + progress() + ')'"
      ></div>
    </div>
  `,
})
export class ScrollProgress {
  protected readonly progress = signal(0);

  @HostListener('window:scroll')
  onScroll(): void {
    this.update();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.update();
  }

  private update(): void {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;
    this.progress.set(Math.min(Math.max(ratio, 0), 1));
  }
}
