using AvenderLine.Application.DTOs;

namespace AvenderLine.Application.Interfaces;

/// <summary>Catalog service contract (products & categories).</summary>
public interface ICatalogService
{
    Task<ProductListDto> SearchAsync(
        string? query,
        Guid? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        bool? isFeatured,
        bool? isAvailable,
        string? sortBy,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProductDto?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default);

    Task<ProductDto> CreateProductAsync(CreateProductDto dto, CancellationToken ct = default);
    Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductDto dto, CancellationToken ct = default);
    Task<bool> DeleteProductAsync(Guid id, CancellationToken ct = default);
}
