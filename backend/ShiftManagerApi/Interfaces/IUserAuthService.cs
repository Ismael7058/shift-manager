using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IUserAuthService
  {
    Task<PaginatedDto<UserDto>> GetAll(UserFilterDto userFilterDto);
    Task<UserDto> CreateUser(CreateUserDto createUserDto);
    Task UpdateUser(long Id, UpdateUserDto updateUserDto);
    Task EditEmail(long Id, EditEmailDto editEmailDto);
    Task EditUsername(long Id, EditUsernameDto editUsernameDto);
    Task EditPassword(long Id, EditPasswordDto editPasswordDto);
  }
}
