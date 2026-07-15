using Microsoft.EntityFrameworkCore;
using Npgsql.Internal;
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

    public async Task<PaginatedDto<ProviderServiceDto>> GetAll(long? userId, long? serviceId, ProviderServiceFilterDto filter)
    {
      var query = _context.ProviderService.Include(ps => ps.Service).AsNoTracking().AsQueryable();

      if(userId.HasValue)
        query = query.Where(ps => ps.ProviderId == userId);

      // Filtrar por servicio
      if(serviceId.HasValue)
        query = query.Where(ps => ps.ServiceId == serviceId);
      if (!string.IsNullOrWhiteSpace(filter.Name))
        query = query.Where(ps => ps.Service.Name.ToLower().Contains(filter.Name.ToLower()));

      // Filtrar por precio
      if (filter.MinPrice.HasValue)
        query = query.Where(ms => ms.Price >= filter.MinPrice);
      if (filter.MaxPrice.HasValue)
        query = query.Where(ms => ms.Price <= filter.MaxPrice);

      // Filtrar por duracion
      if (filter.MinDurationMinutes.HasValue)
        query = query.Where(ms => ms.DurationMinutes >= filter.MinDurationMinutes);
      if (filter.MaxDurationMinutes.HasValue)
        query = query.Where(ms => ms.DurationMinutes <= filter.MaxDurationMinutes);

      if (filter.IsActive == 1)
      {
        query = query.Where(ps => ps.DeletedAt == null && ps.Service.IsActive == true);
      }else if (filter.IsActive == 0)
      {
        query = query.Where(ps => ps.DeletedAt != null || ps.Service.IsActive == false);
      }      

      var totalCount = await query.CountAsync();

      query = filter.SortBy?.ToLower() switch
      {
        "name" => filter.IsDescending ? query.OrderByDescending(ps => ps.Service.Name) : query.OrderBy(ps => ps.Service.Name),
        "price" => filter.IsDescending ? query.OrderByDescending(ps => ps.Price) : query.OrderBy(ps => ps.Price),
        _ => filter.IsDescending ? query.OrderByDescending(ps => ps.ServiceId) : query.OrderBy(ps => ps.ServiceId)
      };

      var services = await query
        .Skip((filter.PageNumber - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .Select(ps => new ProviderServiceDto
        {
          ProviderId = ps.ProviderId,
          ServiceId = ps.ServiceId,
          Name = ps.Service.Name,
          Description = ps.Service.Description,
          DurationMinutes = ps.DurationMinutes,
          DurationMinutesBase = ps.Service.DurationMinutes,
          Price = ps.Price,
          Status = ps.Service.IsActive == false 
            ? 2
            : (ps.DeletedAt != null ? 0 : 1)
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


        var service = await _context.Service.Where(s => s.Id == createDto.ServiceId || s.IsActive == false).FirstOrDefaultAsync();

        if (service == null) throw new InvalidOperationException("Servicio no disponible.");

        var createPS = new Entity.ProviderService
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

      providerService.DurationMinutes = updateDto.DurationMinutes;
      providerService.Price = updateDto.Price;

      await _context.SaveChangesAsync();
    }

    public async Task SoftDelete(long userId, long serviceId)
    {
      var providerService = await _context.ProviderService.FirstOrDefaultAsync(ps => ps.ProviderId == userId && ps.ServiceId == serviceId);
      if (providerService == null) throw new KeyNotFoundException("Servicio del proveedor no encontrado.");

      if (providerService.DeletedAt != null)
        return;

      providerService.DeletedAt = DateTime.UtcNow;
      await _context.SaveChangesAsync(); 
    }

    public async Task Active(long userId, long serviceId)
    {
      var providerService = await _context.ProviderService.FirstOrDefaultAsync(ps => ps.ProviderId == userId && ps.ServiceId == serviceId);
      if (providerService == null) throw new KeyNotFoundException("Servicio del proveedor no encontrado.");

      if (providerService.DeletedAt == null)
        return;

      providerService.DeletedAt = null;
      await _context.SaveChangesAsync(); 
    }
  }
}