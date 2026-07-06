using cristianortega.es.Models;

namespace cristianortega.es.Services;

public interface IEmailService
{
    Task SendQuoteNotificationAsync(QuoteRequest request, CancellationToken cancellationToken = default);
}
