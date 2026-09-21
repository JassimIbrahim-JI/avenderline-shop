using AvenderLine.Domain.Entities;

namespace AvenderLine.Domain.Repositories;

/// <summary>Order-specific queries.</summary>
public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken ct = default);
    Task<IReadOnlyList<Order>> GetByCustomerIdAsync(Guid customerId, CancellationToken ct = default);
}
