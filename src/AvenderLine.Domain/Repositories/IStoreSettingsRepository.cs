using AvenderLine.Domain.Entities;

namespace AvenderLine.Domain.Repositories;

/// <summary>Store settings access (single global record).</summary>
public interface IStoreSettingsRepository : IRepository<StoreSettings>
{
    Task<StoreSettings?> GetCurrentAsync(CancellationToken ct = default);
}
