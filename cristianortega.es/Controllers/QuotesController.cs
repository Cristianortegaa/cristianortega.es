using cristianortega.es.Models;
using cristianortega.es.Services;
using Microsoft.AspNetCore.Mvc;

namespace cristianortega.es.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuotesController : ControllerBase
{
    private readonly ILogger<QuotesController> _logger;
    private readonly IEmailService _emailService;

    public QuotesController(ILogger<QuotesController> logger, IEmailService emailService)
    {
        _logger = logger;
        _emailService = emailService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] QuoteRequest request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Website))
        {
            // Honeypot relleno: casi seguro es un bot. Respondemos "éxito" para no
            // darle pistas, pero no procesamos ni enviamos email de la solicitud.
            _logger.LogWarning("Solicitud descartada por honeypot relleno (posible bot). Email: {Email}", request.Email);
            return Ok(new { id = Guid.NewGuid().ToString(), received = true });
        }

        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { message = "Nombre y email son obligatorios." });
        }

        _logger.LogInformation(
            "Nueva solicitud de presupuesto de {Name} ({Email}) - Servicios: {Services} - Estimado: {Price:C}",
            request.Name, request.Email, string.Join(", ", request.Services), request.EstimatedPrice);

        // TODO: si en el futuro quieres guardar histórico de leads, aquí es donde se persistiría en base de datos.
        await _emailService.SendQuoteNotificationAsync(request, cancellationToken);

        return Ok(new { id = Guid.NewGuid().ToString(), received = true });
    }
}
