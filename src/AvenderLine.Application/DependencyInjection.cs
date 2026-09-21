using AvenderLine.Application.Interfaces;
using AvenderLine.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AvenderLine.Application;

/// <summary>Registers Application layer services into the DI container.</summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICatalogService, CatalogService>();
        services.AddScoped<ICartService, CartService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IStoreSettingsService, StoreSettingsService>();

        return services;
    }
}
