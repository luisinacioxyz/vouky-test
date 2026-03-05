using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Database;
using UserManagementSystem.Api.Infrastructure.Endpoints;

namespace UserManagementSystem.Api.Features.Users.Get;

public class GetUserEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/users/{id:guid}", async (Guid id, AppDbContext dbContext, CancellationToken cancellationToken) =>
        {
            var user = await dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null, cancellationToken);

            if (user is null)
            {
                // A prova pede 404 para recursos não encontrados
                return Results.NotFound(new { Detail = "Usuário não encontrado ou inativo." });
            }

            // Retornamos um objeto anônimo (ou um DTO) para não vazar informações sensíveis se houvesse
            var response = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.UserType,
                user.CreatedAt,
                user.UpdatedAt
            };

            return Results.Ok(response);
        })
        .WithName("GetUserById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound);
    }
}