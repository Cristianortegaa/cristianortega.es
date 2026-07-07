import { Component } from '@angular/core';

import { RevealDirective } from '../../shared/directives/reveal.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';

@Component({
  selector: 'app-final-cta',
  imports: [RevealDirective, MagneticDirective],
  templateUrl: './final-cta.html',
})
export class FinalCta {
  private readonly email = 'cibercristian2003@gmail.com';

  protected readonly gmailComposeUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=' +
    encodeURIComponent(this.email) +
    '&su=' +
    encodeURIComponent('Presupuesto para mi web') +
    '&body=' +
    encodeURIComponent('Hola Cristian,\n\nQuiero pedirte presupuesto para mi web.\n\n');
}
