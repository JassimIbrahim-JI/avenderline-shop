using AvenderLine.Application.DTOs;
using AvenderLine.Application.Services;
using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;
using Moq;
using Xunit;

namespace AvenderLine.Tests.Application;

public class CartServiceTests
{
    [Fact]
    public async Task GetCartAsync_NoCart_CreatesNewCart()
    {
        var cartRepo = new Mock<ICartRepository>();
        var productRepo = new Mock<IRepository<Product>>();

        cartRepo.Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Cart?)null);

        cartRepo.Setup(r => r.AddAsync(It.IsAny<Cart>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Cart c, CancellationToken _) => c);

        var service = new CartService(cartRepo.Object, productRepo.Object);
        var result = await service.GetCartAsync(Guid.NewGuid());

        Assert.NotNull(result);
        Assert.Empty(result.Items);
        cartRepo.Verify(r => r.AddAsync(It.IsAny<Cart>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task AddItemAsync_NewItem_AddsToCart()
    {
        var cartRepo = new Mock<ICartRepository>();
        var productRepo = new Mock<IRepository<Product>>();

        var cart = new Cart { CustomerId = Guid.NewGuid() };
        cartRepo.Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(cart);

        var productId = Guid.NewGuid();
        var product = new Product
        {
            Id = productId,
            Name = "Test Abaya",
            Sku = "T-1",
            Price = 100m,
            Images = { new ProductImage { Url = "img.jpg", IsPrimary = true, SortOrder = 1 } }
        };
        productRepo.Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var service = new CartService(cartRepo.Object, productRepo.Object);
        var result = await service.AddItemAsync(cart.CustomerId, new AddCartItemDto
        {
            ProductId = productId,
            Quantity = 2
        });

        Assert.Single(result.Items);
        Assert.Equal(2, result.Items[0].Quantity);
        Assert.Equal(200m, result.Subtotal);
    }

    [Fact]
    public async Task AddItemAsync_ExistingItem_IncrementsQuantity()
    {
        var cartRepo = new Mock<ICartRepository>();
        var productRepo = new Mock<IRepository<Product>>();

        var cart = new Cart { CustomerId = Guid.NewGuid() };
        var productId = Guid.NewGuid();
        cart.AddItem(productId, null, 1);

        cartRepo.Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(cart);

        var product = new Product
        {
            Id = productId,
            Name = "Test Abaya",
            Sku = "T-1",
            Slug = "test-abaya",
            Price = 50m,
            Images = { new ProductImage { Url = "img.jpg", IsPrimary = true, SortOrder = 1 } }
        };
        productRepo.Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var service = new CartService(cartRepo.Object, productRepo.Object);
        var result = await service.AddItemAsync(cart.CustomerId, new AddCartItemDto
        {
            ProductId = productId,
            Quantity = 2
        });

        Assert.Single(result.Items);
        Assert.Equal(3, result.Items[0].Quantity);
        Assert.Equal(150m, result.Subtotal);
    }
}
