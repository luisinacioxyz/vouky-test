using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Database;
using UserManagementSystem.Api.Infrastructure.Endpoints;
using System.Collections;
using System.Text;

namespace UserManagementSystem.Api.Features.Users.Existence;

public class ExistenceFilterEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/users/existence-filter", (IExistenceFilterService filterService) =>
        {
            var bytes = filterService.GetFilter();
            return Results.File(bytes, "application/octet-stream");
        })
        .WithName("GetExistenceFilter")
        .Produces(StatusCodes.Status200OK);
    }
}
