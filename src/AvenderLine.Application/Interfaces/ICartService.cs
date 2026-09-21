using AvenderLine.Application.DTOs;
using AvenderLine.Application.Interfaces;

namespace AvenderLine.Application.Interfaces;

/// <summary>Shopping cart operations for a customer.</summary>
public interface ICartService
{
    Task<CartDto> GetCartAsync(Guid customerId, CancellationToken ct = default);
    Task<CartDto> AddItemAsync(Guid customerId, AddCartItemDto item, CancellationToken ct = default);
    Task<CartDto> RemoveItemAsync(Guid customerId, Guid productId, Guid? variantId, CancellationToken ct = default);
    Task ClearAsync(Guid customerId, CancellationToken ct = default);
}

/// <summary>Order placement and retrieval.</summary>
public interface IOrderService
{
    Task<OrderDto> CheckoutAsync(Guid customerId, CheckoutRequest request, CancellationToken ct = default);
    Task<OrderDto?> GetByOrderNumberAsync(string orderNumber, CancellationToken ct = default);
    Task<IReadOnlyList<OrderDto>> GetByCustomerAsync(Guid customerId, CancellationToken ct = default);
    Task<IReadOnlyList<OrderDto>> GetAllOrdersAsync(CancellationToken ct = default);
    Task<OrderDto?> UpdateStatusAsync(Guid orderId, string status, string? note = null, CancellationToken ct = default);
}
