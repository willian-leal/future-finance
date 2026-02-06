using FutureFinance.Api.Data;
using FutureFinance.Api.Domain.Entities;
using FutureFinance.Api.DTOs.Accounts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FutureFinance.Api.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AccountResponse>>> GetAll(CancellationToken ct)
        => Ok(await dbContext.Accounts.AsNoTracking()
            .Select(a => new AccountResponse(a.Id, a.Name, a.InitialBalance))
            .ToListAsync(ct));

    [HttpPost]
    public async Task<ActionResult<AccountResponse>> Create(CreateAccountRequest request, CancellationToken ct)
    {
        var account = new Account { Name = request.Name, InitialBalance = request.InitialBalance };
        dbContext.Accounts.Add(account);
        await dbContext.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetAll), new { id = account.Id }, new AccountResponse(account.Id, account.Name, account.InitialBalance));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateAccountRequest request, CancellationToken ct)
    {
        var account = await dbContext.Accounts.FindAsync([id], ct);
        if (account is null) return NotFound();
        account.Name = request.Name;
        account.InitialBalance = request.InitialBalance;
        await dbContext.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var account = await dbContext.Accounts.FindAsync([id], ct);
        if (account is null) return NotFound();
        dbContext.Accounts.Remove(account);
        await dbContext.SaveChangesAsync(ct);
        return NoContent();
    }
}
