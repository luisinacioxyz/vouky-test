namespace UserManagementSystem.Api.Domain;

public sealed class User
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public Guid UserType { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    private User() { }

    public static User Create(string name, string email, Guid userType)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Name = name,
            Email = email.ToLowerInvariant().Trim(), // Sanitização defensiva
            UserType = userType,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, Guid userType)
    {
        Name = name;
        UserType = userType;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete()
    {
        if (DeletedAt.HasValue)
            return; 

        DeletedAt = DateTime.UtcNow;
    }
}