using AvenderLine.Application.DTOs;

namespace AvenderLine.Application.Interfaces;

/// <summary>Manage global store branding/settings (admin only).</summary>
public interface IStoreSettingsService
{
    Task<StoreSettingsDto> GetAsync(CancellationToken ct = default);
    Task<StoreSettingsDto> UpdateAsync(UpdateStoreSettingsDto dto, CancellationToken ct = default);
}
