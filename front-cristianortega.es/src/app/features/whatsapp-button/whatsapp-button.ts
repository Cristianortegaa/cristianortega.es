import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  imports: [],
  templateUrl: './whatsapp-button.html',
})
export class WhatsappButton {
  protected readonly contactHref = 'https://wa.me/34601194566?text=Hola%2C%20quiero%20pedir%20un%20presupuesto';
}
