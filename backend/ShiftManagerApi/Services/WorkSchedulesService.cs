using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
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

    public async Task<WorkSchedulesDto> GetById(long userId, long workSchedulesId)
    {
      var workSchedules = await _context.WorkSchedules.FirstOrDefaultAsync(ps =>
        ps.ProviderId == userId
        && ps.Id == workSchedulesId
      );

      if (workSchedules == null) throw new KeyNotFoundException("Horario de trabajo no encontrado");

      var psDto = new WorkSchedulesDto
      {
        Id = workSchedules.Id,
        ProviderId = workSchedules.ProviderId,
        DayOfWeek = workSchedules.DayOfWeek,
        StartTime = workSchedules.StartTime,
        EndTime = workSchedules.EndTime,
        IsActive = workSchedules.IsActive
      };

      return psDto;
    }

    public async Task<WorkSchedulesDto> Create(long userId, CreateWorkSchedulesDto createDto)
    {
      var workSchedules = await _context.WorkSchedules.FirstOrDefaultAsync(ws =>
        ws.ProviderId == userId
        && ws.DayOfWeek == createDto.DayOfWeek
        && ws.IsActive == true
      );

      if (workSchedules != null) throw new InvalidOperationException("El proveedor ya tiene registrado un horario en el mismo dia.");

      var createWK = new WorkSchedules
      {
        ProviderId = userId,
        DayOfWeek = createDto.DayOfWeek,
        StartTime = createDto.StartTime,
        EndTime = createDto.EndTime,
        IsActive = true
      };

      _context.WorkSchedules.Add(createWK);
      await _context.SaveChangesAsync();

      return new WorkSchedulesDto
      {
        Id = createWK.Id,
        ProviderId = userId,
        DayOfWeek = createWK.DayOfWeek,
        StartTime = createWK.StartTime,
        EndTime = createWK.EndTime,
        IsActive = createWK.IsActive
      };
    }

  }
}