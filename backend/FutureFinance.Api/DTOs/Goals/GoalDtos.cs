using System.ComponentModel.DataAnnotations;

namespace FutureFinance.Api.DTOs.Goals;

public record GoalResponse(Guid Id, string Name, decimal TargetAmount, DateOnly TargetDate, int Priority);

public class CreateGoalRequest
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 999999999)]
    public decimal TargetAmount { get; set; }

    public DateOnly TargetDate { get; set; }

    [Range(1, 10)]
    public int Priority { get; set; }
}

public class UpdateGoalRequest : CreateGoalRequest;
