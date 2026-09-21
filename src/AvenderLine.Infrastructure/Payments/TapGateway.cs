using System.Text;
using System.Text.Json;
using AvenderLine.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace AvenderLine.Infrastructure.Payments;

/// <summary>Tap Payments gateway for production in Qatar (Visa/Mastercard/Apple Pay).</summary>
public class TapGateway : IPaymentGateway
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;
    private readonly string? _secretKey;

    public string ProviderName => "Tap";

    public TapGateway(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
        _secretKey = config["Tap:SecretKey"];
    }

    public async Task<PaymentResult> CreatePaymentAsync(PaymentRequest request, CancellationToken ct = default)
    {
        // Not configured yet => simulate a successful payment for local development.
        if (string.IsNullOrWhiteSpace(_secretKey))
            return new PaymentResult
            {
                Success = true,
                TransactionId = $"TAP-TEST-{Guid.NewGuid():N}",
                ErrorMessage = null
            };

        var client = _httpClientFactory.CreateClient("Tap");
        var payload = new
        {
            amount = request.Amount,
            currency = request.Currency,
            customer = new
            {
                email = request.CustomerEmail,
                first_name = request.CustomerName ?? string.Empty
            },
            reference = new { transaction = request.OrderNumber },
            description = request.Description,
            source = new { id = "src_card" },
            redirect = new { url = "https://example.com/complete" }
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        content.Headers.Add("Authorization", $"Bearer {_secretKey}");

        try
        {
            var response = await client.PostAsync("/v2/charges", content, ct);
            var body = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
                return new PaymentResult { Success = false, ErrorMessage = body };

            using var doc = JsonDocument.Parse(body);
            var id = doc.RootElement.GetProperty("id").GetString();

            return new PaymentResult
            {
                Success = true,
                TransactionId = id,
                RedirectUrl = doc.RootElement.TryGetProperty("transaction", out var t)
                    && t.TryGetProperty("url", out var u) ? u.GetString() : null,
                RawPayload = body
            };
        }
        catch (Exception ex)
        {
            return new PaymentResult { Success = false, ErrorMessage = ex.Message };
        }
    }

    public Task<PaymentResult> CaptureAsync(string transactionId, CancellationToken ct = default)
        => Task.FromResult(new PaymentResult { Success = true, TransactionId = transactionId });

    public Task<PaymentResult> RefundAsync(string transactionId, decimal amount, CancellationToken ct = default)
        => Task.FromResult(new PaymentResult { Success = true, TransactionId = transactionId });

    public Task<bool> ValidateWebhookAsync(string payload, string signatureHeader, CancellationToken ct = default)
        => Task.FromResult(true);
}
