using FutureFinance.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FutureFinance.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<RecurringRule> RecurringRules => Set<RecurringRule>();
    public DbSet<Goal> Goals => Set<Goal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>().Property(x => x.InitialBalance).HasPrecision(18, 2);
        modelBuilder.Entity<Transaction>().Property(x => x.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<RecurringRule>().Property(x => x.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<Goal>().Property(x => x.TargetAmount).HasPrecision(18, 2);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Account)
            .WithMany(a => a.Transactions)
            .HasForeignKey(t => t.AccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
