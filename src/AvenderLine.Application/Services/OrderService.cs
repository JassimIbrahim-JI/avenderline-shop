using AvenderLine.Application.DTOs;
using AvenderLine.Application.Interfaces;
using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;

namespace AvenderLine.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;
    private readonly IRepository<Product> _productRepository;
    private readonly IStoreSettingsRepository _settingsRepository;
    private readonly IPaymentGateway _paymentGateway;

    public OrderService(
        IOrderRepository orderRepository,
        ICartRepository cartRepository,
        IRepository<Product> productRepository,
        IStoreSettingsRepository settingsRepository,
        IPaymentGateway paymentGateway)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _settingsRepository = settingsRepository;
        _paymentGateway = paymentGateway;
    }

    public async Task<OrderDto> CheckoutAsync(Guid customerId, CheckoutRequest request, CancellationToken ct = default)
    {
        var cart = await _cartRepository.GetByCustomerIdAsync(customerId, ct)
            ?? throw new InvalidOperationException("Cart is empty.");

        if (!cart.Items.Any())
            throw new InvalidOperationException("Cart is empty.");

        var settings = await _settingsRepository.GetCurrentAsync(ct);

        decimal subtotal = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in cart.Items)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId, ct)
                ?? throw new InvalidOperationException($"Product {item.ProductId} not found.");

            if (product.StockQuantity < item.Quantity)
                throw new InvalidOperationException($"Insufficient stock for {product.Name}.");

            var unitPrice = product.Price;
            var lineTotal = unitPrice * item.Quantity;
            subtotal += lineTotal;

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Sku = product.Sku,
                VariantName = item.Variant?.Name,
                ImageUrl = product.Images.FirstOrDefault(i => i.IsPrimary)?.Url
                    ?? product.Images.FirstOrDefault()?.Url,
                UnitPrice = unitPrice,
                Quantity = item.Quantity,
                LineTotal = lineTotal
            });
        }

        var shippingCost = settings?.ShippingCost ?? 0m;
        if (settings?.FreeShippingThreshold is { } threshold && subtotal >= threshold)
            shippingCost = 0m;

        var taxRate = settings?.TaxRate ?? 0m;
        var tax = decimal.Round(subtotal * taxRate / 100m, 2);
        var total = subtotal + shippingCost + tax;

        var order = new Order
        {
            CustomerId = customerId,
            OrderNumber = GenerateOrderNumber(),
            Status = OrderStatus.Pending,
            Subtotal = subtotal,
            ShippingCost = shippingCost,
            Tax = tax,
            Total = total,
            Currency = settings?.Currency ?? "QAR",
            ShippingAddress = new ShippingAddress
            {
                FullName = request.FullName,
                Phone = request.Phone,
                AddressLine1 = request.AddressLine1,
                AddressLine2 = request.AddressLine2,
                City = request.City,
                Country = "Qatar",
                PostalCode = request.PostalCode
            },
            Items = orderItems
        };

        order.History.Add(new OrderStatusHistory
        {
            FromStatus = OrderStatus.Pending,
            ToStatus = OrderStatus.Pending,
            Note = "Order created"
        });

        await _orderRepository.AddAsync(order, ct);

        // Attempt payment (test gateway may not charge a real card).
        var payment = await _paymentGateway.CreatePaymentAsync(new PaymentRequest
        {
            Amount = total,
            Currency = order.Currency,
            OrderNumber = order.OrderNumber,
            CustomerEmail = string.Empty,
            CustomerName = request.FullName,
            Description = $"Order {order.OrderNumber}"
        }, ct);

        if (payment.Success)
        {
            order.PaymentProvider = _paymentGateway.ProviderName;
            order.PaymentTransactionId = payment.TransactionId;
            order.Status = OrderStatus.Paid;
            order.History.Add(new OrderStatusHistory
            {
                FromStatus = OrderStatus.Pending,
                ToStatus = OrderStatus.Paid,
                Note = "Payment captured"
            });
            await _orderRepository.UpdateAsync(order, ct);
        }

        cart.Clear();
        await _cartRepository.UpdateAsync(cart, ct);

        return ToDto(order);
    }

    public async Task<OrderDto?> GetByOrderNumberAsync(string orderNumber, CancellationToken ct = default)
    {
        var order = await _orderRepository.GetByOrderNumberAsync(orderNumber, ct);
        return order is null ? null : ToDto(order);
    }

    public async Task<IReadOnlyList<OrderDto>> GetByCustomerAsync(Guid customerId, CancellationToken ct = default)
    {
        var orders = await _orderRepository.GetByCustomerIdAsync(customerId, ct);
        return orders.Select(ToDto).ToList();
    }

    public async Task<IReadOnlyList<OrderDto>> GetAllOrdersAsync(CancellationToken ct = default)
    {
        var orders = await _orderRepository.ListAsync(ct);
        return orders.OrderByDescending(o => o.CreatedAt).Select(ToDto).ToList();
    }

    public async Task<OrderDto?> UpdateStatusAsync(Guid orderId, string status, string? note = null, CancellationToken ct = default)
    {
        var order = await _orderRepository.GetByIdAsync(orderId, ct);
        if (order == null) return null;

        if (Enum.TryParse<OrderStatus>(status, true, out var newStatus))
        {
            var oldStatus = order.Status;
            order.Status = newStatus;
            order.History.Add(new OrderStatusHistory
            {
                FromStatus = oldStatus,
                ToStatus = newStatus,
                Note = note ?? $"Status updated to {newStatus}"
            });
            await _orderRepository.UpdateAsync(order, ct);
        }
        return ToDto(order);
    }

    private static string GenerateOrderNumber()
        => $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";

    private static OrderDto ToDto(Order o) => new()
    {
        Id = o.Id,
        OrderNumber = o.OrderNumber,
        Status = o.Status.ToString(),
        Subtotal = o.Subtotal,
        ShippingCost = o.ShippingCost,
        Discount = o.Discount,
        Tax = o.Tax,
        Total = o.Total,
        Currency = o.Currency,
        CreatedAt = o.CreatedAt,
        Items = o.Items.Select(i => new OrderItemDto
        {
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            Sku = i.Sku,
            VariantName = i.VariantName,
            ImageUrl = i.ImageUrl,
            UnitPrice = i.UnitPrice,
            Quantity = i.Quantity,
            LineTotal = i.LineTotal
        }).ToList()
    };
}
