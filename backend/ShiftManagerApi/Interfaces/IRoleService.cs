using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IRoleService
  {
    Task<List<RoleResponseDto>> GetAll();
  }
}
