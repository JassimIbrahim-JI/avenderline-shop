using AvenderLine.Domain.Common;

namespace AvenderLine.Domain.Entities;

/// <summary>Global store settings controlled by the admin (branding, theme, contact, locale).</summary>
public class StoreSettings : BaseEntity
{
    // Branding
    public string StoreName { get; set; } = "AvenderLine";
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string? Tagline { get; set; }

    // Theme
    public string PrimaryColor { get; set; } = "#000000";
    public string SecondaryColor { get; set; } = "#ffffff";
    public string AccentColor { get; set; } = "#c9a24b";
    public string ThemeMode { get; set; } = "light"; // light | dark

    // Contact
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? Instagram { get; set; }
    public string? TikTok { get; set; }

    // Locale & currency
    public string DefaultLanguage { get; set; } = "en";
    public string Currency { get; set; } = "QAR";

    // Business
    public decimal ShippingCost { get; set; }
    public decimal? FreeShippingThreshold { get; set; }
    public decimal TaxRate { get; set; }
}
