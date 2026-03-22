using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IUserAuthService
  {
    Task<PaginatedDto<UserDto>> GetAll(UserFilterDto userFilterDto);
  }
}
