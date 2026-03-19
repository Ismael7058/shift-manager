using ShiftManagerApi.Data;
using ShiftManagerApi.Interfaces;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ShiftManagerApi.Services
{
  public class AuthService : IAuthService
  {
    private readonly ShiftManagerContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ShiftManagerContext context, IConfiguration configuration)
    {
      _context = context;
      _configuration = configuration;
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
            Gender = profile.Gender,
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

  }
}