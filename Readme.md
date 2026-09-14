# Shift Manager - Sistema de Gestión de Turnos y Citas

**Shift Manager** es una plataforma web integral diseñada para centralizar, gestionar y optimizar el agendamiento de turnos, la asignación de prestaciones de servicios y el control de horarios laborales entre proveedores de servicios, clientes y personal administrativo o de recepción.

---

## Características Principales
- **Control de Acceso Basado en Roles (RBAC):** Cuatro niveles de usuario (`Administrador`, `Recepcion`, `Proveedor` y `Cliente`) con navegación, vistas y endpoints protegidos.
- **Gestión Integral de Turnos (Citas):**
  - Ciclo de vida completo del turno (`pending`, `confirmed`, `canceled`, `completed`, `no_show`).
  - Auditoría detallada de acciones (registro de quién creó, confirmó o canceló el turno).
  - Congelamiento histórico del precio (`PriceAtMoment`) al reservar para mantener trazabilidad financiera.
- **Catálogo de Servicios y Personalización por Prestador:**
  - Catálogo base de servicios con galería de imágenes asociadas.
  - Cada proveedor puede asociar servicios fijando su propia tarifa monetaria y duración estimada personalizada.
- **Horarios Laborales Flexibles (Work Schedules):**
  - Configuración de franjas de disponibilidad semanal por proveedor (días de la semana, hora de inicio y hora de fin).
- **Generación de Reportes / Comprobantes en PDF:**
  - Emisión y descarga de comprobantes en tiempo real mediante `@react-pdf/renderer`.
- **Seguridad Robusta:**
  - Autenticación mediante tokens JWT transmitidos vía Cookies seguras `HttpOnly`.
  - Hasheo de contraseñas con `BCrypt.Net-Next` (Work Factor 14).
  - Eliminación y desactivación lógica (*Soft Delete*).

---

## Arquitectura y Stack Tecnológico

### Backend
- **Framework:** [ASP.NET Core 9 (Web API)](https://learn.microsoft.com/aspnet/core) (.NET 9.0)
- **ORM:** [Entity Framework Core 9](https://learn.microsoft.com/ef/core/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) con proveedor [Npgsql.EntityFrameworkCore.PostgreSQL](https://www.npgsql.org/efcore/)
- **Seguridad & Auth:** JWT Bearer (Cookies HttpOnly) y [BCrypt.Net-Next](https://github.com/BcryptNet/bcrypt.net)
- **Documentación de API:** Swagger / OpenAPI (Swashbuckle)

### Frontend
- **Framework / Librería:** [React 19](https://react.dev/)
- **Empaquetador y Entorno:** [Vite 8](https://vitejs.dev/)
- **Enrutamiento:** [React Router DOM v7](https://reactrouter.com/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Exportación de Documentos:** [@react-pdf/renderer](https://react-pdf.org/)

---

## Requisitos Previos

Asegúrate de tener instalado en tu entorno local:

- **[.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)** o superior.
- **[Node.js](https://nodejs.org/)** (v20.x o superior) y gestor de paquetes **npm** (v10+).
- **[PostgreSQL](https://www.postgresql.org/)** (v15 o superior) en ejecución local o remota.

---

## Instalación y Puesta en Marcha

### 1. Backend (ASP.NET Core 9)

1. Dirígete a la carpeta del proyecto backend:
   ```bash
   cd backend/ShiftManagerApi
   ```

2. Configura tu cadena de conexión en `appsettings.json` (o mediante `appsettings.Development.json`):
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Port=5432;Database=ShiftManagerDb;User ID=postgres;Password=TU_PASSWORD;"
   }
   ```

3. Aplica las migraciones de Entity Framework para generar las tablas y esquemas en PostgreSQL:
   ```bash
   dotnet ef database update
   ```

4. **Poblado de datos iniciales (Seed de Roles y Admin - Opcional / Recomendado):**
   El sistema requiere la existencia de los roles base (`Administrador`, `Recepcion`, `Proveedor`, `Cliente`) para la asignación de permisos y control de acceso (RBAC):
   - Los roles y el usuario Administrador inicial se encuentran definidos en [`backend/ShiftManagerApi/Data/DbSeeder.cs`](backend/ShiftManagerApi/Data/DbSeeder.cs).
   - Credenciales iniciales generadas por el Seeder:
     - **Usuario:** `admin` (o `admin@shiftmanager.com`)
     - **Contraseña:** `Admin123!`
   - Para ejecutarlos automáticamente al arrancar la API, descomenta el bloque de inicialización en [`backend/ShiftManagerApi/Program.cs`](backend/ShiftManagerApi/Program.cs):
     ```csharp
     using (var scope = app.Services.CreateScope())
     {
       var dbContext = scope.ServiceProvider.GetRequiredService<ShiftManagerContext>();
       dbContext.Database.Migrate();
       DbSeeder.Seed(dbContext);
     }
     ```

5. Ejecuta el servidor backend:
   ```bash
   dotnet run
   ```
   - La API iniciará de forma predeterminada en `http://localhost:5256`.
   - Podrás acceder a la documentación interactiva de Swagger en: [http://localhost:5256/swagger](http://localhost:5256/swagger).

---

### 2. Frontend (React 19 + Vite)

1. Abre una nueva terminal y navega al directorio del cliente frontend:
   ```bash
   cd frontend/ShiftManagerApp
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Crea o verifica el archivo `.env` tomando como base `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5256
   ```

4. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   - La aplicación web estará accesible en [http://localhost:5173](http://localhost:5173).

---

## Variables de Entorno y Configuración

### Backend (`appsettings.json`)
| Clave | Descripción | Ejemplo / Valor por Defecto |
| :--- | :--- | :--- |
| `ConnectionStrings:DefaultConnection` | Cadena de conexión a la base PostgreSQL | `Server=localhost;Port=5432;Database=ShiftManagerDb;...` |
| `Jwt:Key` | Clave secreta simétrica para firmar JWT | Cadena alfanumérica segura |
| `Jwt:Issuer` | Emisor del token | `http://localhost:5256` |
| `Jwt:Audience` | Audiencia destinataria del token | `http://localhost:5256` |
| `Jwt:ExpirationInMinutes` | Tiempo de expiración del token de sesión | `30` |
| `BCrypt:WorkFactor` | Complejidad de rondas de hash de contraseñas | `14` |

### Frontend (`.env`)
| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API backend para solicitudes HTTP | `http://localhost:5256` |
