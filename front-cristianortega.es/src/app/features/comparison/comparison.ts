import { Component } from '@angular/core';

interface ComparisonRow {
  criterion: string;
  me: string;
  template: string;
  agency: string;
}

@Component({
  selector: 'app-comparison',
  imports: [],
  templateUrl: './comparison.html',
})
export class Comparison {
  protected readonly rows: ComparisonRow[] = [
    {
      criterion: 'Diseño',
      me: 'Único, hecho para tu negocio',
      template: 'Plantilla que puede tener cualquiera',
      agency: 'A veces reciclado entre clientes',
    },
    {
      criterion: 'Velocidad de carga',
      me: 'Código optimizado a medida',
      template: 'Lenta, cargada de plugins',
      agency: 'Depende del equipo asignado',
    },
    {
      criterion: 'Quién te atiende',
      me: 'Yo, directamente, siempre',
      template: 'Nadie, lo haces tú',
      agency: 'Comercial, luego equipo distinto',
    },
    {
      criterion: 'Tiempo de entrega',
      me: '2-4 semanas',
      template: 'Rápido, pero limitado',
      agency: 'Semanas o meses',
    },
    {
      criterion: 'Precio',
      me: 'Ajustado, sin sorpresas',
      template: 'Barato, pero limitado',
      agency: 'Elevado',
    },
  ];
}
