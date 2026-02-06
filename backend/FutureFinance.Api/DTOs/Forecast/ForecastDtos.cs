using FutureFinance.Api.Domain.Enums;

namespace FutureFinance.Api.DTOs.Forecast;

public record ForecastPointDto(DateOnly Date, decimal Balance);
public record ForecastMetricsDto(decimal MinBalance, int NegativeDays, decimal FinalBalance);
public record GoalForecastImpactDto(Guid GoalId, string GoalName, DateOnly? EstimatedHitDate, bool IsHitInRange);
public record ForecastResponse(IReadOnlyCollection<ForecastPointDto> Timeline, ForecastMetricsDto Metrics, IReadOnlyCollection<GoalForecastImpactDto> Goals);

public record SimulateRequest(decimal Amount, DateOnly Date, TransactionType Type = TransactionType.Expense, Guid? AccountId = null, string? Description = null);
public record SimulateImpactResponse(ForecastMetricsDto BaselineMetrics, ForecastMetricsDto SimulatedMetrics, decimal MinBalanceDelta, bool EnteredNegativeAfterSimulation, IReadOnlyCollection<GoalForecastImpactDto> GoalsAfterSimulation);
