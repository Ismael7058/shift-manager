using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class WorkSchedulesService : IWorkSchedulesService
  {
    private readonly ShiftManagerContext _context;

    public WorkSchedulesService(ShiftManagerContext context)
    {
      _context = context;
    }

    public async Task<PaginatedDto<WorkSchedulesDto>> GetAll(long userId, WorkSchedulesFilterDto filter)
    {
      var query = _context.WorkSchedules
        .Where(ms => ms.ProviderId == userId)
        .AsNoTracking()
        .AsQueryable();

      if (filter.DayOfWeek.HasValue)
      {
        query = query.Where(ms => ms.DayOfWeek == filter.DayOfWeek);
      }

      if (filter.IsActive == 1 || filter.IsActive == 0)
        query = query.Where(ms => ms.IsActive == (filter.IsActive == 1));


      var totalCount = await query.CountAsync();

      query = filter.SortBy?.ToLower() switch
      {
        "day_of_week" => filter.IsDescending ? query.OrderByDescending(ms => ms.DayOfWeek) : query.OrderBy(ms => ms.DayOfWeek),
        _ => filter.IsDescending ? query.OrderByDescending(ms => ms.ProviderId) : query.OrderBy(ms => ms.ProviderId)
      };

      var workSchedules = await query
        .Skip((filter.PageNumber - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .Select(wk => new WorkSchedulesDto
        {
          Id = wk.Id,
          ProviderId = wk.ProviderId,
          DayOfWeek = wk.DayOfWeek,
          StartTime = wk.StartTime,
          EndTime = wk.EndTime,
          IsActive = wk.IsActive
        }).ToListAsync();

      return new PaginatedDto<WorkSchedulesDto>
      {
        Items = workSchedules,
        TotalCount = totalCount,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
      };
    }


  }
}