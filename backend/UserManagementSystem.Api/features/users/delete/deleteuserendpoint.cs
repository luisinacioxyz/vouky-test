using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Database;
using UserManagementSystem.Api.Infrastructure.Endpoints;

namespace UserManagementSystem.Api.Features.Users.Delete;

public class DeleteUserEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/users/{id:guid}", async (Guid id, AppDbContext dbContext, CancellationToken cancellationToken) =>
        {
            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null, cancellationToken);

            if (user is null)
            {
                // Se não existe ou já foi deletado (DeletedAt != null), retornamos 404 para não vazar a existência do dado 
                return Results.NotFound(new { Detail = "Usuário não encontrado ou já removido." });
            }

            // O método SoftDelete garante a regra de negócio 
            user.SoftDelete();

            await dbContext.SaveChangesAsync(cancellationToken);

            // 204 No Content
            return Results.NoContent();
        })
        .WithName("DeleteUser")
        .Produces(StatusCodes.Status204NoContent)
        .ProducesProblem(StatusCodes.Status404NotFound);
    }
}