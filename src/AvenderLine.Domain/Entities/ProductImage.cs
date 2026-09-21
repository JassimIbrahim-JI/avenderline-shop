using AvenderLine.Domain.Common;

namespace AvenderLine.Domain.Entities;

/// <summary>An image attached to a product (supports 4K / multiple sizes).</summary>
public class ProductImage : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int SortOrder { get; set; }
    public bool IsPrimary { get; set; }
}
