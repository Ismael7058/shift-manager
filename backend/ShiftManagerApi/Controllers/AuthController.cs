using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Route("")]
  public class AuthController : ControllerBase
  {
    private readonly IAuthService _authService;
    private readonly ICookieService _cookieService;

    public AuthController(IAuthService authService, ICookieService cookieService)
    {
      _authService = authService;
      _cookieService = cookieService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
      try
      {
        var userDto = await _authService.Register(registerDto);
        return Ok(userDto);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
      try
      {
        var tokenResponse = await _authService.Login(loginDto);
        _cookieService.SetTokenCookie(tokenResponse.AccessToken);

        return Ok(tokenResponse.User);
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
      try
      {
        _cookieService.DeleteTokenCookie();
        return NoContent();
      }
      catch (Exception)
      {
        return NoContent();
      }
    }
  }
}