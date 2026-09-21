using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;
using AvenderLine.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AvenderLine.Infrastructure.Repositories;

/// <summary>Product repository with search/filter/pagination.</summary>
public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

    private IQueryable<Product> BaseQuery()
        => DbSet
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .AsNoTracking();

    private IQueryable<Product> ApplyFilters(
        IQueryable<Product> query,
        string? q, Guid? categoryId, decimal? minPrice, decimal? maxPrice,
        bool? isFeatured, bool? isAvailable)
    {
        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim();
            query = query.Where(p =>
                p.Name.Contains(term) ||
                (p.Description != null && p.Description.Contains(term)));
        }

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);

        if (isFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == isFeatured.Value);

        if (isAvailable.HasValue)
            query = query.Where(p => p.IsAvailable == isAvailable.Value);

        return query;
    }

    public async Task<IReadOnlyList<Product>> SearchAsync(
        string? query, Guid? categoryId, decimal? minPrice, decimal? maxPrice,
        bool? isFeatured, bool? isAvailable, string sortBy,
        int page, int pageSize, CancellationToken ct = default)
    {
        var q = ApplyFilters(BaseQuery(), query, categoryId, minPrice, maxPrice, isFeatured, isAvailable);

        q = sortBy switch
        {
            "price_asc" => q.OrderBy(p => p.Price),
            "price_desc" => q.OrderByDescending(p => p.Price),
            "newest" => q.OrderByDescending(p => p.CreatedAt),
            "featured" => q.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAt),
            _ => q.OrderBy(p => p.SortOrder).ThenByDescending(p => p.CreatedAt)
        };

        return await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    public async Task<int> CountSearchAsync(
        string? query, Guid? categoryId, decimal? minPrice, decimal? maxPrice,
        bool? isFeatured, bool? isAvailable, CancellationToken ct = default)
    {
        var q = ApplyFilters(DbSet.AsNoTracking(), query, categoryId, minPrice, maxPrice, isFeatured, isAvailable);
        return await q.CountAsync(ct);
    }

    public async Task<Product?> GetBySlugAsync(string slug, CancellationToken ct = default)
        => await BaseQuery().FirstOrDefaultAsync(p => p.Slug == slug, ct);
}
