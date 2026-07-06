import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './features/header/header';
import { WhatsappButton } from './features/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, WhatsappButton],
  templateUrl: './app.html'
})
export class App {}
