using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;
using AvenderLine.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AvenderLine.Infrastructure.Repositories;

/// <summary>Cart repository.</summary>
public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<Cart?> GetByCustomerIdAsync(Guid customerId, CancellationToken ct = default)
        => await DbSet
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p!.Images)
            .Include(c => c.Items)
                .ThenInclude(i => i.Variant)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId, ct);
}
