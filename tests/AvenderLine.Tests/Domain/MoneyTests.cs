using AvenderLine.Domain.Common;
using Xunit;

namespace AvenderLine.Tests.Domain;

public class MoneyTests
{
    [Fact]
    public void Money_RoundsToTwoDecimals()
    {
        var money = new Money(19.999m);
        Assert.Equal(20.00m, money.Amount);
    }

    [Fact]
    public void Money_Addition_AddsAmounts()
    {
        var a = new Money(10.50m);
        var b = new Money(5.25m);
        var result = a + b;
        Assert.Equal(15.75m, result.Amount);
    }

    [Fact]
    public void Money_Subtraction_SubtractsAmounts()
    {
        var a = new Money(20m);
        var b = new Money(5m);
        var result = a - b;
        Assert.Equal(15m, result.Amount);
    }

    [Fact]
    public void Money_NegativeAmount_Throws()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new Money(-1m));
    }

    [Fact]
    public void Money_Addition_DifferentCurrencies_Throws()
    {
        var a = new Money(10m, "QAR");
        var b = new Money(10m, "USD");
        Assert.Throws<InvalidOperationException>(() => a + b);
    }

    [Fact]
    public void Money_Equals_ByValue()
    {
        var a = new Money(10m);
        var b = new Money(10m);
        Assert.Equal(a, b);
        Assert.True(a == b);
    }

    [Fact]
    public void Money_Multiply_ByInteger()
    {
        var a = new Money(10m);
        var result = a * 3;
        Assert.Equal(30m, result.Amount);
    }

    [Fact]
    public void Money_Zero_Default()
    {
        var zero = Money.Zero();
        Assert.Equal(0m, zero.Amount);
        Assert.Equal("QAR", zero.Currency);
    }
}
