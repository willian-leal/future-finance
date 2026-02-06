using FutureFinance.Api.Data;
using FutureFinance.Api.Extensions;
using FutureFinance.Api.Middleware;
using FutureFinance.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IForecastEngine, ForecastEngine>();
builder.Services.AddScoped<IForecastService, ForecastService>();

builder.Services.AddProblemDetails();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var details = ValidationProblemDetailsFactory.Create(context.ModelState, context.HttpContext);
        return new BadRequestObjectResult(details);
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", p => p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("frontend");
app.UseAuthorization();
app.MapControllers();

await app.SeedDataAsync();

app.Run();

public partial class Program;
