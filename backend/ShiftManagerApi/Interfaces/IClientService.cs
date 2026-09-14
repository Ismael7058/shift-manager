using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IClientService
  {
    Task<PaginatedDto<ClientDto>> GetAll(ClientFilterDto filter);
  }
}

