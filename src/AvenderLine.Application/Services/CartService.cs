using AvenderLine.Application.DTOs;
using AvenderLine.Application.Interfaces;
using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;

namespace AvenderLine.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IRepository<Product> _productRepository;

    public CartService(ICartRepository cartRepository, IRepository<Product> productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    public async Task<CartDto> GetCartAsync(Guid customerId, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartAsync(customerId, ct);
        return await ToDtoAsync(cart, ct);
    }

    public async Task<CartDto> AddItemAsync(Guid customerId, AddCartItemDto item, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartAsync(customerId, ct);
        cart.AddItem(item.ProductId, item.VariantId, Math.Max(1, item.Quantity));
        await _cartRepository.UpdateAsync(cart, ct);
        return await ToDtoAsync(cart, ct);
    }

    public async Task<CartDto> RemoveItemAsync(Guid customerId, Guid productId, Guid? variantId, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartAsync(customerId, ct);
        cart.RemoveItem(productId, variantId);
        await _cartRepository.UpdateAsync(cart, ct);
        return await ToDtoAsync(cart, ct);
    }

    public async Task ClearAsync(Guid customerId, CancellationToken ct = default)
    {
        var cart = await _cartRepository.GetByCustomerIdAsync(customerId, ct);
        if (cart is not null)
        {
            cart.Clear();
            await _cartRepository.UpdateAsync(cart, ct);
        }
    }

    private async Task<Cart> GetOrCreateCartAsync(Guid customerId, CancellationToken ct)
    {
        var cart = await _cartRepository.GetByCustomerIdAsync(customerId, ct);
        if (cart is not null)
            return cart;

        cart = new Cart { CustomerId = customerId };
        return await _cartRepository.AddAsync(cart, ct);
    }

    private async Task<CartDto> ToDtoAsync(Cart cart, CancellationToken ct)
    {
        decimal subtotal = 0;
        var items = new List<CartItemDto>();

        foreach (var item in cart.Items)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId, ct);
            if (product is null) continue;

            var unitPrice = product.Price;
            var lineTotal = unitPrice * item.Quantity;
            subtotal += lineTotal;

            items.Add(new CartItemDto
            {
                ProductId = item.ProductId,
                VariantId = item.VariantId,
                Quantity = item.Quantity,
                ProductName = product.Name,
                UnitPrice = unitPrice,
                ImageUrl = product.Images.FirstOrDefault(i => i.IsPrimary)?.Url
                    ?? product.Images.FirstOrDefault()?.Url,
                LineTotal = lineTotal
            });
        }

        return new CartDto
        {
            CartId = cart.Id,
            Items = items,
            Subtotal = subtotal,
            TotalItems = items.Sum(i => i.Quantity)
        };
    }
}
