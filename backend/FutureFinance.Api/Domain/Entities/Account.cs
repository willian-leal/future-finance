using System.ComponentModel.DataAnnotations;

namespace FutureFinance.Api.Domain.Entities;

public class Account
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public decimal InitialBalance { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
