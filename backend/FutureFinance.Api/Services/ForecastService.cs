using FutureFinance.Api.Data;
using FutureFinance.Api.Domain.Entities;
using FutureFinance.Api.DTOs.Forecast;
using Microsoft.EntityFrameworkCore;

namespace FutureFinance.Api.Services;

public interface IForecastService
{
    Task<ForecastResponse> GetForecastAsync(DateOnly from, DateOnly to, CancellationToken ct = default);
    Task<SimulateImpactResponse> SimulateAsync(SimulateRequest request, DateOnly from, DateOnly to, CancellationToken ct = default);
}

public class ForecastService(AppDbContext dbContext, IForecastEngine forecastEngine) : IForecastService
{
    public async Task<ForecastResponse> GetForecastAsync(DateOnly from, DateOnly to, CancellationToken ct = default)
    {
        var accounts = await dbContext.Accounts.AsNoTracking().ToListAsync(ct);
        var transactions = await dbContext.Transactions.AsNoTracking().ToListAsync(ct);
        var recurrings = await dbContext.RecurringRules.AsNoTracking().ToListAsync(ct);
        var goals = await dbContext.Goals.AsNoTracking().ToListAsync(ct);

        var initialBalance = accounts.Sum(a => a.InitialBalance) + transactions.Where(t => t.Date < from)
            .Sum(t => t.Type == Domain.Enums.TransactionType.Expense ? -t.Amount : t.Amount);

        var computed = forecastEngine.Compute(initialBalance, transactions, recurrings, goals, from, to);
        return new ForecastResponse(computed.Timeline, computed.Metrics, computed.Goals);
    }

    public async Task<SimulateImpactResponse> SimulateAsync(SimulateRequest request, DateOnly from, DateOnly to, CancellationToken ct = default)
    {
        var baseline = await GetForecastAsync(from, to, ct);

        var transactions = await dbContext.Transactions.AsNoTracking().ToListAsync(ct);
        transactions.Add(new Transaction
        {
            Amount = request.Amount,
            Date = request.Date,
            Type = request.Type,
            AccountId = request.AccountId ?? Guid.Empty,
            Description = request.Description ?? "simulation",
            Category = "Simulation"
        });

        var accounts = await dbContext.Accounts.AsNoTracking().ToListAsync(ct);
        var recurrings = await dbContext.RecurringRules.AsNoTracking().ToListAsync(ct);
        var goals = await dbContext.Goals.AsNoTracking().ToListAsync(ct);

        var initialBalance = accounts.Sum(a => a.InitialBalance) + transactions.Where(t => t.Date < from)
            .Sum(t => t.Type == Domain.Enums.TransactionType.Expense ? -t.Amount : t.Amount);

        var simulated = forecastEngine.Compute(initialBalance, transactions, recurrings, goals, from, to);

        return new SimulateImpactResponse(
            baseline.Metrics,
            simulated.Metrics,
            simulated.Metrics.MinBalance - baseline.Metrics.MinBalance,
            baseline.Metrics.NegativeDays == 0 && simulated.Metrics.NegativeDays > 0,
            simulated.Goals);
    }
}
