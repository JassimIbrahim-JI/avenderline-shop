using AvenderLine.Domain.Entities;
using Xunit;

namespace AvenderLine.Tests.Domain;

public class CartTests
{
    [Fact]
    public void AddItem_NewItem_AddsToCart()
    {
        var cart = new Cart { CustomerId = Guid.NewGuid() };
        cart.AddItem(Guid.NewGuid(), null, 1);

        Assert.Single(cart.Items);
        Assert.Equal(1, cart.Items.First().Quantity);
    }

    [Fact]
    public void AddItem_SameProduct_IncrementsQuantity()
    {
        var cart = new Cart { CustomerId = Guid.NewGuid() };
        var productId = Guid.NewGuid();

        cart.AddItem(productId, null, 1);
        cart.AddItem(productId, null, 2);

        Assert.Single(cart.Items);
        Assert.Equal(3, cart.Items.First().Quantity);
    }

    [Fact]
    public void AddItem_DifferentVariant_CreatesSeparateLine()
    {
        var cart = new Cart { CustomerId = Guid.NewGuid() };
        var productId = Guid.NewGuid();
        var variantA = Guid.NewGuid();
        var variantB = Guid.NewGuid();

        cart.AddItem(productId, variantA, 1);
        cart.AddItem(productId, variantB, 1);

        Assert.Equal(2, cart.Items.Count);
    }

    [Fact]
    public void RemoveItem_RemovesLine()
    {
        var cart = new Cart { CustomerId = Guid.NewGuid() };
        var productId = Guid.NewGuid();

        cart.AddItem(productId, null, 1);
        cart.RemoveItem(productId, null);

        Assert.Empty(cart.Items);
    }

    [Fact]
    public void Clear_RemovesAllItems()
    {
        var cart = new Cart { CustomerId = Guid.NewGuid() };
        cart.AddItem(Guid.NewGuid(), null, 1);
        cart.AddItem(Guid.NewGuid(), null, 1);

        cart.Clear();

        Assert.Empty(cart.Items);
    }
}
