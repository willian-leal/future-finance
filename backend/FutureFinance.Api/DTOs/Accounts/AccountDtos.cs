using System.ComponentModel.DataAnnotations;

namespace FutureFinance.Api.DTOs.Accounts;

public record AccountResponse(Guid Id, string Name, decimal InitialBalance);

public class CreateAccountRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 999999999)]
    public decimal InitialBalance { get; set; }
}

public class UpdateAccountRequest : CreateAccountRequest;
