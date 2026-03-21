using ShiftManagerApi.Dtos;

namespace ShiftManagerApi.Interfaces
{
    public interface IAuthService
    {
        Task<UserDto> Register(RegisterDto registerDto);
        Task<AuthTokenDto> Login(LoginDto loginDto);
    }
}
