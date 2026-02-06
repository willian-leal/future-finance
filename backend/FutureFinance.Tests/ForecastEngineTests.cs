using FutureFinance.Api.Domain.Entities;
using FutureFinance.Api.Domain.Enums;
using FutureFinance.Api.Services;

namespace FutureFinance.Tests;

public class ForecastEngineTests
{
    private readonly ForecastEngine _engine = new();

    [Fact]
    public void Compute_ShouldCalculateTimelineAndMetrics()
    {
        var from = new DateOnly(2026, 1, 1);
        var to = new DateOnly(2026, 1, 5);

        var transactions = new List<Transaction>
        {
            new() { Date = new DateOnly(2026, 1, 2), Amount = 100m, Type = TransactionType.Expense },
            new() { Date = new DateOnly(2026, 1, 4), Amount = 300m, Type = TransactionType.Income }
        };

        var recurring = new List<RecurringRule>
        {
            new() { NextRunDate = new DateOnly(2026, 1, 1), Frequency = RecurringFrequency.Daily, Amount = 10m, Type = TransactionType.Expense }
        };

        var result = _engine.Compute(500m, transactions, recurring, [], from, to);

        Assert.Equal(5, result.Timeline.Count);
        Assert.Equal(350m, result.Metrics.FinalBalance);
        Assert.Equal(350m, result.Metrics.MinBalance);
        Assert.Equal(0, result.Metrics.NegativeDays);
    }

    [Fact]
    public void Compute_ShouldShiftGoalHitDateWhenBalanceIsLower()
    {
        var from = new DateOnly(2026, 1, 1);
        var to = new DateOnly(2026, 1, 10);

        var goals = new List<Goal>
        {
            new() { Id = Guid.NewGuid(), Name = "Meta", TargetAmount = 600m, TargetDate = to }
        };

        var baseline = _engine.Compute(500m,
            [new Transaction { Date = new DateOnly(2026, 1, 2), Amount = 120m, Type = TransactionType.Income }],
            [], goals, from, to);

        var simulated = _engine.Compute(500m,
            [
                new Transaction { Date = new DateOnly(2026, 1, 2), Amount = 120m, Type = TransactionType.Income },
                new Transaction { Date = new DateOnly(2026, 1, 1), Amount = 50m, Type = TransactionType.Expense }
            ],
            [], goals, from, to);

        Assert.NotNull(baseline.Goals.Single().EstimatedHitDate);
        Assert.True(simulated.Goals.Single().EstimatedHitDate >= baseline.Goals.Single().EstimatedHitDate);
    }
}
