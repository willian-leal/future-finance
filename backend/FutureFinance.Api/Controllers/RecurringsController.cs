using FutureFinance.Api.Data;
using FutureFinance.Api.Domain.Entities;
using FutureFinance.Api.DTOs.Recurrings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FutureFinance.Api.Controllers;

[ApiController]
[Route("api/recurrings")]
public class RecurringsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RecurringResponse>>> GetAll(CancellationToken ct)
        => Ok(await dbContext.RecurringRules.AsNoTracking()
            .Select(r => new RecurringResponse(r.Id, r.Name, r.Type, r.Amount, r.Frequency, r.NextRunDate, r.EndDate, r.Category, r.AccountId)).ToListAsync(ct));

    [HttpPost]
    public async Task<ActionResult<RecurringResponse>> Create(CreateRecurringRequest request, CancellationToken ct)
    {
        var entity = new RecurringRule
        {
            Name = request.Name,
            Type = request.Type,
            Amount = request.Amount,
            Frequency = request.Frequency,
            NextRunDate = request.NextRunDate,
            EndDate = request.EndDate,
            Category = request.Category,
            AccountId = request.AccountId
        };
        dbContext.RecurringRules.Add(entity);
        await dbContext.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetAll), new { id = entity.Id }, new RecurringResponse(entity.Id, entity.Name, entity.Type, entity.Amount, entity.Frequency, entity.NextRunDate, entity.EndDate, entity.Category, entity.AccountId));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateRecurringRequest request, CancellationToken ct)
    {
        var entity = await dbContext.RecurringRules.FindAsync([id], ct);
        if (entity is null) return NotFound();
        entity.Name = request.Name;
        entity.Type = request.Type;
        entity.Amount = request.Amount;
        entity.Frequency = request.Frequency;
        entity.NextRunDate = request.NextRunDate;
        entity.EndDate = request.EndDate;
        entity.Category = request.Category;
        entity.AccountId = request.AccountId;
        await dbContext.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var entity = await dbContext.RecurringRules.FindAsync([id], ct);
        if (entity is null) return NotFound();
        dbContext.RecurringRules.Remove(entity);
        await dbContext.SaveChangesAsync(ct);
        return NoContent();
    }
}
