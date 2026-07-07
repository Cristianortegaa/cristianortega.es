import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuoteRequest } from '../../core/models/quote-request.model';
import { QuoteService } from '../../core/services/quote.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';

interface PricingOption {
  id: string;
  label: string;
  description: string;
  price: number;
  icon: 'globe' | 'grid' | 'bolt';
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-interactive-pricing',
  imports: [FormsModule, RevealDirective, MagneticDirective],
  templateUrl: './interactive-pricing.html',
})
export class InteractivePricing {
  private readonly quoteService = inject(QuoteService);
  private animationFrame?: number;

  protected readonly options: PricingOption[] = [
    {
      id: 'web-escaparate',
      label: 'Web Escaparate',
      description: 'Sitio corporativo o landing con diseño a medida, optimizado para conversión.',
      price: 650,
      icon: 'globe',
    },
    {
      id: 'gestion-compleja',
      label: 'Gestión Compleja',
      description: 'Paneles de administración, lógica de negocio avanzada y base de datos.',
      price: 2200,
      icon: 'grid',
    },
    {
      id: 'automatizacion',
      label: 'Automatización',
      description: 'Integraciones, flujos automáticos y conexión con servicios externos.',
      price: 950,
      icon: 'bolt',
    },
  ];

  protected readonly selectedIds = signal<Set<string>>(new Set());
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly message = signal('');
  /** Campo trampa (honeypot): invisible para personas, los bots suelen rellenarlo. */
  protected readonly website = signal('');
  protected readonly status = signal<SubmitStatus>('idle');
  protected readonly errorMessage = signal('');

  protected readonly total = computed(() => {
    const selected = this.selectedIds();
    return this.options
      .filter((option) => selected.has(option.id))
      .reduce((sum, option) => sum + option.price, 0);
  });

  /** Valor animado (cuenta hacia arriba/abajo) que se muestra en la tarjeta de resumen. */
  protected readonly displayedTotal = signal(0);

  constructor() {
    effect(() => {
      this.animateTo(this.total());
    });
  }

  private animateTo(target: number): void {
    if (this.animationFrame !== undefined) {
      cancelAnimationFrame(this.animationFrame);
    }
    const start = this.displayedTotal();
    if (start === target) {
      return;
    }
    const startTime = performance.now();
    const duration = 400;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayedTotal.set(Math.round(start + (target - start) * eased));
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      }
    };
    this.animationFrame = requestAnimationFrame(step);
  }

  protected toggle(id: string): void {
    const next = new Set(this.selectedIds());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.selectedIds.set(next);
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  protected cardClasses(id: string): string {
    const base = 'group flex flex-col rounded-xl border p-5 text-left transition bg-white';
    return this.isSelected(id)
      ? `${base} border-accent bg-accent/5 shadow-sm`
      : `${base} border-slate-200 hover:border-slate-300 hover:shadow-sm`;
  }

  protected indicatorClasses(id: string): string {
    const base = 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition';
    return this.isSelected(id) ? `${base} border-accent bg-accent` : `${base} border-slate-300`;
  }

  protected formatPrice(value: number): string {
    return new Intl.NumberFormat('es-ES').format(value);
  }

  protected submit(): void {
    if (this.selectedIds().size === 0 || !this.name().trim() || !this.email().trim()) {
      this.errorMessage.set('Selecciona un servicio y completa nombre y email.');
      this.status.set('error');
      return;
    }

    const request: QuoteRequest = {
      services: Array.from(this.selectedIds()),
      estimatedPrice: this.total(),
      name: this.name().trim(),
      email: this.email().trim(),
      message: this.message().trim() || undefined,
      website: this.website(),
    };

    this.status.set('sending');

    this.quoteService.submit(request).subscribe({
      next: () => {
        this.status.set('success');
        this.launchConfetti();
      },
      error: () => {
        this.errorMessage.set(
          'No se pudo enviar la solicitud. Comprueba que el servidor esté encendido e inténtalo de nuevo.'
        );
        this.status.set('error');
      },
    });
  }

  /** Pequeño confeti de celebración al enviar la solicitud con éxito. */
  private launchConfetti(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const colors = ['#2563eb', '#059669', '#f59e0b', '#ec4899', '#8b5cf6'];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.55;

    for (let i = 0; i < 28; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';

      const size = 6 + Math.random() * 6;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 0.45}px`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = `${originX}px`;
      piece.style.top = `${originY}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 140;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 60;
      const rotation = Math.random() * 720 - 360;

      piece.style.setProperty('--confetti-x', `${x}px`);
      piece.style.setProperty('--confetti-y', `${y}px`);
      piece.style.setProperty('--confetti-r', `${rotation}deg`);

      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1300);
    }
  }
}
