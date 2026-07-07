import { Component, HostListener, signal } from '@angular/core';

import { RevealDirective } from '../../shared/directives/reveal.directive';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';

@Component({
  selector: 'app-hero',
  imports: [RevealDirective, CountUpDirective, MagneticDirective],
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly spotlightX = signal(50);
  protected readonly spotlightY = signal(35);
  protected readonly parallaxOffset = signal(0);

  protected onSpotlightMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.spotlightX.set(((event.clientX - rect.left) / rect.width) * 100);
    this.spotlightY.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.parallaxOffset.set(Math.min(window.scrollY, 500) * 0.15);
  }
}
