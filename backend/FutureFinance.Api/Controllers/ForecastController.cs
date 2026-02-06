using FutureFinance.Api.DTOs.Forecast;
using FutureFinance.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FutureFinance.Api.Controllers;

[ApiController]
[Route("api")]
public class ForecastController(IForecastService forecastService) : ControllerBase
{
    [HttpGet("forecast")]
    public async Task<ActionResult<ForecastResponse>> GetForecast([FromQuery] DateOnly? from, [FromQuery] DateOnly? to, CancellationToken ct)
    {
        var start = from ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var end = to ?? start.AddDays(365);
        var response = await forecastService.GetForecastAsync(start, end, ct);
        return Ok(response);
    }

    [HttpPost("simulate")]
    public async Task<ActionResult<SimulateImpactResponse>> Simulate(SimulateRequest request, [FromQuery] DateOnly? from, [FromQuery] DateOnly? to, CancellationToken ct)
    {
        var start = from ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var end = to ?? start.AddDays(365);
        var response = await forecastService.SimulateAsync(request, start, end, ct);
        return Ok(response);
    }
}
