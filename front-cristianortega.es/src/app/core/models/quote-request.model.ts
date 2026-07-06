export interface QuoteRequest {
  services: string[];
  estimatedPrice: number;
  name: string;
  email: string;
  message?: string;
  /** Campo trampa (honeypot) para bots. Debe llegar siempre vacío. */
  website?: string;
}

export interface QuoteResponse {
  id: string;
  received: boolean;
}
