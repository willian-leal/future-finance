namespace FutureFinance.Api.Domain.Entities;

public class Goal
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public DateOnly TargetDate { get; set; }
    public int Priority { get; set; }
}
