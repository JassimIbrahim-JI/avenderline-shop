using AvenderLine.Domain.Common;

namespace AvenderLine.Domain.Entities;

/// <summary>Represents a customer's shopping cart.</summary>
public class Cart : BaseEntity
{
    public Guid CustomerId { get; set; }
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();

    public void AddItem(Guid productId, Guid? variantId, int quantity)
    {
        var existing = Items.FirstOrDefault(i =>
            i.ProductId == productId && i.VariantId == variantId);

        if (existing is not null)
        {
            existing.Quantity += quantity;
        }
        else
        {
            Items.Add(new CartItem
            {
                CartId = Id,
                ProductId = productId,
                VariantId = variantId,
                Quantity = quantity
            });
        }
    }

    public void RemoveItem(Guid productId, Guid? variantId)
    {
        var item = Items.FirstOrDefault(i =>
            i.ProductId == productId && i.VariantId == variantId);
        if (item is not null)
            Items.Remove(item);
    }

    public void Clear() => Items.Clear();
}
