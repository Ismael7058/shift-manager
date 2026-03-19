using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Route("auth")]
  public class AuthController : ControllerBase
  {
    private readonly ShiftManagerContext _context;
    private readonly IAuthService _authService;

    public AuthController(ShiftManagerContext context, IAuthService authService)
    {
      _context = context;
      _authService = authService;
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

  }
}