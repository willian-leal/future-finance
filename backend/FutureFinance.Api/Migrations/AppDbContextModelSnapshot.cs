using FutureFinance.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

#nullable disable

namespace FutureFinance.Api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "8.0.8");
            modelBuilder.Entity("FutureFinance.Api.Domain.Entities.Account", b =>
            {
                b.Property<Guid>("Id");
                b.Property<decimal>("InitialBalance").HasPrecision(18, 2);
                b.Property<string>("Name").HasMaxLength(100);
                b.HasKey("Id");
                b.ToTable("Accounts");
            });
            modelBuilder.Entity("FutureFinance.Api.Domain.Entities.Goal", b =>
            {
                b.Property<Guid>("Id");
                b.Property<string>("Name");
                b.Property<int>("Priority");
                b.Property<decimal>("TargetAmount").HasPrecision(18, 2);
                b.Property<DateOnly>("TargetDate");
                b.HasKey("Id");
                b.ToTable("Goals");
            });
            modelBuilder.Entity("FutureFinance.Api.Domain.Entities.RecurringRule", b =>
            {
                b.Property<Guid>("Id");
                b.Property<Guid>("AccountId");
                b.Property<decimal>("Amount").HasPrecision(18, 2);
                b.Property<string>("Category");
                b.Property<DateOnly?>("EndDate");
                b.Property<int>("Frequency");
                b.Property<string>("Name");
                b.Property<DateOnly>("NextRunDate");
                b.Property<int>("Type");
                b.HasKey("Id");
                b.ToTable("RecurringRules");
            });
            modelBuilder.Entity("FutureFinance.Api.Domain.Entities.Transaction", b =>
            {
                b.Property<Guid>("Id");
                b.Property<Guid>("AccountId");
                b.Property<decimal>("Amount").HasPrecision(18, 2);
                b.Property<string>("Category");
                b.Property<DateOnly>("Date");
                b.Property<string>("Description");
                b.Property<int>("Type");
                b.HasKey("Id");
                b.HasIndex("AccountId");
                b.ToTable("Transactions");
            });
        }
    }
}
