using FutureFinance.Api.Data;
using FutureFinance.Api.Domain.Entities;
using FutureFinance.Api.DTOs.Goals;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FutureFinance.Api.Controllers;

[ApiController]
[Route("api/goals")]
public class GoalsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GoalResponse>>> GetAll(CancellationToken ct)
        => Ok(await dbContext.Goals.AsNoTracking()
            .Select(g => new GoalResponse(g.Id, g.Name, g.TargetAmount, g.TargetDate, g.Priority)).ToListAsync(ct));

    [HttpPost]
    public async Task<ActionResult<GoalResponse>> Create(CreateGoalRequest request, CancellationToken ct)
    {
        var entity = new Goal { Name = request.Name, TargetAmount = request.TargetAmount, TargetDate = request.TargetDate, Priority = request.Priority };
        dbContext.Goals.Add(entity);
        await dbContext.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetAll), new { id = entity.Id }, new GoalResponse(entity.Id, entity.Name, entity.TargetAmount, entity.TargetDate, entity.Priority));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateGoalRequest request, CancellationToken ct)
    {
        var entity = await dbContext.Goals.FindAsync([id], ct);
        if (entity is null) return NotFound();
        entity.Name = request.Name;
        entity.TargetAmount = request.TargetAmount;
        entity.TargetDate = request.TargetDate;
        entity.Priority = request.Priority;
        await dbContext.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var entity = await dbContext.Goals.FindAsync([id], ct);
        if (entity is null) return NotFound();
        dbContext.Goals.Remove(entity);
        await dbContext.SaveChangesAsync(ct);
        return NoContent();
    }
}
