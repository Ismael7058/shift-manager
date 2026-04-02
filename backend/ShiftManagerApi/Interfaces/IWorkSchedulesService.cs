using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IWorkSchedulesService
  {
    Task<PaginatedDto<WorkSchedulesDto>> GetAll(long proviederId, WorkSchedulesFilterDto filter);
    Task<WorkSchedulesDto> GetById(long proviederId, long workSchedulesId);
    Task<WorkSchedulesDto> Create(long proviederId, CreateWorkSchedulesDto createDto);
    Task Update(long proviederId, long workSchedulesId, UpdateWorkSchedulesDto updateDto);
    Task SetIsActive(long proviederId, long workSchedulesId, bool isActive);
  }
}