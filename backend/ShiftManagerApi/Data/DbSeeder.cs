using ShiftMangerApi.Entity;

namespace ShiftMangerApi.Data
{
    public static class DbSeeder
    {
        public static void Seed(ShiftManagerContext context)
        {
            // Verificar si ya existen roles en la base de datos
            if (context.Roles.Any())
            {
                return;
            }

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
    }
}
