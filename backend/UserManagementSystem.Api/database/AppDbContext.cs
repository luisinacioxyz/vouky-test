using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Domain;

namespace UserManagementSystem.Api.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);


            entity.HasIndex(e => e.Email)
                  .IsUnique()
                  .HasFilter("\"DeletedAt\" IS NULL"); 
        });
    }
}