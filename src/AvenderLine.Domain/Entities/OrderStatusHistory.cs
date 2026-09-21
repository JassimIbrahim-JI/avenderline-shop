using AvenderLine.Domain.Common;

namespace AvenderLine.Domain.Entities;

/// <summary>An entry in an order's status timeline for auditability.</summary>
public class OrderStatusHistory : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }

    public OrderStatus FromStatus { get; set; }
    public OrderStatus ToStatus { get; set; }
    public string? Note { get; set; }
}
