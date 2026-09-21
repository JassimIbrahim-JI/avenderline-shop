using AvenderLine.Application.DTOs;
using AvenderLine.Application.Interfaces;
using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;

namespace AvenderLine.Application.Services;

public class CatalogService : ICatalogService
{
    private readonly IProductRepository _productRepository;
    private readonly IRepository<Category> _categoryRepository;

    public CatalogService(
        IProductRepository productRepository,
        IRepository<Category> categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<ProductListDto> SearchAsync(
        string? query, Guid? categoryId, decimal? minPrice, decimal? maxPrice,
        bool? isFeatured, bool? isAvailable, string? sortBy,
        int page, int pageSize, CancellationToken ct = default)
    {
        var sort = NormalizeSort(sortBy);
        var items = await _productRepository.SearchAsync(
            query, categoryId, minPrice, maxPrice, isFeatured, isAvailable,
            sort, page, pageSize, ct);

        var total = await _productRepository.CountSearchAsync(
            query, categoryId, minPrice, maxPrice, isFeatured, isAvailable, ct);

        return new ProductListDto
        {
            Items = items.Select(ToDto).ToList(),
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = pageSize > 0 ? (int)Math.Ceiling(total / (double)pageSize) : 0
        };
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
        return product is null ? null : ToDto(product);
    }

    public async Task<ProductDto?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        var product = await _productRepository.GetBySlugAsync(slug, ct);
        return product is null ? null : ToDto(product);
    }

    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default)
    {
        var categories = await _categoryRepository.ListAsync(ct);
        return categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                ParentId = c.ParentId,
                IsActive = c.IsActive
            })
            .ToList();
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto, CancellationToken ct = default)
    {
        var slug = (string.IsNullOrWhiteSpace(dto.Name) ? "abaya-" + Guid.NewGuid().ToString("N")[..6] : dto.Name)
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("--", "-");

        var product = new Product
        {
            Name = dto.Name,
            Slug = $"{slug}-{Guid.NewGuid().ToString("N")[..4]}",
            Sku = dto.Sku ?? $"ABY-{DateTime.UtcNow.Ticks % 10000}",
            Description = dto.Description,
            Price = dto.Price,
            CompareAtPrice = dto.CompareAtPrice,
            StockQuantity = dto.StockQuantity,
            IsAvailable = dto.IsAvailable,
            IsFeatured = dto.IsFeatured,
            CategoryId = dto.CategoryId,
            Images = dto.Images.Select((url, idx) => new ProductImage
            {
                Url = url,
                SortOrder = idx + 1,
                IsPrimary = idx == 0
            }).ToList()
        };

        var created = await _productRepository.AddAsync(product, ct);
        return ToDto(created);
    }

    public async Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductDto dto, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
        if (product == null) return null;

        if (dto.Name != null) product.Name = dto.Name;
        if (dto.Description != null) product.Description = dto.Description;
        if (dto.Price.HasValue) product.Price = dto.Price.Value;
        if (dto.CompareAtPrice.HasValue) product.CompareAtPrice = dto.CompareAtPrice.Value;
        if (dto.StockQuantity.HasValue) product.StockQuantity = dto.StockQuantity.Value;
        if (dto.IsAvailable.HasValue) product.IsAvailable = dto.IsAvailable.Value;
        if (dto.IsFeatured.HasValue) product.IsFeatured = dto.IsFeatured.Value;
        if (dto.CategoryId.HasValue) product.CategoryId = dto.CategoryId.Value;
        if (dto.Images != null)
        {
            product.Images.Clear();
            foreach (var (url, idx) in dto.Images.Select((u, i) => (u, i)))
            {
                product.Images.Add(new ProductImage
                {
                    Url = url,
                    SortOrder = idx + 1,
                    IsPrimary = idx == 0
                });
            }
        }

        await _productRepository.UpdateAsync(product, ct);
        return ToDto(product);
    }

    public async Task<bool> DeleteProductAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
        if (product == null) return false;
        await _productRepository.DeleteAsync(product, ct);
        return true;
    }

    private static string NormalizeSort(string? sortBy) => sortBy?.ToLowerInvariant() switch
    {
        "price-asc" => "price_asc",
        "price-desc" => "price_desc",
        "newest" => "newest",
        "featured" => "featured",
        _ => "default"
    };

    private static ProductDto ToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Slug = p.Slug,
        Sku = p.Sku,
        Description = p.Description,
        Price = p.Price,
        CompareAtPrice = p.CompareAtPrice,
        Currency = p.Currency,
        StockQuantity = p.StockQuantity,
        IsAvailable = p.IsAvailable,
        IsFeatured = p.IsFeatured,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name,
        Images = p.Images
            .OrderBy(i => i.SortOrder)
            .Select(i => i.Url)
            .ToList()
    };
}
