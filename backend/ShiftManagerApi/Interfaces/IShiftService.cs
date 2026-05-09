using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Interfaces
{
  public interface IShiftService
  {
    Task<PaginatedDto<ShiftDto>> GetShifts(long? providerId, long? clientId, ShiftFilterDto filter);
    Task<ShiftDto> GetById(long? providerId, long? clientId,long shiftId);
    Task<ShiftDto> Create(long clientId, CreateShiftDto createDto);
    Task Update(long shiftId, UpdateShiftDto updateDto);
    Task ChangeStatus(long? providerId, long? clientId, long shiftId, ShiftStatus status);
  }
}