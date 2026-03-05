using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Database;

namespace UserManagementSystem.Api.Features.Users.Delete;

public static class DeleteUserEndpoint
{
    public static void MapDeleteUserEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/users/{id:guid}", async (Guid id, AppDbContext dbContext, CancellationToken cancellationToken) =>
        {
            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null, cancellationToken);

            if (user is null)
            {
                [cite_start]// Se não existe ou já foi deletado (DeletedAt != null), retornamos 404 para não vazar a existência do dado 
                return Results.NotFound(new { Detail = "Usuário não encontrado ou já removido." });
            }

            [cite_start]// O método SoftDelete garante a regra de negócio 
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