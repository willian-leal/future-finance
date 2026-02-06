using System.ComponentModel.DataAnnotations;
using FutureFinance.Api.Domain.Enums;

namespace FutureFinance.Api.DTOs.Recurrings;

public record RecurringResponse(Guid Id, string Name, TransactionType Type, decimal Amount, RecurringFrequency Frequency, DateOnly NextRunDate, DateOnly? EndDate, string Category, Guid AccountId);

public class CreateRecurringRequest
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public TransactionType Type { get; set; }

    [Range(0.01, 999999999)]
    public decimal Amount { get; set; }

    [Required]
    public RecurringFrequency Frequency { get; set; }

    public DateOnly NextRunDate { get; set; }
    public DateOnly? EndDate { get; set; }

    [Required, MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    public Guid AccountId { get; set; }
}

public class UpdateRecurringRequest : CreateRecurringRequest;
