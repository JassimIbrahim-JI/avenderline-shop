using System.Security.Claims;
using AvenderLine.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AvenderLine.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConciergeController : ControllerBase
{
    private readonly IConciergeService _conciergeService;

    public ConciergeController(IConciergeService conciergeService)
    {
        _conciergeService = conciergeService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> Ask(ConciergeRequest request, CancellationToken ct)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdClaim, out var userId))
            {
                request.CustomerId ??= userId;
            }
        }

        var response = await _conciergeService.AskAsync(request, ct);
        return Ok(response);
    }
}
