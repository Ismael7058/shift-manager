using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Interfaces
{
  public interface IShiftService
  {
    Task<PaginatedDto<ShiftDto>> GetShifts(long? providerId, long? clientId, ShiftFilterDto filter);
    Task<ShiftDto> GetById(long? providerId, long? clientId,long shiftId);
    Task<ShiftDto> Create(CreateShiftDto createDto);
    Task Update(long shiftId, UpdateShiftDto updateDto);
    Task ChangeStatus(long shiftId, ShiftStatus status);
  }
}