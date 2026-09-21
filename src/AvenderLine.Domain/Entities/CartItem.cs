using AvenderLine.Domain.Common;

namespace AvenderLine.Domain.Entities;

/// <summary>A single line in a shopping cart.</summary>
public class CartItem : BaseEntity
{
    public Guid CartId { get; set; }
    public Cart? Cart { get; set; }

    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public Guid? VariantId { get; set; }
    public ProductVariant? Variant { get; set; }

    public int Quantity { get; set; } = 1;
}
