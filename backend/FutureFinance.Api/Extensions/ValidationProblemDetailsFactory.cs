using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace FutureFinance.Api.Extensions;

public static class ValidationProblemDetailsFactory
{
    public static ValidationProblemDetails Create(ModelStateDictionary modelState, HttpContext httpContext)
    {
        return new ValidationProblemDetails(modelState)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation error",
            Type = "https://httpstatuses.com/400",
            Instance = httpContext.Request.Path
        };
    }
}
