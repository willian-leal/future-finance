using System.Net;
using System.Net.Http.Json;
using FutureFinance.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FutureFinance.Tests;

public class SimulateEndpointTests : IClassFixture<FutureFinanceWebAppFactory>
{
    private readonly HttpClient _client;

    public SimulateEndpointTests(FutureFinanceWebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostSimulate_ShouldAcceptStringEnumWithoutWrapper()
    {
        var payload = new
        {
            amount = 300m,
            date = "2026-02-06",
            type = "EXPENSE"
        };

        var response = await _client.PostAsJsonAsync("/api/simulate", payload);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PostSimulate_ShouldAcceptNumericEnumWithoutWrapper()
    {
        var payload = new
        {
            amount = 300m,
            date = "2026-02-06",
            type = 2
        };

        var response = await _client.PostAsJsonAsync("/api/simulate", payload);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}

public class FutureFinanceWebAppFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor is not null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase($"futurefinance-tests-{Guid.NewGuid()}");
            });
        });

        builder.UseEnvironment("Testing");
    }
}
