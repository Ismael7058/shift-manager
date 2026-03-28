using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
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

    public async Task<ServiceDto> GetByDto(long id)
    {
      var service = await _context.Service.FirstOrDefaultAsync(s => s.Id == id);

      if (service == null) throw new KeyNotFoundException("Servicio no encontrado");

      var serviceDto = new ServiceDto
      {
          Id = service.Id,
          Name = service.Name,
          Description = service.Description,
          DurationMinutes = service.DurationMinutes,
          IsActive = service.IsActive
      };
      return serviceDto;
    }

    public async Task<ServiceDto> CreateService(CreateServiceDto createServiceDto)
    {
      var service = new Service
      {
        Name = createServiceDto.Name,
        Description = createServiceDto.Description,
        DurationMinutes = createServiceDto.DurationMinutes,
        IsActive = true
      };

      _context.Service.Add(service);
      await _context.SaveChangesAsync();

      return new ServiceDto
      {
        Id = service.Id,
        Name = service.Name,
        Description = service.Description,
        DurationMinutes = service.DurationMinutes,
        IsActive = service.IsActive
      };
    }

    public async Task UpdateService(long id, UpdateServiceDto updateServiceDto)
    {
      var service = await _context.Service.FirstOrDefaultAsync(p => p.Id == id);

      if (service == null) throw new UnauthorizedAccessException("Servicio no encontrados");

      service.Name = updateServiceDto.Name;
      service.Description = updateServiceDto.Description;
      service.DurationMinutes = updateServiceDto.DurationMinutes;

      await _context.SaveChangesAsync();
    }

  }
}