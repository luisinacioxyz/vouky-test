using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;
using NSubstitute;
using UserManagementSystem.Api.Infrastructure.ErrorHandling;

namespace UserManagementSystem.Tests.Infrastructure.ErrorHandling;

public class GlobalExceptionHandlerTests
{
    [Fact]
    public async Task TryHandleAsync_Should_Return_409_When_Postgres_Throws_Unique_Violation()
    {
        // Exceção exata (código 23505) que o PostgreSQL lança na duplicidade
        var pgException = new PostgresException("Duplicate email", "High", "High", "23505");
        var dbException = new DbUpdateException("Error updating DB", pgException);

        // Mock da dependência de log
        var loggerMock = Substitute.For<ILogger<GlobalExceptionHandler>>();
        var handler = new GlobalExceptionHandler(loggerMock);

        // Simulação de uma requisição HTTP real
        var httpContext = new DefaultHttpContext();
        httpContext.Response.Body = new MemoryStream(); 

        // Act
        var result = await handler.TryHandleAsync(httpContext, dbException, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        httpContext.Response.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }
}