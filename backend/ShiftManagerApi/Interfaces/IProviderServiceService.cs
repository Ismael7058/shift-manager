using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IProviderServiceService
  {
    Task<PaginatedDto<ProviderServiceDto>> GetAll(long userId, ProviderServiceFilterDto filter);
    Task<ProviderServiceDto> GetById(long userId, long serviceId);
    Task<ProviderServiceDto> Create(long userId, CreateProviderServiceDto createDto);
    Task Update(long userId, long serviceId, UpdateProviderServiceDto updateDto);
    Task Delete(long userId, long serviceId);
  }
}