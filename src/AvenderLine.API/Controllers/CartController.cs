using System.Security.Claims;
using AvenderLine.Application.DTOs;
using AvenderLine.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AvenderLine.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireCustomer")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private Guid CustomerId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
        => Ok(await _cartService.GetCartAsync(CustomerId, ct));

    [HttpPost("items")]
    public async Task<IActionResult> AddItem(AddCartItemDto item, CancellationToken ct)
        => Ok(await _cartService.AddItemAsync(CustomerId, item, ct));

    [HttpDelete("items/{productId:guid}")]
    public async Task<IActionResult> RemoveItem(Guid productId, [FromQuery] Guid? variantId, CancellationToken ct)
        => Ok(await _cartService.RemoveItemAsync(CustomerId, productId, variantId, ct));

    [HttpDelete]
    public async Task<IActionResult> Clear(CancellationToken ct)
    {
        await _cartService.ClearAsync(CustomerId, ct);
        return NoContent();
    }
}
