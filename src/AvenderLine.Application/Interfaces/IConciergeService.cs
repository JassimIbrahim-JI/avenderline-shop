namespace AvenderLine.Application.Interfaces;

public class CustomerOrderSummary
{
    public string OrderNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string Currency { get; set; } = "QAR";
    public DateTime CreatedAt { get; set; }
    public string Destination { get; set; } = string.Empty;
    public List<string> Items { get; set; } = new();
}

public class CustomerContext
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
    public string? FavoriteStyle { get; set; }
    public string? PreferredSize { get; set; }
    public List<CustomerOrderSummary> Orders { get; set; } = new();
}

/// <summary>Request for the AI styling assistant.</summary>
public class ConciergeRequest
{
    public string Message { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public CustomerContext? CustomerContext { get; set; }
}

/// <summary>Response from the AI styling assistant.</summary>
public class ConciergeResponse
{
    public string Reply { get; set; } = string.Empty;
    public IReadOnlyList<object>? SuggestedProducts { get; set; }
    public IReadOnlyList<string>? Actions { get; set; }
}

/// <summary>AI assistant that answers styling queries and can act on real data.</summary>
public interface IConciergeService
{
    Task<ConciergeResponse> AskAsync(ConciergeRequest request, CancellationToken ct = default);
}
