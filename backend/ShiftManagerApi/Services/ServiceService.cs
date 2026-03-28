using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class ServiceService : IServiceService
  {
    private readonly ShiftManagerContext _context;

    public ServiceService(ShiftManagerContext context)
    {
      _context = context;
    }

    public async Task<PaginatedDto<ServiceDto>> GetAll(ServiceFilterDto filter)
    {
      var query = _context.Service.AsNoTracking().AsQueryable();

      if (!string.IsNullOrWhiteSpace(filter.Name))
      {
        query = query.Where(u => u.Name.Contains(filter.Name));
      }

      if (!string.IsNullOrWhiteSpace(filter.Name))
      {
        query = query.Where(u => u.DurationMinutes == filter.DurationMinutes);
      }

      if (filter.IsActive == 1 || filter.IsActive == 0)
        query = query.Where(u => u.IsActive == (filter.IsActive == 0 ? false : true));

      var totalCount = await query.CountAsync();

      query = filter.SortBy?.ToLower() switch
      {
        "name" => filter.IsDescending ? query.OrderByDescending(u => u.Name) : query.OrderBy(u => u.Name),
        _ => filter.IsDescending ? query.OrderByDescending(u => u.Id) : query.OrderBy(u => u.Id)
      };

      var services = await query
        .Skip((filter.PageNumber - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .Select(s => new ServiceDto
        {
          Id = s.Id,
          Name = s.Name,
          Description = s.Description,
          DurationMinutes = s.DurationMinutes,
          IsActive = s.IsActive
        }).ToListAsync();
      return new PaginatedDto<ServiceDto>
      {
        Items = services,
        TotalCount = totalCount,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
      };
    }

  }
}