using AvenderLine.Domain.Common;

namespace AvenderLine.Domain.Entities;

/// <summary>Shipping address value object used on an order.</summary>
public class ShippingAddress : ValueObject
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string? Country { get; set; }
    public string? PostalCode { get; set; }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return FullName;
        yield return Phone;
        yield return AddressLine1;
        yield return AddressLine2;
        yield return City;
        yield return Country;
        yield return PostalCode;
    }
}
