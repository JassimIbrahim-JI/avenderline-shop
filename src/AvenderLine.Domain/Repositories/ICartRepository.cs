using AvenderLine.Domain.Entities;

namespace AvenderLine.Domain.Repositories;

/// <summary>Cart-specific queries for a given customer.</summary>
public interface ICartRepository : IRepository<Cart>
{
    Task<Cart?> GetByCustomerIdAsync(Guid customerId, CancellationToken ct = default);
}
