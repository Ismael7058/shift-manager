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

    public UserAuthService(ShiftManagerContext context)
    {
      _context = context;
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
        _ => query.OrderBy(u => u.UserId)
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
  }
}
