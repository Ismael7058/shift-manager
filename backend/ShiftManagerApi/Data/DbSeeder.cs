using ShiftManagerApi.Data;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Data
{
    public static class DbSeeder
    {
        public static void Seed(ShiftManagerContext context)
        {
            // 1. Verificar y crear los roles base si no existen
            if (!context.Roles.Any())
            {
                var roles = new Role[]
                {
                    new Role { Name = "Administrador", Description = "Acceso total al sistema", CreatedAt = DateTime.UtcNow },
                    new Role { Name = "Recepcion", Description = "Encargado de recepcion", CreatedAt = DateTime.UtcNow },
                    new Role { Name = "Proveedor", Description = "Proveedor de servicios", CreatedAt = DateTime.UtcNow },
                    new Role { Name = "Cliente", Description = "Cliente del sistema", CreatedAt = DateTime.UtcNow }
                };

                context.Roles.AddRange(roles);
                context.SaveChanges();
            }

            // 2. Verificar y crear el usuario Administrador por defecto si no existe
            if (!context.UserAuths.Any(u => u.Username == "admin" || u.Email == "admin@shiftmanager.com"))
            {
                var adminRole = context.Roles.First(r => r.Name == "Administrador");

                // Crear UserProfile
                var adminProfile = new UserProfile
                {
                    FirstName = "Admin",
                    LastName = "Sistema",
                    DateOfBirth = new DateOnly(1990, 1, 1),
                    Gender = GenderType.other,
                    PhoneNumber = "+1234567890",
                    CreatedAt = DateTime.UtcNow
                };

                context.UserProfiles.Add(adminProfile);
                context.SaveChanges();

                // Crear UserAuth con contraseña hasheada mediante BCrypt
                var adminAuth = new UserAuth
                {
                    UserId = adminProfile.Id,
                    Username = "admin",
                    Email = "admin@shiftmanager.com",
                    PasswordHash = BC.EnhancedHashPassword("Admin123!", 13),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.UserAuths.Add(adminAuth);

                // Asignar el rol de Administrador mediante UserRole
                var adminUserRole = new UserRole
                {
                    UserId = adminProfile.Id,
                    RoleId = adminRole.Id,
                    AssignedAt = DateTime.UtcNow
                };

                context.UserRoles.Add(adminUserRole);
                context.SaveChanges();
            }
        }
    }
}
