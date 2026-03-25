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

    [HttpPut]
    public async Task<ActionResult> Put(UpdateUserDto updateUserDto)
    {
      try
      {
        var userPrincipal = _httpContextAccessor.HttpContext?.User;

        var userIdClaim = userPrincipal?.Claims.FirstOrDefault(c =>
            c.Type == ClaimTypes.NameIdentifier && long.TryParse(c.Value, out _));

        if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
          throw new UnauthorizedAccessException("Usuario no autenticado");

        await _userAuthService.UpdateUser(userId, updateUserDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("/email")]
    public async Task<ActionResult> EditEmail(EditEmailDto editEmailDto)
    {
      try
      {
        var userPrincipal = _httpContextAccessor.HttpContext?.User;

        var userIdClaim = userPrincipal?.Claims.FirstOrDefault(c =>
            c.Type == ClaimTypes.NameIdentifier && long.TryParse(c.Value, out _));

        if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
          throw new UnauthorizedAccessException("Usuario no autenticado");

        await _userAuthService.EditEmail(userId, editEmailDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("/username")]
    public async Task<ActionResult> EditUsername(EditUsernameDto editUsernameDto)
    {
      try
      {
        var userPrincipal = _httpContextAccessor.HttpContext?.User;

        var userIdClaim = userPrincipal?.Claims.FirstOrDefault(c =>
            c.Type == ClaimTypes.NameIdentifier && long.TryParse(c.Value, out _));

        if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
          throw new UnauthorizedAccessException("Usuario no autenticado");

        await _userAuthService.EditUsername(userId, editUsernameDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("password")]
    public async Task<ActionResult> EditPassword(EditPasswordProfileDto editPasswordProfileDto)
    {
      try
      {
        var userPrincipal = _httpContextAccessor.HttpContext?.User;

        var userIdClaim = userPrincipal?.Claims.FirstOrDefault(c =>
            c.Type == ClaimTypes.NameIdentifier && long.TryParse(c.Value, out _));

        if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
          throw new UnauthorizedAccessException("Usuario no autenticado");

        await _userAuthService.EditPasswordProfile(userId, editPasswordProfileDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

  }
}