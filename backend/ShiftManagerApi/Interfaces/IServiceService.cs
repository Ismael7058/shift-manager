using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IServiceService
  {
    Task<PaginatedDto<ServiceDto>> GetAll(ServiceFilterDto serviceFilterDto);
    Task<ServiceDto> GetByDto(long id);
    Task<ServiceDto> CreateService(CreateServiceDto createServiceDto);
    Task UpdateService(long id, UpdateServiceDto updateServiceDto);
    Task IsActive(long id, bool isActive);

  }
}