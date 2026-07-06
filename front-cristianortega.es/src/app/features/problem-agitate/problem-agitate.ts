import { Component } from '@angular/core';

interface PainPoint {
  text: string;
}

@Component({
  selector: 'app-problem-agitate',
  imports: [],
  templateUrl: './problem-agitate.html',
})
export class ProblemAgitate {
  protected readonly painPoints: PainPoint[] = [
    { text: 'Tu web actual parece de hace 10 años y no transmite confianza.' },
    { text: 'Apareces en la página 5 de Google, invisible para tus clientes.' },
    { text: 'Cada cambio pequeño depende de alguien que tarda semanas en contestar.' },
    { text: 'Pierdes reservas y contactos porque tu web no está pensada para vender.' },
  ];
}
