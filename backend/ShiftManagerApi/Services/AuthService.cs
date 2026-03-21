using ShiftManagerApi.Data;
using ShiftManagerApi.Interfaces;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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

    public async Task<AuthTokenDto> Login(LoginDto loginDto)
    {
      var userAuth = await _context.UserAuths
          .Include(u => u.UserProfile)
          .FirstOrDefaultAsync(u => u.Email == loginDto.Identifier || u.Username == loginDto.Identifier);

      if (userAuth == null || !BC.EnhancedVerify(loginDto.Password, userAuth.PasswordHash))
        throw new UnauthorizedAccessException("Credenciales inválidas");

      var userProfile = userAuth.UserProfile;
      if (userProfile == null){
        userProfile = await _context.UserProfiles.FindAsync(userAuth.UserId);
      }

      var roles = await _context.UserRoles
          .Where(ur => ur.UserId == userAuth.UserId)
          .Include(ur => ur.Role)
          .Select(ur => ur.Role.Name)
          .ToListAsync();

      var claims = new List<Claim>
      {
          new Claim(JwtRegisteredClaimNames.Sub, userAuth.Username),
          new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
          new Claim(ClaimTypes.NameIdentifier, userAuth.UserId.ToString()),
          new Claim(ClaimTypes.Email, userAuth.Email)
      };

      if (userProfile != null)
      {
        claims.Add(new Claim(ClaimTypes.GivenName, userProfile.FirstName));
        claims.Add(new Claim(ClaimTypes.Surname, userProfile.LastName));
      }

      claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: _configuration["Jwt:Issuer"],
          audience: _configuration["Jwt:Audience"],
          claims: claims,
          expires: DateTime.UtcNow.AddMinutes(15),
          signingCredentials: creds
      );

      var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

      var userDto = new UserDto
      {
        Username = userAuth.Username,
        Email = userAuth.Email
      };

      if (userProfile != null)
      {
        userDto.Id = userProfile.Id;
        userDto.FirstName = userProfile.FirstName;
        userDto.LastName = userProfile.LastName;
        userDto.DateOfBirth = userProfile.DateOfBirth;
        userDto.Gender = userProfile.Gender;
        userDto.PhoneNumber = userProfile.PhoneNumber;
      }

      return new AuthTokenDto
      {
        AccessToken = accessToken,
        Expiration = DateOnly.FromDateTime(DateTime.UtcNow.AddMinutes(15)),
        User = userDto
      };
    }

  }
}