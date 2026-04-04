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
            Status = newShift.Status,
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

    public Task<ShiftDto> GetById(long shiftId)
    {
      throw new NotImplementedException();
    }

    public Task<PaginatedDto<ShiftDto>> GetClientShifts(long clientId, ShiftFilterDto filter)
    {
      throw new NotImplementedException();
    }

    public Task<PaginatedDto<ShiftDto>> GetProviderShifts(long providerId, ShiftFilterDto filter)
    {
      throw new NotImplementedException();
    }

    public Task Update(long shiftId, UpdateShiftDto updateDto)
    {
      throw new NotImplementedException();
    }
  }
}