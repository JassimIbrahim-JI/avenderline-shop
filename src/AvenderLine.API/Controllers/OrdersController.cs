using System.Security.Claims;
using AvenderLine.Application.DTOs;
using AvenderLine.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AvenderLine.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private Guid CustomerId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("checkout")]
    [Authorize(Policy = "RequireCustomer")]
    public async Task<IActionResult> Checkout(CheckoutRequest request, CancellationToken ct)
    {
        try
        {
            var order = await _orderService.CheckoutAsync(CustomerId, request, ct);
            return Ok(order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    [Authorize(Policy = "RequireCustomer")]
    public async Task<IActionResult> GetMine(CancellationToken ct)
        => Ok(await _orderService.GetByCustomerAsync(CustomerId, ct));

    [HttpGet("{orderNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByNumber(string orderNumber, CancellationToken ct)
    {
        var order = await _orderService.GetByOrderNumberAsync(orderNumber, ct);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpGet("admin/all")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> GetAllAdmin(CancellationToken ct)
        => Ok(await _orderService.GetAllOrdersAsync(ct));

    public record UpdateStatusRequest(string Status, string? Note);

    [HttpPut("{id:guid}/status")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest req, CancellationToken ct)
    {
        var updated = await _orderService.UpdateStatusAsync(id, req.Status, req.Note, ct);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpPost("webhook")]
    [AllowAnonymous]
    public IActionResult Webhook([FromHeader(Name = "x-signature")] string? signature, [FromBody] object payload)
    {
        // Safe payment webhook acknowledgment endpoint
        return Ok(new { received = true, timestamp = DateTime.UtcNow });
    }
}
