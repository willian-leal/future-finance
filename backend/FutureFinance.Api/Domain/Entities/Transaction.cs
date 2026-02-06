using FutureFinance.Api.Domain.Enums;

namespace FutureFinance.Api.Domain.Entities;

public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Guid AccountId { get; set; }
    public Account? Account { get; set; }
}
