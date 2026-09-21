using AvenderLine.Application.DTOs;
using AvenderLine.Application.Interfaces;
using AvenderLine.Domain.Entities;
using AvenderLine.Domain.Repositories;

namespace AvenderLine.Application.Services;

public class StoreSettingsService : IStoreSettingsService
{
    private readonly IStoreSettingsRepository _repository;

    public StoreSettingsService(IStoreSettingsRepository repository)
    {
        _repository = repository;
    }

    public async Task<StoreSettingsDto> GetAsync(CancellationToken ct = default)
    {
        var settings = await _repository.GetCurrentAsync(ct)
            ?? new StoreSettings();
        return ToDto(settings);
    }

    public async Task<StoreSettingsDto> UpdateAsync(UpdateStoreSettingsDto dto, CancellationToken ct = default)
    {
        var settings = await _repository.GetCurrentAsync(ct) ?? new StoreSettings();

        if (dto.StoreName is not null) settings.StoreName = dto.StoreName;
        if (dto.LogoUrl is not null) settings.LogoUrl = dto.LogoUrl;
        if (dto.FaviconUrl is not null) settings.FaviconUrl = dto.FaviconUrl;
        if (dto.Tagline is not null) settings.Tagline = dto.Tagline;
        if (dto.PrimaryColor is not null) settings.PrimaryColor = dto.PrimaryColor;
        if (dto.SecondaryColor is not null) settings.SecondaryColor = dto.SecondaryColor;
        if (dto.AccentColor is not null) settings.AccentColor = dto.AccentColor;
        if (dto.ThemeMode is not null) settings.ThemeMode = dto.ThemeMode;
        if (dto.Email is not null) settings.Email = dto.Email;
        if (dto.Phone is not null) settings.Phone = dto.Phone;
        if (dto.WhatsApp is not null) settings.WhatsApp = dto.WhatsApp;
        if (dto.Instagram is not null) settings.Instagram = dto.Instagram;
        if (dto.TikTok is not null) settings.TikTok = dto.TikTok;
        if (dto.DefaultLanguage is not null) settings.DefaultLanguage = dto.DefaultLanguage;
        if (dto.Currency is not null) settings.Currency = dto.Currency;
        if (dto.ShippingCost is not null) settings.ShippingCost = dto.ShippingCost.Value;
        if (dto.FreeShippingThreshold is not null) settings.FreeShippingThreshold = dto.FreeShippingThreshold;
        if (dto.TaxRate is not null) settings.TaxRate = dto.TaxRate.Value;

        settings.UpdatedAt = DateTime.UtcNow;

        if (settings.Id == Guid.Empty)
            await _repository.AddAsync(settings, ct);
        else
            await _repository.UpdateAsync(settings, ct);

        return ToDto(settings);
    }

    private static StoreSettingsDto ToDto(StoreSettings s) => new()
    {
        StoreName = s.StoreName,
        LogoUrl = s.LogoUrl,
        FaviconUrl = s.FaviconUrl,
        Tagline = s.Tagline,
        PrimaryColor = s.PrimaryColor,
        SecondaryColor = s.SecondaryColor,
        AccentColor = s.AccentColor,
        ThemeMode = s.ThemeMode,
        Email = s.Email,
        Phone = s.Phone,
        WhatsApp = s.WhatsApp,
        Instagram = s.Instagram,
        TikTok = s.TikTok,
        DefaultLanguage = s.DefaultLanguage,
        Currency = s.Currency,
        ShippingCost = s.ShippingCost,
        FreeShippingThreshold = s.FreeShippingThreshold,
        TaxRate = s.TaxRate
    };
}
