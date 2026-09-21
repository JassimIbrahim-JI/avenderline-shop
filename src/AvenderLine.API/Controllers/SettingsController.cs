using AvenderLine.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AvenderLine.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly IStoreSettingsService _settingsService;

    public SettingsController(IStoreSettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
        => Ok(await _settingsService.GetAsync(ct));

    [HttpPut]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Update(AvenderLine.Application.DTOs.UpdateStoreSettingsDto dto, CancellationToken ct)
        => Ok(await _settingsService.UpdateAsync(dto, ct));
}
