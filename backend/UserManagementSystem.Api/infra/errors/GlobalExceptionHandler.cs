using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace UserManagementSystem.Api.Infrastructure.ErrorHandling;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var problemDetails = new ProblemDetails
        {
            Instance = httpContext.Request.Path
        };

        switch (exception)
        {
            case ArgumentException:
                _logger.LogWarning(exception, "Requisição inválida: {Message}", exception.Message);
                problemDetails.Title = "Bad Request";
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Detail = exception.Message;
                break;

            case KeyNotFoundException:
                _logger.LogWarning(exception, "Recurso não encontrado: {Message}", exception.Message);
                problemDetails.Title = "Not Found";
                problemDetails.Status = StatusCodes.Status404NotFound;
                problemDetails.Detail = "O recurso solicitado não foi encontrado.";
                break;

            // Violação do Índice Único (E-mail duplicado) - regra de negócio, não erro crítico
            case DbUpdateException dbEx when dbEx.InnerException is PostgresException pgEx && pgEx.SqlState == "23505":
                _logger.LogWarning("Tentativa de inserir e-mail duplicado: {Constraint}", pgEx.ConstraintName);
                problemDetails.Title = "Conflict";
                problemDetails.Status = StatusCodes.Status409Conflict;
                problemDetails.Detail = "Já existe um usuário ativo com este e-mail.";
                break;

            case InvalidOperationException ex:
                _logger.LogWarning(ex, "Operação inválida: {Message}", ex.Message);
                problemDetails.Title = "Conflict";
                problemDetails.Status = StatusCodes.Status409Conflict;
                problemDetails.Detail = ex.Message;
                break;

            default:
                _logger.LogError(exception, "Exceção não tratada capturada: {Message}", exception.Message);
                problemDetails.Title = "Internal Server Error";
                problemDetails.Status = StatusCodes.Status500InternalServerError;
                problemDetails.Detail = "Ocorreu um erro interno inesperado.";
                break;
        }

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; 
    }
}