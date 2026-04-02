using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class ShiftService : IShiftService
  {
    public Task ChangeStatus(long shiftId, ShiftStatus status)
    {
      throw new NotImplementedException();
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