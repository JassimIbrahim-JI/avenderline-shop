namespace AvenderLine.Application.Interfaces;

/// <summary>Represents the result of creating a payment intent/charge.</summary>
public class PaymentResult
{
    public bool Success { get; set; }
    public string? TransactionId { get; set; }
    public string? RedirectUrl { get; set; }
    public string? ErrorMessage { get; set; }
    public string? RawPayload { get; set; }
}

/// <summary>Request to create a payment.</summary>
public class PaymentRequest
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "QAR";
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public string? Description { get; set; }
}

/// <summary>Abstraction over payment gateways (Tap Payments for Qatar, etc.).</summary>
public interface IPaymentGateway
{
    string ProviderName { get; }
    Task<PaymentResult> CreatePaymentAsync(PaymentRequest request, CancellationToken ct = default);
    Task<PaymentResult> CaptureAsync(string transactionId, CancellationToken ct = default);
    Task<PaymentResult> RefundAsync(string transactionId, decimal amount, CancellationToken ct = default);
    Task<bool> ValidateWebhookAsync(string payload, string signatureHeader, CancellationToken ct = default);
}
