namespace cristianortega.es.Models;

public class QuoteRequest
{
    public List<string> Services { get; set; } = [];
    public decimal EstimatedPrice { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Message { get; set; }

    /// <summary>
    /// Campo trampa (honeypot) para bots: en el frontend está oculto para personas.
    /// Si llega relleno, se descarta la solicitud como spam.
    /// </summary>
    public string? Website { get; set; }
}
