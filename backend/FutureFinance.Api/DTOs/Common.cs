namespace FutureFinance.Api.DTOs;

public record ApiListResponse<T>(IReadOnlyCollection<T> Items);
