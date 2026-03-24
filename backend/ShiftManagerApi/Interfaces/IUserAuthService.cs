using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IUserAuthService
  {
    Task<PaginatedDto<UserDto>> GetAll(UserFilterDto userFilterDto);
    Task<UserDto> CreateUser(CreateUserDto createUserDto);
    Task UpdateUser(long Id, UpdateUserDto updateUserDto);
  }
}
