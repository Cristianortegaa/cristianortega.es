import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './features/header/header';
import { WhatsappButton } from './features/whatsapp-button/whatsapp-button';
import { ScrollProgress } from './features/scroll-progress/scroll-progress';
import { SectionNav } from './features/section-nav/section-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, WhatsappButton, ScrollProgress, SectionNav],
  templateUrl: './app.html'
})
export class App {}
