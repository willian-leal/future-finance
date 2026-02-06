using FutureFinance.Api.Domain.Enums;

namespace FutureFinance.Api.Domain.Entities;

public class RecurringRule
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public RecurringFrequency Frequency { get; set; }
    public DateOnly NextRunDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public Guid AccountId { get; set; }
}
