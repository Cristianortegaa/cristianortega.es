import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { QuoteRequest, QuoteResponse } from '../models/quote-request.model';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/quotes';

  submit(request: QuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(this.endpoint, request);
  }
}
