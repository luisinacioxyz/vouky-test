using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using UserManagementSystem.Api.Database;
using UserManagementSystem.Api.Domain;
using UserManagementSystem.Api.Infrastructure.Endpoints;

using UserManagementSystem.Api.Features.Users.Existence;

namespace UserManagementSystem.Api.Features.Users.Create;

// DTO de Entrada (Request) usando Records para imutabilidade e concisão
public record CreateUserRequest(string Name, string Email, Guid UserType);

public class CreateUserEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/users", async (
            CreateUserRequest request,
            AppDbContext dbContext,
            IExistenceFilterService filterService,
            ILogger<CreateUserEndpoint> logger,
            CancellationToken cancellationToken) =>
        {
            var user = User.Create(request.Name, request.Email, request.UserType);

            // 1. Check prévio: evita exceção na maioria dos casos e mantém log limpo
            var emailExists = await dbContext.Users
                .AnyAsync(u => u.Email == user.Email && u.DeletedAt == null, cancellationToken);

            if (emailExists)
            {
                logger.LogWarning("Tentativa de cadastro com e-mail duplicado: {Email}", user.Email);
                return Results.Conflict(new { code = "EMAIL_ALREADY_IN_USE", message = "Este e-mail já está em uso." });
            }

            dbContext.Users.Add(user);

            try
            {
                await dbContext.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation })
            {
                // 2. Fallback para condição de corrida (race condition)
                logger.LogWarning("E-mail duplicado detectado em condição de corrida: {Email}", user.Email);
                return Results.Conflict(new { code = "EMAIL_ALREADY_IN_USE", message = "Este e-mail já está em uso." });
            }

            // Atualiza o Bloom Filter incrementalmente para feedback imediato
            filterService.Add(user.Email);
            filterService.Add(user.Id.ToString());

            return Results.Created($"/users/{user.Id}", new { user.Id });
        })
        .WithName("CreateUser")
        .Produces(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status409Conflict);
    }
}