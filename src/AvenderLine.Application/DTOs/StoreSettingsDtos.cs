namespace AvenderLine.Application.DTOs;

public class StoreSettingsDto
{
    public string StoreName { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string? Tagline { get; set; }
    public string PrimaryColor { get; set; } = "#000000";
    public string SecondaryColor { get; set; } = "#ffffff";
    public string AccentColor { get; set; } = "#c9a24b";
    public string ThemeMode { get; set; } = "light";
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? Instagram { get; set; }
    public string? TikTok { get; set; }
    public string DefaultLanguage { get; set; } = "en";
    public string Currency { get; set; } = "QAR";
    public decimal ShippingCost { get; set; }
    public decimal? FreeShippingThreshold { get; set; }
    public decimal TaxRate { get; set; }
}

public class UpdateStoreSettingsDto
{
    public string? StoreName { get; set; }
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string? Tagline { get; set; }
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? AccentColor { get; set; }
    public string? ThemeMode { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? Instagram { get; set; }
    public string? TikTok { get; set; }
    public string? DefaultLanguage { get; set; }
    public string? Currency { get; set; }
    public decimal? ShippingCost { get; set; }
    public decimal? FreeShippingThreshold { get; set; }
    public decimal? TaxRate { get; set; }
}
