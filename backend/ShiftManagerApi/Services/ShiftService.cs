using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class ShiftService : IShiftService
  {
    private readonly ShiftManagerContext _context;

    public ShiftService(ShiftManagerContext context)
    {
      _context = context;
    }

    public async Task ChangeStatus(long shiftId, ShiftStatus status)
    {
      var shift = await _context.Shift.FirstOrDefaultAsync(s => s.Id == shiftId);
      if (shift == null) throw new KeyNotFoundException("Turno no encontrado");

      if (shift.Status == ShiftStatus.canceled || shift.Status == ShiftStatus.completed)
      {
        throw new InvalidOperationException("El turno no puede ser modificado porque ya se encuentra en un estado final.");
      }

      if (shift.Status == status) return;

      shift.Status = status;
      await _context.SaveChangesAsync();
    }

    public async Task<ShiftDto> Create(CreateShiftDto createDto)
    {
      var strategy = _context.Database.CreateExecutionStrategy();

      var shift = await strategy.ExecuteAsync(async () =>
      {
        var cliente = await _context.UserAuths.FirstOrDefaultAsync(us => 
          us.UserId == createDto.ClientId && 
          us.IsActive == true &&
          us.UserRole.Any(u => u.Role.Name == "Cliente")
        );
        if (cliente == null) throw new InvalidOperationException("Cliente no encontrado");

        var provider = await _context.UserAuths.FirstOrDefaultAsync(us => 
          us.UserId == createDto.ProviderId && 
          us.IsActive == true &&
          us.UserRole.Any(u => u.Role.Name == "Proveedor")
        );
        if (provider == null) throw new InvalidOperationException("Proveedor no encontrado");

        var serviceIds = createDto.Items.Select(i => i.ServiceId).ToList();
        var existServices = await _context.ProviderService
          .Include(ps => ps.Service)
          .Where(ps => ps.ProviderId == createDto.ProviderId && serviceIds.Contains(ps.ServiceId) && ps.Service.IsActive == true)
          .ToListAsync();

        if (existServices.Count != serviceIds.Count) throw new InvalidOperationException("Uno o más servicios no están disponibles para este proveedor.");

        int totalDuration = existServices.Sum(item => item.DurationMinutes);
        var endAt = createDto.StartAt.AddMinutes(totalDuration);

        var horarios = await _context.WorkSchedules.FirstOrDefaultAsync(ws => 
          ws.ProviderId == createDto.ProviderId 
          && ws.IsActive == true 
          && ws.DayOfWeek == (int)createDto.StartAt.DayOfWeek
        );

        if (horarios == null) throw new InvalidOperationException("El proveedor no trabaja este día.");

        var startShiftTime = TimeOnly.FromDateTime(createDto.StartAt);
        var endShiftTime = TimeOnly.FromDateTime(endAt);

        if (startShiftTime < horarios.StartTime || endShiftTime > horarios.EndTime)
          throw new InvalidOperationException("El horario solicitado está fuera de la jornada laboral del proveedor.");

        // Validar si existe otro turno con el mismo proveedor que se solape con el turno nuevo 
        var isOverlapping = await _context.Shift.AnyAsync(s => 
          s.ProviderId == createDto.ProviderId &&
          s.Status != ShiftStatus.canceled &&
          s.StartAt < endAt && s.EndAt > createDto.StartAt
        );
        if (isOverlapping) throw new InvalidOperationException("El proveedor ya tiene un turno asignado en este horario.");

        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
          var newShift = new Shift
          {
            ProviderId = createDto.ProviderId,
            ClientId = createDto.ClientId,
            StartAt = createDto.StartAt,
            EndAt = endAt,
            Status = ShiftStatus.pending,          
            CreatedAt = DateTime.UtcNow
          };

          _context.Shift.Add(newShift);
          await _context.SaveChangesAsync();

          foreach (var item in existServices)
          {
            _context.ShiftItems.Add(new ShiftItems
            {
              ShiftId = newShift.Id,
              ServiceId = item.ServiceId,
              PriceAtMoment = item.Price
            });
          }
          await _context.SaveChangesAsync();

          await transaction.CommitAsync();

          var clientProfile = await _context.UserProfiles.FindAsync(cliente.UserId);
          var providerProfile = await _context.UserProfiles.FindAsync(provider.UserId);

          return new ShiftDto
          {
            Id = newShift.Id,
            ProviderId = newShift.ProviderId,
            ProviderFullName = $"{providerProfile?.FirstName} {providerProfile?.LastName}",
            ClientId = newShift.ClientId,
            ClientFullName = $"{clientProfile?.FirstName} {clientProfile?.LastName}",
            StartAt = newShift.StartAt,
            EndAt = newShift.EndAt,
            Status = newShift.Status.ToString(),
            CreatedAt = newShift.CreatedAt,
            Items = existServices.Select(es => new ShiftItemDto
            {
              ServiceId = es.ServiceId,
              NameService = es.Service.Name,
              DurationMinutes = es.DurationMinutes,
              PriceAtMoment = es.Price
            }).ToList()
          };
        }
        catch
        {
          await transaction.RollbackAsync();
          throw;
        }
      });
      return shift;
    }

    public async Task<ShiftDto> GetById(long shiftId)
    {
      var shift = await _context.Shift
          .Include(s => s.Client).ThenInclude(c => c.UserProfile)
          .Include(s => s.Provider).ThenInclude(p => p.UserProfile)
          .Include(s => s.ShiftItems).ThenInclude(si => si.Service)
          .FirstOrDefaultAsync(s => s.Id == shiftId);

      if (shift == null) throw new KeyNotFoundException("Turno no encontrado");

      return new ShiftDto
      {
        Id = shift.Id,
        ProviderId = shift.ProviderId,
        ProviderFullName = $"{shift.Provider.UserProfile.FirstName} {shift.Provider.UserProfile.LastName}",
        ClientId = shift.ClientId,
        ClientFullName = $"{shift.Client.UserProfile.FirstName} {shift.Client.UserProfile.LastName}",
        StartAt = shift.StartAt,
        EndAt = shift.EndAt,
        Status = shift.Status.ToString(),
        CreatedAt = shift.CreatedAt,
        Items = shift.ShiftItems.Select(si => new ShiftItemDto
        {
          ServiceId = si.ServiceId,
          NameService = si.Service.Name,
          DurationMinutes = si.Service.DurationMinutes,
          PriceAtMoment = si.PriceAtMoment
        }).ToList()
      };
    }

    public async Task<PaginatedDto<ShiftDto>> GetShifts(long? providerId, long? clientId, ShiftFilterDto filter)
    {
     var query = _context.Shift
        .AsQueryable();

      if (providerId.HasValue)
      {
        query = query.Where(ms => ms.ProviderId == providerId);
      }
      if (clientId.HasValue)
      {
        query = query.Where(ms => ms.ClientId == clientId);
      }
      if (filter.ServiceId.HasValue)
      {
        query = query.Where(ms => ms.ShiftItems.Any(si => si.ServiceId == filter.ServiceId));
      }
      if (filter.DateFrom.HasValue)
      {
        query = query.Where(ms => ms.StartAt >= filter.DateFrom);
      }
      if (filter.DateTo.HasValue)
      {
        query = query.Where(ms => ms.StartAt <= filter.DateTo);
      }
      if (filter.MinPrice.HasValue)
      {
        query = query.Where(ms => ms.ShiftItems.Sum(si => si.PriceAtMoment) >= filter.MinPrice);
      }
      if (filter.MaxPrice.HasValue)
      {
        query = query.Where(ms => ms.ShiftItems.Sum(si => si.PriceAtMoment) <= filter.MaxPrice);
      }
      if (filter.Statuses != null && filter.Statuses.Any())
      {
        query = query.Where(ms => filter.Statuses.Contains(ms.Status));
      }

      var totalCount = await query.CountAsync();

      var orderedQuery = filter.SortBy?.ToLower() switch
      {
        "start_at" => filter.IsDescending ? query.OrderByDescending(ms => ms.StartAt) : query.OrderBy(ms => ms.StartAt),
        "end_at" => filter.IsDescending ? query.OrderByDescending(ms => ms.EndAt) : query.OrderBy(ms => ms.EndAt),
        "price" => filter.IsDescending ? query.OrderByDescending(ms => ms.ShiftItems.Sum(si => si.PriceAtMoment)) : query.OrderBy(ms => ms.ShiftItems.Sum(si => si.PriceAtMoment)),
        "provider" => filter.IsDescending ? query.OrderByDescending(ms => ms.ProviderId) : query.OrderBy(ms => ms.ProviderId),
        _ => filter.IsDescending ? query.OrderByDescending(ms => ms.Id) : query.OrderBy(ms => ms.Id)
      };

      var shifts = await orderedQuery
        .Skip((filter.PageNumber - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .AsNoTracking()
        .Select(s => new ShiftDto
        {
          Id = s.Id,
          ProviderId = s.ProviderId,
          ProviderFullName = $"{s.Provider.UserProfile.FirstName} {s.Provider.UserProfile.LastName}",
          ClientId = s.ClientId,
          ClientFullName = $"{s.Client.UserProfile.FirstName} {s.Client.UserProfile.LastName}",
          StartAt = s.StartAt,
          EndAt = s.EndAt,
          Status = s.Status.ToString(),
          CreatedAt = s.CreatedAt,
          Items = s.ShiftItems.Select(si => new ShiftItemDto
          {
            Id = si.Id,
            ShiftId = si.ShiftId,
            ServiceId = si.ServiceId,
            NameService = si.Service.Name,
            DurationMinutes = si.Service.DurationMinutes,
            PriceAtMoment = si.PriceAtMoment
          }).ToList()
        }
        ).ToListAsync();


      return new PaginatedDto<ShiftDto>
      {
        Items = shifts,
        TotalCount = totalCount,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
      };
    }

    /// <summary>
    /// Actualiza la información de un turno existente, recalculando horarios y validando disponibilidad
    /// </summary>
    public async Task Update(long shiftId, UpdateShiftDto updateDto)
    {
      var strategy = _context.Database.CreateExecutionStrategy();

      await strategy.ExecuteAsync(async () =>
      {
        var shift = await _context.Shift.Include(s => s.ShiftItems).FirstOrDefaultAsync(s => s.Id == shiftId);
        if (shift == null) throw new KeyNotFoundException("Turno no encontrado");

        if (shift.Status == ShiftStatus.canceled || shift.Status == ShiftStatus.completed)
        {
          throw new InvalidOperationException("El turno no puede ser modificado porque ya se encuentra en un estado final.");
        }

        var providerId = updateDto.ProviderId ?? shift.ProviderId;

        var serviceIds = updateDto.Items.Select(i => i.ServiceId).ToList();
        var existServices = await _context.ProviderService
          .Include(ps => ps.Service)
          .Where(ps => ps.ProviderId == providerId && serviceIds.Contains(ps.ServiceId) && ps.Service.IsActive == true)
          .ToListAsync();

        if (existServices.Count != serviceIds.Count) throw new InvalidOperationException("Uno o más servicios no están disponibles para este proveedor.");

        int totalDuration = existServices.Sum(item => item.DurationMinutes);
        var endAt = updateDto.StartAt.AddMinutes(totalDuration);

        var horarios = await _context.WorkSchedules.FirstOrDefaultAsync(ws => 
          ws.ProviderId == providerId 
          && ws.IsActive == true 
          && ws.DayOfWeek == (int)updateDto.StartAt.DayOfWeek
        );

        if (horarios == null) throw new InvalidOperationException("El proveedor no trabaja este día.");

        var startShiftTime = TimeOnly.FromDateTime(updateDto.StartAt);
        var endShiftTime = TimeOnly.FromDateTime(endAt);

        if (startShiftTime < horarios.StartTime || endShiftTime > horarios.EndTime)
          throw new InvalidOperationException("El horario solicitado está fuera de la jornada laboral del proveedor.");

        // Validar Solapamiento excluyendo el turno
        var isOverlapping = await _context.Shift.AnyAsync(s => 
          s.Id != shiftId &&
          s.ProviderId == providerId &&
          s.Status != ShiftStatus.canceled &&
          s.StartAt < endAt && s.EndAt > updateDto.StartAt
        );

        if (isOverlapping) throw new InvalidOperationException("El proveedor ya tiene un turno asignado en este horario.");

        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
          shift.ProviderId = providerId;
          shift.StartAt = updateDto.StartAt;
          shift.EndAt = endAt;

          _context.ShiftItems.RemoveRange(shift.ShiftItems);

          foreach (var item in existServices)
          {
            _context.ShiftItems.Add(
              new ShiftItems
              {
                ShiftId = shiftId,
                ServiceId = item.ServiceId,
                PriceAtMoment = item.Price
              }
            );
          };

          await _context.SaveChangesAsync();
          await transaction.CommitAsync();
        }
        catch
        {
          await transaction.RollbackAsync();
          throw;
        }
      });
    }
  }
}