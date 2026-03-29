using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class ProviderServiceService : IProviderServiceService
  {
    private readonly ShiftManagerContext _context;

    public ProviderServiceService(ShiftManagerContext context)
    {
      _context = context;
    }

    public async Task<PaginatedDto<ProviderServiceDto>> GetAll(long userId, ProviderServiceFilterDto filter)
    {
      var query = _context.ProviderService
        .Include(ms => ms.Service)
        .Where(ms => ms.ProviderId == userId)
        .AsNoTracking()
        .AsQueryable();

      if (!string.IsNullOrWhiteSpace(filter.Name))
      {
        query = query.Where(ms => ms.Service.Name.Contains(filter.Name));
      }

      if (filter.DurationMinutes.HasValue)
      {
        query = query.Where(ms => ms.DurationMinutes == filter.DurationMinutes);
      }

      if (filter.IsActive == 1 || filter.IsActive == 0)
        query = query.Where(ms => ms.Service.IsActive == (filter.IsActive == 1));

      if (filter.Price.HasValue)
      {
        query = query.Where(ms => ms.Price == filter.Price);
      }

      var totalCount = await query.CountAsync();

      query = filter.SortBy?.ToLower() switch
      {
        "name" => filter.IsDescending ? query.OrderByDescending(ms => ms.Service.Name) : query.OrderBy(ms => ms.Service.Name),
        "price" => filter.IsDescending ? query.OrderByDescending(ms => ms.Price) : query.OrderBy(ms => ms.Price),
        _ => filter.IsDescending ? query.OrderByDescending(ms => ms.ServiceId) : query.OrderBy(ms => ms.ServiceId)
      };

      var services = await query
        .Skip((filter.PageNumber - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .Select(ms => new ProviderServiceDto
        {
          ProviderId = ms.ProviderId,
          ServiceId = ms.ServiceId,
          Name = ms.Service.Name,
          Description = ms.Service.Description,
          DurationMinutes = ms.DurationMinutes,
          DurationMinutesBase = ms.Service.DurationMinutes,
          Price = ms.Price
        }).ToListAsync();

      return new PaginatedDto<ProviderServiceDto>
      {
        Items = services,
        TotalCount = totalCount,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
      };
    }

    public async Task<ProviderServiceDto> GetById(long userId, long serviceId)
    {
      var providerService = await _context.ProviderService.Include(ps => ps.Service).FirstOrDefaultAsync(ps => 
        ps.ProviderId == userId 
        && ps.ServiceId == serviceId
      );

      if (providerService == null) throw new KeyNotFoundException("Servicio del proveedor no encontrado");

      var psDto = new ProviderServiceDto
      {
        ProviderId = providerService.ProviderId,
        ServiceId = providerService.ServiceId,
        Name = providerService.Service.Name,
        Description = providerService.Service.Description,
        DurationMinutes = providerService.DurationMinutes,
        DurationMinutesBase = providerService.Service.DurationMinutes,
        Price = providerService.Price
      };

      return psDto;
    }

    public async Task<ProviderServiceDto> Create(long userId, CreateProviderServiceDto createDto)
    {
        var providerService = await _context.ProviderService.Include(ps => ps.Service).FirstOrDefaultAsync(ps => ps.ProviderId == userId && ps.ServiceId == createDto.ServiceId);

        if (providerService != null) throw new InvalidOperationException("El proveedor ya tiene registrado este servicio.");


        var service = await _context.Service.Where(s => s.Id == createDto.ServiceId).FirstOrDefaultAsync();

        if (service == null) throw new InvalidOperationException("Servicio no disponible.");

        var createPS = new ProviderService
        {
          ProviderId = userId,
          ServiceId = createDto.ServiceId,
          DurationMinutes = createDto.DurationMinutes,
          Price = createDto.Price
        };

        _context.ProviderService.Add(createPS);
        await _context.SaveChangesAsync();

        return new ProviderServiceDto
        {
        ProviderId = userId,
        ServiceId = createPS.ServiceId,
        Name = service.Name,
        Description = service.Description,
        DurationMinutes = createPS.DurationMinutes,
        DurationMinutesBase = service.DurationMinutes,
        Price = createPS.Price
        };
    }

    public async Task Update(long userId, long serviceId, UpdateProviderServiceDto updateDto)
    {
      var providerService = await _context.ProviderService.Include(ps => ps.Service).FirstOrDefaultAsync(ps => ps.ProviderId == userId && ps.ServiceId == serviceId);
      if (providerService == null) throw new InvalidOperationException("Servicio del proveedor no encontrado.");

      var service = await _context.Service.Where(s => s.Id == updateDto.ServiceId).FirstOrDefaultAsync();
      if (service == null) throw new InvalidOperationException("Servicio no disponible.");

      providerService.ServiceId = updateDto.ServiceId;
      providerService.DurationMinutes = updateDto.DurationMinutes;
      providerService.Price = updateDto.Price;

      await _context.SaveChangesAsync();
    }

    public async Task Delete(long userId, long serviceId)
    {
      var providerService = await _context.ProviderService.FirstOrDefaultAsync(ps => ps.ProviderId == userId && ps.ServiceId == serviceId);
      if (providerService == null) throw new KeyNotFoundException("Servicio del proveedor no encontrado.");

      _context.ProviderService.Remove(providerService);

      await _context.SaveChangesAsync(); 
    }
  }
}