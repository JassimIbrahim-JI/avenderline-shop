using AvenderLine.Domain.Entities;
using AvenderLine.Infrastructure.Identity;
using AvenderLine.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AvenderLine.Infrastructure.Persistence;

/// <summary>Seeds roles, an admin user, and sample catalog data on startup (development).</summary>
public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        await db.Database.MigrateAsync();

        await SeedRolesAsync(roleManager);
        await SeedAdminAsync(userManager);
        await SeedStoreSettingsAsync(db);
        await SeedCatalogAsync(db);
        await UpdateLegacyImageUrlsAsync(db);
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        foreach (var role in new[] { "Admin", "Customer", "Manager" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }
    }

    private static async Task SeedAdminAsync(UserManager<ApplicationUser> userManager)
    {
        const string email = "admin@avenderline.com";
        if (await userManager.FindByEmailAsync(email) is not null)
            return;

        var admin = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            FullName = "AvenderLine Admin"
        };

        await userManager.CreateAsync(admin, "Admin@1234");
        await userManager.AddToRoleAsync(admin, "Admin");
    }

    private static async Task SeedStoreSettingsAsync(ApplicationDbContext db)
    {
        if (await db.StoreSettings.AnyAsync())
            return;

        db.StoreSettings.Add(new StoreSettings
        {
            StoreName = "AvenderLine",
            Tagline = "Luxury Qatari Abayas",
            DefaultLanguage = "en",
            Currency = "QAR",
            ShippingCost = 25m,
            FreeShippingThreshold = 500m,
            TaxRate = 0m
        });

        await db.SaveChangesAsync();
    }

    private static async Task SeedCatalogAsync(ApplicationDbContext db)
    {
        if (await db.Categories.AnyAsync())
            return;

        var women = new Category
        {
            Name = "Women", Slug = "women", SortOrder = 1,
            ImageUrl = "https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1000&q=85"
        };
        var kids = new Category
        {
            Name = "Kids", Slug = "kids", SortOrder = 2,
            ImageUrl = "https://images.unsplash.com/photo-1762605135326-5c4bcc5ef006?auto=format&fit=crop&w=1000&q=85"
        };
        var occasions = new Category
        {
            Name = "Occasions", Slug = "occasions", SortOrder = 3,
            ImageUrl = "https://images.unsplash.com/photo-1724412665971-114bd351a42d?auto=format&fit=crop&w=1000&q=85"
        };
        var classics = new Category
        {
            Name = "Classics", Slug = "classics", SortOrder = 4,
            ImageUrl = "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85"
        };

        db.Categories.AddRange(women, kids, occasions, classics);
        await db.SaveChangesAsync();

        var products = new[]
        {
            new Product
            {
                Name = "Luxury Black Abaya",
                Slug = "luxury-black-abaya", Sku = "ABY-001",
                Description = "Premium fabric abaya with elegant design",
                Price = 450m, CompareAtPrice = 550m, StockQuantity = 50,
                IsAvailable = true, IsFeatured = true, SortOrder = 1, CategoryId = women.Id,
                Images = { new ProductImage { Url = "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1200&q=85", AltText = "Black abaya", IsPrimary = true, SortOrder = 1 } }
            },
            new Product
            {
                Name = "Embroidered Occasion Abaya",
                Slug = "embroidered-occasion-abaya", Sku = "ABY-002",
                Description = "Embroidered abaya for special occasions",
                Price = 750m, StockQuantity = 25,
                IsAvailable = true, IsFeatured = true, SortOrder = 2, CategoryId = occasions.Id,
                Images = { new ProductImage { Url = "https://images.unsplash.com/photo-1724412665971-114bd351a42d?auto=format&fit=crop&w=1200&q=85", AltText = "Embroidered abaya", IsPrimary = true, SortOrder = 1 } }
            },
            new Product
            {
                Name = "Kids Pink Abaya",
                Slug = "kids-pink-abaya", Sku = "ABY-003",
                Description = "Soft kids abaya",
                Price = 180m, StockQuantity = 40,
                IsAvailable = true, IsFeatured = false, SortOrder = 3, CategoryId = kids.Id,
                Images = { new ProductImage { Url = "https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1200&q=85", AltText = "Pink abaya", IsPrimary = true, SortOrder = 1 } }
            }
        };

        db.Products.AddRange(products);
        await db.SaveChangesAsync();
    }

    private static async Task UpdateLegacyImageUrlsAsync(ApplicationDbContext db)
    {
        var legacyImages = await db.ProductImages
            .Where(pi => pi.Url.Contains("placehold.co"))
            .ToListAsync();

        if (legacyImages.Any())
        {
            var curatedUrls = new[]
            {
                "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1724412665971-114bd351a42d?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1200&q=85"
            };
            for (int i = 0; i < legacyImages.Count; i++)
            {
                legacyImages[i].Url = curatedUrls[i % curatedUrls.Length];
            }
            await db.SaveChangesAsync();
        }

        // Migrate all categories that have null or empty ImageUrl
        var categoriesToUpdate = await db.Categories.ToListAsync();
        var hasCategoryChanges = false;
        foreach (var cat in categoriesToUpdate)
        {
            if (string.IsNullOrWhiteSpace(cat.ImageUrl))
            {
                cat.ImageUrl = cat.Slug switch
                {
                    "women" => "https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1000&q=85",
                    "classics" => "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85",
                    "occasions" => "https://images.unsplash.com/photo-1724412665971-114bd351a42d?auto=format&fit=crop&w=1000&q=85",
                    "kids" => "https://images.unsplash.com/photo-1762605135326-5c4bcc5ef006?auto=format&fit=crop&w=1000&q=85",
                    _ => "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85"
                };
                hasCategoryChanges = true;
            }
        }
        if (hasCategoryChanges)
        {
            await db.SaveChangesAsync();
        }
    }
}
