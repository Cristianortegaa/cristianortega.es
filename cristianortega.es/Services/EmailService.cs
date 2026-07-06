using cristianortega.es.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace cristianortega.es.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendQuoteNotificationAsync(QuoteRequest request, CancellationToken cancellationToken = default)
    {
        // Nada de lo que pase aquí dentro debe poder tumbar la petición del cliente:
        // la solicitud de presupuesto ya se ha registrado igualmente si el email falla.
        try
        {
            var host = _configuration["Smtp:Host"];
            var port = _configuration.GetValue<int>("Smtp:Port");
            var username = _configuration["Smtp:Username"];
            var password = _configuration["Smtp:Password"];
            var fromEmail = _configuration["Smtp:FromEmail"];
            var fromName = _configuration["Smtp:FromName"] ?? "Web";
            var toEmail = _configuration["Smtp:ToEmail"];

            if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(fromEmail) ||
                string.IsNullOrWhiteSpace(toEmail))
            {
                _logger.LogWarning(
                    "Configuración de SMTP incompleta: no se ha enviado el email de notificación de la solicitud de {Email}.",
                    request.Email);
                return;
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(new MailboxAddress("Cristian Ortega", toEmail));

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                message.ReplyTo.Add(new MailboxAddress(request.Name, request.Email));
            }

            message.Subject = $"Nueva solicitud de presupuesto - {request.Name}";

            var servicesText = request.Services.Count > 0 ? string.Join(", ", request.Services) : "(sin especificar)";
            var messageText = string.IsNullOrWhiteSpace(request.Message) ? "(sin mensaje)" : request.Message;

            message.Body = new TextPart("plain")
            {
                Text = $"""
                    Has recibido una nueva solicitud de presupuesto desde la web.

                    Nombre: {request.Name}
                    Email: {request.Email}
                    Servicios seleccionados: {servicesText}
                    Presupuesto estimado: {request.EstimatedPrice:C}

                    Mensaje:
                    {messageText}
                    """
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls, cancellationToken);
            await client.AuthenticateAsync(username, password, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Email de notificación enviado para la solicitud de {Email}.", request.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar el email de notificación de la solicitud de {Email}.", request.Email);
        }
    }
}
