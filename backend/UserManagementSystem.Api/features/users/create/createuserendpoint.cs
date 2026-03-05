using Microsoft.AspNetCore.Mvc;
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
            CancellationToken cancellationToken) =>
        {
            // O tratamento de erro global cuidará de ArgumentException lançada aqui
            var user = User.Create(request.Name, request.Email, request.UserType);

            dbContext.Users.Add(user);
            
            // O EF Core irá disparar o INSERT. Se o e-mail duplicar para ativos, o erro vira 409 Conflict nativamente
            await dbContext.SaveChangesAsync(cancellationToken);

            // Atualiza o Bloom Filter incrementalmente para feedback imediato
            filterService.Add(user.Email);
            filterService.Add(user.Id.ToString());

            // Retorna 201 Created e o Id gerado
            return Results.Created($"/users/{user.Id}", new { user.Id });
        })
        .WithName("CreateUser")
        .Produces(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status409Conflict);
    }
}