using AvenderLine.Domain.Entities;

namespace AvenderLine.Domain.Repositories;

/// <summary>Product-specific queries (search, filter, pagination).</summary>
public interface IProductRepository : IRepository<Product>
{
    Task<IReadOnlyList<Product>> SearchAsync(
        string? query,
        Guid? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        bool? isFeatured,
        bool? isAvailable,
        string sortBy,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<int> CountSearchAsync(
        string? query,
        Guid? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        bool? isFeatured,
        bool? isAvailable,
        CancellationToken ct = default);

    Task<Product?> GetBySlugAsync(string slug, CancellationToken ct = default);
}
