using FluentAssertions;
using UserManagementSystem.Api.Domain;

namespace UserManagementSystem.Tests.Domain;

public class UserTests
{
    [Fact]
    public void SoftDelete_Should_Set_DeletedAt_And_Keep_Other_Data_Intact()
    {
        // Arrange (Preparação)
        var userType = Guid.NewGuid();
        var user = User.Create("Luis Melo", "luisinacio@gmail.com", userType);

        // Act (Ação)
        user.SoftDelete();

        // Assert (Validação)
        user.DeletedAt.Should().NotBeNull();
        user.DeletedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        user.Name.Should().Be("Luis Melo"); // Garante que a entidade não foi esvaziada
    }
}