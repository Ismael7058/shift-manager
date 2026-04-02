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

    public Task<ShiftDto> Create(CreateShiftDto createDto)
    {
      throw new NotImplementedException();
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