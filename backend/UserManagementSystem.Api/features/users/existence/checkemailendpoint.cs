using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Database;
using UserManagementSystem.Api.Infrastructure.Endpoints;

namespace UserManagementSystem.Api.Features.Users.Existence;

public class CheckEmailEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/users/check-email", async (string email, AppDbContext dbContext, CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(email))
                return Results.BadRequest();

            var normalizedEmail = email.ToLowerInvariant().Trim();
            
            // Verifica se existe algum usuário ativo com este e-mail
            var exists = await dbContext.Users
                .AnyAsync(u => u.Email == normalizedEmail && u.DeletedAt == null, ct);

            return Results.Ok(new { exists });
        })
        .WithName("CheckEmailAvailability")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);
    }
}
