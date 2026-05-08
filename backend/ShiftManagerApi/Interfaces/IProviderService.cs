using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IProviderService
  {
    Task<PaginatedDto<ProviderDto>> GetAll(ProviderFilterDto filter);

  }
}