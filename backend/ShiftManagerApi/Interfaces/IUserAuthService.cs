using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
  public interface IUserAuthService
  {
    Task<PaginatedDto<UserDto>> GetAll(UserFilterDto userFilterDto);
    Task<UserDto> CreateUser(CreateUserDto createUserDto);
  }
}
