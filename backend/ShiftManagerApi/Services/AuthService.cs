using ShiftManagerApi.Data;
using ShiftManagerApi.Interfaces;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using Microsoft.EntityFrameworkCore;

namespace ShiftManagerApi.Services
{
  public class AuthService : IAuthService
  {
    private readonly ShiftManagerContext _context;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;
    private readonly ICookieService _cookieService;

    public AuthService(ShiftManagerContext context, IConfiguration configuration, ITokenService tokenService, ICookieService cookieService)
    {
      _context = context;
      _configuration = configuration;
      _tokenService = tokenService;
      _cookieService = cookieService;
    }

    public async Task<UserDto> Register(RegisterDto registerDto)
    {
      var strategy = _context.Database.CreateExecutionStrategy();

      var userDto = await strategy.ExecuteAsync(async () =>
      {
        var exists = await _context.UserAuths.AnyAsync(u => u.Email == registerDto.Email || u.Username == registerDto.Username);
        if (exists)
        {
          throw new InvalidOperationException("El username o email ya esta registrado.");
        }

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Cliente");
        if (role == null)
        {
          throw new InvalidOperationException("El rol 'Cliente' no existe en la base de datos.");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
          // Crear UserProfile
          var profile = new UserProfile
          {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            DateOfBirth = registerDto.DateOfBirth,
            Gender = registerDto.Gender,
            PhoneNumber = registerDto.PhoneNumber,
            CreatedAt = DateTime.UtcNow
          };

          _context.UserProfiles.Add(profile);
          await _context.SaveChangesAsync();

          // Crear UserAuth
          var userAuth = new UserAuth
          {
            UserId = profile.Id,
            Username = registerDto.Username,
            Email = registerDto.Email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            PasswordHash = BC.EnhancedHashPassword(registerDto.Password, _configuration.GetValue<int>("BCrypt:WorkFactor", 13))
          };

          _context.UserAuths.Add(userAuth);
          await _context.SaveChangesAsync();

          // Crear UserRole
          var userRole = new UserRole
          {
            UserId = profile.Id,
            RoleId = role.Id,
            AssignedAt = DateTime.UtcNow
          };

          _context.UserRoles.Add(userRole);
          await _context.SaveChangesAsync();

          await transaction.CommitAsync();

          // Mapear a UserDto
          return new UserDto
          {
            Id = profile.Id,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            DateOfBirth = profile.DateOfBirth,
            Gender = profile.Gender.ToString(),
            PhoneNumber = profile.PhoneNumber,
            Username = userAuth.Username,
            Email = userAuth.Email
          };
        }
        catch
        {
          await transaction.RollbackAsync();
          throw;
        }
      });

      return userDto;
    }

    public async Task<AuthTokenDto> Login(LoginDto loginDto)
    {
      var userAuth = await _context.UserAuths
          .Include(u => u.UserProfile)
          .FirstOrDefaultAsync(u => u.Email == loginDto.Identifier || u.Username == loginDto.Identifier);

      if (userAuth == null || !BC.EnhancedVerify(loginDto.Password, userAuth.PasswordHash))
        throw new UnauthorizedAccessException("Credenciales inválidas");

      var roles = await _context.UserRoles
          .Where(ur => ur.UserId == userAuth.UserId)
          .Include(ur => ur.Role)
          .Select(ur => ur.Role.Name)
          .ToListAsync();

      var activeRole = roles.OrderBy(r => r).FirstOrDefault() ?? throw new InvalidOperationException("El usuario no tiene roles asignados.");

      var accessToken = _tokenService.GenerateToken(userAuth, userAuth.UserProfile, roles, activeRole);

      var userDto = new UserDto
      {
        Username = userAuth.Username,
        Email = userAuth.Email,
        Id = userAuth.UserProfile.Id,
        FirstName = userAuth.UserProfile.FirstName,
        LastName = userAuth.UserProfile.LastName,
        DateOfBirth = userAuth.UserProfile.DateOfBirth,
        Gender = userAuth.UserProfile.Gender.ToString(),
        PhoneNumber = userAuth.UserProfile.PhoneNumber,
        Roles = roles
      };

      return new AuthTokenDto
      {
        AccessToken = accessToken,
        Expiration = DateOnly.FromDateTime(DateTime.UtcNow.AddMinutes(15)),
        User = userDto,
        RoleActive = activeRole
      };
    }

    public async Task GenerateAndSetTokenCookie(long userId, RoleDto? role)
    {
      var userAuth = await _context.UserAuths
          .Include(u => u.UserProfile)
          .FirstOrDefaultAsync(u => u.UserId == userId);

      if (userAuth == null) throw new UnauthorizedAccessException("Usuario no encontrado");

      var roles = await _context.UserRoles
          .Where(ur => ur.UserId == userId)
          .Include(ur => ur.Role)
          .Select(ur => ur.Role.Name)
          .ToListAsync();


      string activeRole = 
        (role != null ) ? 
          roles.FirstOrDefault(r => string.Equals(r, role.Name, StringComparison.OrdinalIgnoreCase)) 
            ?? throw new InvalidOperationException($"El usuario no tiene el rol {role.Name}.")
        : roles.OrderBy(r => r).FirstOrDefault() ?? throw new InvalidOperationException("El usuario no tiene roles asignados.");

      var accessToken = _tokenService.GenerateToken(userAuth, userAuth.UserProfile, roles, activeRole);
      _cookieService.SetTokenCookie(accessToken);
    }
  }
}