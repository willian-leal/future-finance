using System.ComponentModel.DataAnnotations;
using FutureFinance.Api.Domain.Enums;

namespace FutureFinance.Api.DTOs.Transactions;

public record TransactionResponse(Guid Id, TransactionType Type, decimal Amount, DateOnly Date, string Description, string Category, Guid AccountId);

public class CreateTransactionRequest
{
    [Required]
    public TransactionType Type { get; set; }

    [Range(0.01, 999999999)]
    public decimal Amount { get; set; }

    public DateOnly Date { get; set; }

    [Required, MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    public Guid AccountId { get; set; }
}

public class UpdateTransactionRequest : CreateTransactionRequest;
