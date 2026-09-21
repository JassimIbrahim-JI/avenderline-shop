using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;
using AvenderLine.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AvenderLine.Infrastructure.Repositories;

/// <summary>Category repository.</summary>
public class CategoryRepository : Repository<Category>
{
    public CategoryRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyList<Category>> ListActiveAsync(CancellationToken ct = default)
        => await DbSet
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ToListAsync(ct);
}
