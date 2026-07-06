import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuoteRequest } from '../../core/models/quote-request.model';
import { QuoteService } from '../../core/services/quote.service';

interface PricingOption {
  id: string;
  label: string;
  description: string;
  price: number;
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-interactive-pricing',
  imports: [FormsModule],
  templateUrl: './interactive-pricing.html',
})
export class InteractivePricing {
  private readonly quoteService = inject(QuoteService);

  protected readonly options: PricingOption[] = [
    {
      id: 'web-escaparate',
      label: 'Web Escaparate',
      description: 'Sitio corporativo o landing con diseño a medida, optimizado para conversión.',
      price: 650,
    },
    {
      id: 'gestion-compleja',
      label: 'Gestión Compleja',
      description: 'Paneles de administración, lógica de negocio avanzada y base de datos.',
      price: 2200,
    },
    {
      id: 'automatizacion',
      label: 'Automatización',
      description: 'Integraciones, flujos automáticos y conexión con servicios externos.',
      price: 950,
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
      next: () => this.status.set('success'),
      error: () => {
        this.errorMessage.set(
          'No se pudo enviar la solicitud. Comprueba que el servidor esté encendido e inténtalo de nuevo.'
        );
        this.status.set('error');
      },
    });
  }
}
