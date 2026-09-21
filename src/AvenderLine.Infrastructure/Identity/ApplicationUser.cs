using Microsoft.AspNetCore.Identity;

namespace AvenderLine.Infrastructure.Identity;

/// <summary>Application user extending ASP.NET Core Identity.</summary>
public class ApplicationUser : IdentityUser<Guid>
{
    public string? FullName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
