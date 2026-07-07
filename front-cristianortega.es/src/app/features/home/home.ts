import { Component } from '@angular/core';

import { Hero } from '../hero/hero';
import { TrustMarquee } from '../trust-marquee/trust-marquee';
import { ProblemAgitate } from '../problem-agitate/problem-agitate';
import { Services } from '../services/services';
import { Process } from '../process/process';
import { TechStack } from '../tech-stack/tech-stack';
import { Comparison } from '../comparison/comparison';
import { Testimonials } from '../testimonials/testimonials';
import { PortfolioGrid } from '../portfolio-grid/portfolio-grid';
import { InteractivePricing } from '../interactive-pricing/interactive-pricing';
import { Faq } from '../faq/faq';
import { FinalCta } from '../final-cta/final-cta';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    Hero,
    TrustMarquee,
    ProblemAgitate,
    Services,
    Process,
    TechStack,
    Comparison,
    Testimonials,
    PortfolioGrid,
    InteractivePricing,
    Faq,
    FinalCta,
    Footer,
  ],
  templateUrl: './home.html',
})
export class Home {}
