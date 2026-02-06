using FutureFinance.Api.Domain.Entities;
using FutureFinance.Api.Domain.Enums;
using FutureFinance.Api.DTOs.Forecast;

namespace FutureFinance.Api.Services;

public interface IForecastEngine
{
    ForecastComputationResult Compute(decimal initialBalance, IEnumerable<Transaction> transactions, IEnumerable<RecurringRule> recurringRules, IEnumerable<Goal> goals, DateOnly from, DateOnly to);
}

public record ForecastEvent(DateOnly Date, decimal SignedAmount, string Source);
public record ForecastComputationResult(IReadOnlyCollection<ForecastPointDto> Timeline, ForecastMetricsDto Metrics, IReadOnlyCollection<GoalForecastImpactDto> Goals);

public class ForecastEngine : IForecastEngine
{
    public ForecastComputationResult Compute(decimal initialBalance, IEnumerable<Transaction> transactions, IEnumerable<RecurringRule> recurringRules, IEnumerable<Goal> goals, DateOnly from, DateOnly to)
    {
        if (to < from) throw new ArgumentException("'to' must be >= 'from'");

        var events = new List<ForecastEvent>();

        events.AddRange(transactions
            .Where(t => t.Date >= from && t.Date <= to)
            .Select(t => new ForecastEvent(t.Date, ToSignedAmount(t.Type, t.Amount), "transaction")));

        foreach (var recurring in recurringRules)
        {
            foreach (var date in ExpandRecurringDates(recurring, from, to))
            {
                events.Add(new ForecastEvent(date, ToSignedAmount(recurring.Type, recurring.Amount), "recurring"));
            }
        }

        var sortedEvents = events.OrderBy(e => e.Date).ToList();
        var points = new List<ForecastPointDto>();
        var balance = initialBalance;
        var minBalance = balance;
        var negativeDays = 0;

        for (var cursor = from; cursor <= to; cursor = cursor.AddDays(1))
        {
            var dayImpact = sortedEvents.Where(e => e.Date == cursor).Sum(e => e.SignedAmount);
            balance += dayImpact;
            points.Add(new ForecastPointDto(cursor, balance));

            if (balance < minBalance) minBalance = balance;
            if (balance < 0) negativeDays++;
        }

        var goalImpacts = goals
            .Select(goal =>
            {
                var hitPoint = points.FirstOrDefault(p => p.Date <= goal.TargetDate && p.Balance >= goal.TargetAmount);
                return new GoalForecastImpactDto(goal.Id, goal.Name, hitPoint?.Date, hitPoint is not null);
            })
            .OrderBy(g => g.EstimatedHitDate ?? DateOnly.MaxValue)
            .ToList();

        return new ForecastComputationResult(
            points,
            new ForecastMetricsDto(minBalance, negativeDays, points.LastOrDefault()?.Balance ?? initialBalance),
            goalImpacts);
    }

    private static decimal ToSignedAmount(TransactionType type, decimal amount)
        => type == TransactionType.Expense ? -Math.Abs(amount) : Math.Abs(amount);

    private static IEnumerable<DateOnly> ExpandRecurringDates(RecurringRule rule, DateOnly from, DateOnly to)
    {
        var cursor = rule.NextRunDate > from ? rule.NextRunDate : from;
        while (cursor <= to)
        {
            if (rule.EndDate is not null && cursor > rule.EndDate.Value)
            {
                yield break;
            }

            yield return cursor;
            cursor = rule.Frequency switch
            {
                RecurringFrequency.Daily => cursor.AddDays(1),
                RecurringFrequency.Weekly => cursor.AddDays(7),
                RecurringFrequency.Monthly => cursor.AddMonths(1),
                _ => throw new ArgumentOutOfRangeException()
            };
        }
    }
}
