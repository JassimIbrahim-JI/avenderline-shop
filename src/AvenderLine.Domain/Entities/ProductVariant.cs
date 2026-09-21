using AvenderLine.Domain.Common;

namespace AvenderLine.Domain.Entities;

/// <summary>A product variant (e.g. size S/M/L, color).</summary>
public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal? PriceAdjustment { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; } = true;
}
