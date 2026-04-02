using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IServiceService
  {
    Task<PaginatedDto<ServiceDto>> GetAll(ServiceFilterDto serviceFilterDto);
    Task<ServiceDto> GetById(long id);
    Task<ServiceDto> CreateService(CreateServiceDto createServiceDto);
    Task UpdateService(long id, UpdateServiceDto updateServiceDto);
    Task IsActive(long id, UpdateStatusDto statusDto);

  }
}