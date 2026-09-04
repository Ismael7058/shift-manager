using Microsoft.EntityFrameworkCore;
using Npgsql.Internal;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class ProviderService : IProviderService
  {
    private readonly ShiftManagerContext _context;
    private readonly IConfiguration _configuration;

    public ProviderService(ShiftManagerContext context, IConfiguration configuration)
    {
      _context = context;
      _configuration = configuration;
    }

    public async Task<PaginatedDto<ProviderDto>> GetAll(ProviderFilterDto filter)
    {
      var now = DateTime.UtcNow;
      var query = _context.UserAuths
        .AsNoTracking()
        .Where(u => u.IsActive == true && u.UserRole.Any(ur => ur.Role.Name == "Proveedor"))
        .AsQueryable();

      if (!string.IsNullOrWhiteSpace(filter.Name))
        query = query.Where(u =>
            u.UserProfile.FirstName.ToLower().Contains(filter.Name.ToLower())
            || u.UserProfile.LastName.ToLower().Contains(filter.Name.ToLower())
        );

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
        .Select(u => new ProviderDto
        {
          Id = u.UserId,
          FirstName = u.UserProfile.FirstName,
          LastName = u.UserProfile.LastName,
          PictureURL = u.UserProfile.PictureURL,
        }

        )
        .ToListAsync();

      return new PaginatedDto<ProviderDto>
      {
        Items = users,
        TotalCount = totalCount,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
      };
    }

    public async Task<ProviderDto> GetById(long id)
    {
      var user = await _context.UserAuths
        .Include(u => u.UserProfile)
        .FirstOrDefaultAsync(u => u.UserId == id);

      if (user == null) throw new KeyNotFoundException("Usuario no encontrado");

      var userDto = new ProviderDto
      {
        Id = user.UserId,
        FirstName = user.UserProfile.FirstName,
        LastName = user.UserProfile.LastName,
        PictureURL = user.UserProfile.PictureURL
      };

      return userDto;
    }
  }

}
