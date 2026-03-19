using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Data
{
  public class ShiftManagerContext : DbContext
  {
    public ShiftManagerContext(DbContextOptions<ShiftManagerContext> options) : base(options)
    {

    }

    public DbSet<UserProfile> UserProfiles { get; set; } = null!;
    public DbSet<UserAuth> UserAuths { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<UserRole> UserRoles { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      // Configura EF Core para usar columnas Identity de PostgreSQL por defecto
      modelBuilder.UseIdentityByDefaultColumns();

      modelBuilder.Entity<UserAuth>(entity =>
      {
        // Configura UserId como la clave primaria para UserAuth
        entity.HasKey(e => e.UserId);

        // Configura la relación uno a uno con UserProfile
        entity.HasOne(d => d.UserProfile)
              .WithOne(p => p.UserAuth)
              .HasForeignKey<UserAuth>(d => d.UserId);
      });

      modelBuilder.Entity<UserRole>(entity =>
      {
        // Configura la clave primaria compuesta para la tabla de unión UserRole
        entity.HasKey(e => new { e.UserId, e.RoleId });
      });
    }
  }
}