namespace AvenderLine.Application.DTOs;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public string Currency { get; set; } = "QAR";
    public int StockQuantity { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsFeatured { get; set; }
    public Guid CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public List<string> Images { get; set; } = new();
}

public class ProductListDto
{
    public IReadOnlyList<ProductDto> Items { get; set; } = new List<ProductDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public Guid? ParentId { get; set; }
    public bool IsActive { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public int StockQuantity { get; set; } = 10;
    public bool IsAvailable { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public Guid CategoryId { get; set; }
    public List<string> Images { get; set; } = new();
}

public class UpdateProductDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public int? StockQuantity { get; set; }
    public bool? IsAvailable { get; set; }
    public bool? IsFeatured { get; set; }
    public Guid? CategoryId { get; set; }
    public List<string>? Images { get; set; }
}
