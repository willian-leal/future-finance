using FutureFinance.Api.Data;
using FutureFinance.Api.Domain.Entities;
using FutureFinance.Api.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FutureFinance.Api.Extensions;

public static class SeedExtensions
{
    public static async Task SeedDataAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();

        if (await db.Accounts.AnyAsync()) return;

        var account = new Account { Name = "Nubank", InitialBalance = 2500m };
        db.Accounts.Add(account);

        db.Transactions.AddRange(
            new Transaction
            {
                Type = TransactionType.Income,
                Amount = 4000m,
                Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
                Description = "Salário",
                Category = "Trabalho",
                Account = account
            },
            new Transaction
            {
                Type = TransactionType.Expense,
                Amount = 320m,
                Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-3)),
                Description = "Mercado",
                Category = "Alimentação",
                Account = account
            });

        db.RecurringRules.Add(new RecurringRule
        {
            Name = "Aluguel",
            Type = TransactionType.Expense,
            Amount = 1500m,
            Frequency = RecurringFrequency.Monthly,
            NextRunDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5)),
            Category = "Moradia",
            AccountId = account.Id
        });

        db.Goals.Add(new Goal
        {
            Name = "Reserva de emergência",
            TargetAmount = 10000m,
            TargetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(10)),
            Priority = 1
        });

        await db.SaveChangesAsync();
    }
}
