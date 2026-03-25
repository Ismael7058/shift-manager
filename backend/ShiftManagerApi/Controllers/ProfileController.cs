using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize]
  [Route("me")]
  public class ProfileController : ControllerBase
  {

    private readonly IUserAuthService _userAuthService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ProfileController(IUserAuthService userAuthService, IHttpContextAccessor httpContextAccessor)
    {
      _userAuthService = userAuthService;
      _httpContextAccessor = httpContextAccessor;
    }

    [HttpGet]
    public async Task<ActionResult<UserDto>> GetMe()
    {
      try
      {
        var userPrincipal = _httpContextAccessor.HttpContext?.User;

        var userIdClaim = userPrincipal?.Claims.FirstOrDefault(c => 
            c.Type == ClaimTypes.NameIdentifier && long.TryParse(c.Value, out _));

        if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
          throw new UnauthorizedAccessException("Usuario no autenticado");

        return Ok( await _userAuthService.GetById(userId, false));
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

  }
}