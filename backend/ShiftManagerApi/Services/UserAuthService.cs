using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class UserAuthService : IUserAuthService
  {
    private readonly ShiftManagerContext _context;
    private readonly IConfiguration _configuration;

    public UserAuthService(ShiftManagerContext context, IConfiguration configuration)
    {
      _context = context;
      _configuration = configuration;
    }

    public async Task<PaginatedDto<UserDto>> GetAll(UserFilterDto filter)
    {
      var query = _context.UserAuths
        .AsNoTracking()
        .AsQueryable();

      if (!string.IsNullOrWhiteSpace(filter.Name))
        query = query.Where(u =>
            u.UserProfile.FirstName.Contains(filter.Name)
            || u.UserProfile.LastName.Contains(filter.Name)
        );

      if (!string.IsNullOrWhiteSpace(filter.Email))
        query = query.Where(u => u.Email.Contains(filter.Email));

      if (filter.Role != null)
        query = query.Where(u => u.UserRole.Any(r => r.RoleId == filter.Role));

      if (filter.IsActive == 1 || filter.IsActive == 0)
        query = query.Where(u => u.IsActive == (filter.IsActive == 0 ? false : true));


      var totalCount = await query.CountAsync();


      query = filter.SortBy?.ToLower() switch
      {
        "name" => filter.IsDescending
            ? query.OrderByDescending(u => u.UserProfile.FirstName).ThenByDescending(u => u.UserProfile.LastName)
            : query.OrderBy(u => u.UserProfile.FirstName).ThenBy(u => u.UserProfile.LastName),
        "email" => filter.IsDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
        "username" => filter.IsDescending ? query.OrderByDescending(u => u.Username) : query.OrderBy(u => u.Username),
        _ => filter.IsDescending ? query.OrderByDescending(u => u.UserId) : query.OrderBy(u => u.UserId)
      };


      var users = await query
        .Skip((filter.PageNumber - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .Select(u => new UserDto
        {
          Id = u.UserId,
          FirstName = u.UserProfile.FirstName,
          LastName = u.UserProfile.LastName,
          DateOfBirth = u.UserProfile.DateOfBirth,
          Gender = u.UserProfile.Gender.ToString(),
          PhoneNumber = u.UserProfile.PhoneNumber,
          Username = u.Username,
          Email = u.Email,
          Roles = u.UserRole.Select(ur => ur.Role.Name).OrderBy(n => n).ToList()
        }
        )
        .ToListAsync();

      return new PaginatedDto<UserDto>
      {
        Items = users,
        TotalCount = totalCount,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
      };
    }


    public async Task<UserDto> CreateUser(CreateUserDto createUserDto)
    {
      var strategy = _context.Database.CreateExecutionStrategy();

      var userDto = await strategy.ExecuteAsync(async () =>
      {
        var exists = await _context.UserAuths.AnyAsync(u => u.Email == createUserDto.Email || u.Username == createUserDto.Username);
        if (exists)
        {
          throw new InvalidOperationException("El username o email ya esta registrado.");
        }

        var roles = await _context.Roles.Where(r => createUserDto.RolesId.Contains(r.Id)).Select(r => r.Name).ToListAsync();
        if ( createUserDto.RolesId.LongCount() != roles.LongCount() )
        {
          throw new InvalidOperationException("Uno de los roles no fue encontrado");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
          // Crear UserProfile
          var profile = new UserProfile
          {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            DateOfBirth = createUserDto.DateOfBirth,
            Gender = createUserDto.Gender,
            PhoneNumber = createUserDto.PhoneNumber,
            CreatedAt = DateTime.UtcNow
          };

          _context.UserProfiles.Add(profile);
          await _context.SaveChangesAsync();

          // Crear UserAuth
          var userAuth = new UserAuth
          {
            UserId = profile.Id,
            Username = createUserDto.Username,
            Email = createUserDto.Email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            PasswordHash = BC.EnhancedHashPassword(createUserDto.Password, _configuration.GetValue<int>("BCrypt:WorkFactor", 13))
          };

          _context.UserAuths.Add(userAuth);
          await _context.SaveChangesAsync();

          // Crear UserRole
          foreach (var rolId in createUserDto.RolesId)
          {
            var userRole = new UserRole
            {
              UserId = profile.Id,
              RoleId = rolId,
              AssignedAt = DateTime.UtcNow
            };
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();
          }

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
            Email = userAuth.Email,
            Roles = roles
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

    public async Task UpdateUser(long id, UpdateUserDto updateUserDto)
    {
      var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.Id == id);

      if (profile == null) throw new UnauthorizedAccessException("Usuario no encontrados");

      profile.FirstName = updateUserDto.FirstName;
      profile.LastName = updateUserDto.LastName;
      profile.DateOfBirth = updateUserDto.DateOfBirth;
      profile.Gender = updateUserDto.Gender;
      profile.PhoneNumber = updateUserDto.PhoneNumber;

      await _context.SaveChangesAsync();
    }
  }
}
