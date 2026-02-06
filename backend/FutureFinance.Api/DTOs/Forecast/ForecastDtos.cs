using System.ComponentModel.DataAnnotations;
using FutureFinance.Api.Domain.Enums;

namespace FutureFinance.Api.DTOs.Forecast;

public record ForecastPointDto(DateOnly Date, decimal Balance);
public record ForecastMetricsDto(decimal MinBalance, int NegativeDays, decimal FinalBalance);
public record GoalForecastImpactDto(Guid GoalId, string GoalName, DateOnly? EstimatedHitDate, bool IsHitInRange);
public record ForecastResponse(IReadOnlyCollection<ForecastPointDto> Timeline, ForecastMetricsDto Metrics, IReadOnlyCollection<GoalForecastImpactDto> Goals);

public class SimulateRequest
{
    [Range(0.01, 999999999)]
    public decimal Amount { get; set; }

    public DateOnly Date { get; set; }

    [EnumDataType(typeof(TransactionType))]
    public TransactionType Type { get; set; } = TransactionType.Expense;

    public Guid? AccountId { get; set; }

    [MaxLength(200)]
    public string? Description { get; set; }
}

public record SimulateImpactResponse(ForecastMetricsDto BaselineMetrics, ForecastMetricsDto SimulatedMetrics, decimal MinBalanceDelta, bool EnteredNegativeAfterSimulation, IReadOnlyCollection<GoalForecastImpactDto> GoalsAfterSimulation);
