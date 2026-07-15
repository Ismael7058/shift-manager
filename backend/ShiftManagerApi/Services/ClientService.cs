using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class ClientService : IClientService
  {
    private readonly ShiftManagerContext _context;

    public ClientService(ShiftManagerContext context)
    {
      _context = context;
    }

    public async Task<PaginatedDto<ClientDto>> GetAll(ClientFilterDto filter)
    {
      var now = DateTime.UtcNow;
      var query = _context.UserAuths
        .AsNoTracking()
        .Where(u => u.IsActive == true && u.UserRole.Any(ur => ur.Role.Name == "Cliente"))
        .AsQueryable();

      if (!string.IsNullOrWhiteSpace(filter.Name))
        query = query.Where(u =>
            u.UserProfile.FirstName.Contains(filter.Name)
            || u.UserProfile.LastName.Contains(filter.Name)
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
        .Select(u => new ClientDto
        {
          Id = u.UserId,
          FirstName = u.UserProfile.FirstName,
          LastName = u.UserProfile.LastName,
          Username = u.Username,
          Email = u.Email,
          PictureURL = u.UserProfile.PictureURL
        }).ToListAsync();

      return new PaginatedDto<ClientDto>
      {
        Items = users,
        TotalCount = totalCount,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
      };
    }
  }

}
