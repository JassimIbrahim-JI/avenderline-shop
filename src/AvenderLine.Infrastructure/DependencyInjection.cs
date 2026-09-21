using AvenderLine.Application.Interfaces;
using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;
using AvenderLine.Infrastructure.AI;
using AvenderLine.Infrastructure.Identity;
using AvenderLine.Infrastructure.Payments;
using AvenderLine.Infrastructure.Persistence;
using AvenderLine.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AvenderLine.Infrastructure;

/// <summary>Registers Infrastructure layer services (EF Core, Identity, repositories, payment, AI).</summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var provider = configuration["Database:Provider"] ?? "Sqlite";
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase) ? "Data Source=avenderline.db" : "Host=localhost;Port=5432;Database=avenderline;Username=avenderline;Password=avenderline");

        if (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase) || connectionString.Contains(".db") || connectionString.StartsWith("Data Source="))
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(connectionString));
        }
        else
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString));
        }

        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.User.RequireUniqueEmail = true;
                options.Lockout.MaxFailedAccessAttempts = 5;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<JwtTokenService>();

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICartRepository, CartRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IStoreSettingsRepository, StoreSettingsRepository>();
        services.AddScoped<IRepository<Category>, CategoryRepository>();

        // Payment gateway — Tap Payments is the sole provider
        services.AddHttpClient("Tap", client =>
        {
            client.BaseAddress = new Uri("https://api.tap.company");
        });
        services.AddScoped<IPaymentGateway, TapGateway>();

        // AI Concierge
        services.AddScoped<IConciergeService, ConciergeService>();

        return services;
    }
}
