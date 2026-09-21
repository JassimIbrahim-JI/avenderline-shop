using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;
using AvenderLine.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AvenderLine.Infrastructure.Repositories;

/// <summary>Store settings repository (single global record).</summary>
public class StoreSettingsRepository : Repository<StoreSettings>, IStoreSettingsRepository
{
    public StoreSettingsRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<StoreSettings?> GetCurrentAsync(CancellationToken ct = default)
        => await DbSet.OrderBy(s => s.CreatedAt).FirstOrDefaultAsync(ct);
}
