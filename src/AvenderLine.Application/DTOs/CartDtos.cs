namespace AvenderLine.Application.DTOs;

public class CartItemDto
{
    public Guid ProductId { get; set; }
    public Guid? VariantId { get; set; }
    public int Quantity { get; set; }
    public string? ProductName { get; set; }
    public decimal UnitPrice { get; set; }
    public string? ImageUrl { get; set; }
    public decimal LineTotal { get; set; }
}

public class CartDto
{
    public Guid CartId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal Subtotal { get; set; }
    public int TotalItems { get; set; }
}

public class AddCartItemDto
{
    public Guid ProductId { get; set; }
    public Guid? VariantId { get; set; }
    public int Quantity { get; set; } = 1;
}
