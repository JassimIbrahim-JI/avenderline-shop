using AvenderLine.Domain.Common;
using AvenderLine.Domain.Entities;

namespace AvenderLine.Domain.Repositories;

/// <summary>Generic repository contract used by the Application layer.</summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAsync(CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(T entity, CancellationToken ct = default);
    Task<int> CountAsync(CancellationToken ct = default);
}
