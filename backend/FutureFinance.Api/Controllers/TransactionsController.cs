using FutureFinance.Api.Data;
using FutureFinance.Api.Domain.Entities;
using FutureFinance.Api.DTOs.Transactions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FutureFinance.Api.Controllers;

[ApiController]
[Route("api/transactions")]
public class TransactionsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetAll([FromQuery] DateOnly? from, [FromQuery] DateOnly? to, [FromQuery] Guid? accountId, [FromQuery] string? category, CancellationToken ct)
    {
        var query = dbContext.Transactions.AsNoTracking().AsQueryable();
        if (from.HasValue) query = query.Where(t => t.Date >= from.Value);
        if (to.HasValue) query = query.Where(t => t.Date <= to.Value);
        if (accountId.HasValue) query = query.Where(t => t.AccountId == accountId.Value);
        if (!string.IsNullOrWhiteSpace(category)) query = query.Where(t => t.Category == category);

        var items = await query.Select(t => new TransactionResponse(t.Id, t.Type, t.Amount, t.Date, t.Description, t.Category, t.AccountId)).ToListAsync(ct);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Create(CreateTransactionRequest request, CancellationToken ct)
    {
        var entity = new Transaction
        {
            Type = request.Type,
            Amount = request.Amount,
            Date = request.Date,
            Description = request.Description,
            Category = request.Category,
            AccountId = request.AccountId
        };
        dbContext.Transactions.Add(entity);
        await dbContext.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetAll), new { id = entity.Id }, new TransactionResponse(entity.Id, entity.Type, entity.Amount, entity.Date, entity.Description, entity.Category, entity.AccountId));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateTransactionRequest request, CancellationToken ct)
    {
        var entity = await dbContext.Transactions.FindAsync([id], ct);
        if (entity is null) return NotFound();
        entity.Type = request.Type;
        entity.Amount = request.Amount;
        entity.Date = request.Date;
        entity.Description = request.Description;
        entity.Category = request.Category;
        entity.AccountId = request.AccountId;
        await dbContext.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var entity = await dbContext.Transactions.FindAsync([id], ct);
        if (entity is null) return NotFound();
        dbContext.Transactions.Remove(entity);
        await dbContext.SaveChangesAsync(ct);
        return NoContent();
    }
}
