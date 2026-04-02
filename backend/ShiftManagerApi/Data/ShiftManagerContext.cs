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
    public DbSet<Service> Service { get; set; } = null!;
    public DbSet<ProviderService> ProviderService { get; set; } = null!;
    public DbSet<WorkSchedules> WorkSchedules { get; set; } = null!;

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

        // Mapea explícitamente la relación para usar UserId como FK y evitar UserAuthUserId
        entity.HasOne(ur => ur.UserAuth)
              .WithMany(ua => ua.UserRole)
              .HasForeignKey(ur => ur.UserId);

        // Configuración explícita de la relación con Role
        entity.HasOne(ur => ur.Role)
              .WithMany()
              .HasForeignKey(ur => ur.RoleId);
      });

      modelBuilder.Entity<ProviderService>(entity =>
      {
        // Clave primaria compuesta para la tabla ProviderService
        entity.HasKey(ms => new { ms.ProviderId, ms.ServiceId });

        entity.HasOne(ms => ms.Provider)
              .WithMany(up => up.ProviderService)
              .HasForeignKey(ms => ms.ProviderId);

        entity.HasOne(ms => ms.Service)
              .WithMany(s => s.ProviderService)
              .HasForeignKey(ms => ms.ServiceId);
      });

      modelBuilder.Entity<WorkSchedules>(entity =>
      {
        // Configura la relación uno a muchos con UserAuth
        entity.HasOne(d => d.UserAuth)
              .WithMany(p => p.WorkSchedules)
              .HasForeignKey(d => d.ProviderId);
      });
    }
  }
}