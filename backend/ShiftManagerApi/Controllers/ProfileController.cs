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
    private readonly IAuthService _authService;
    private readonly ICookieService _cookieService;

    public ProfileController(IUserAuthService userAuthService, IAuthService authService, ICookieService cookieService)
    {
      _userAuthService = userAuthService;
      _authService = authService;
      _cookieService = cookieService;
    }

    [HttpGet]
    public async Task<ActionResult<UserDto>> GetMe()
    {
      try
      {
        return Ok(await _userAuthService.GetById(GetUserId(), false));
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
    }

    [HttpPut]
    public async Task<ActionResult> Put(UpdateUserDto updateUserDto)
    {
      try
      {
        var userId = GetUserId();
        await _userAuthService.UpdateUser(userId, updateUserDto);
        await _authService.GenerateAndSetTokenCookie(userId);

        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
    }

    [HttpPatch("/email")]
    public async Task<ActionResult> EditEmail(EditEmailDto editEmailDto)
    {
      try
      {
        var userId = GetUserId();
        await _userAuthService.EditEmail(userId, editEmailDto);
        await _authService.GenerateAndSetTokenCookie(userId);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
    }

    [HttpPatch("/username")]
    public async Task<ActionResult> EditUsername(EditUsernameDto editUsernameDto)
    {
      try
      {
        var userId = GetUserId();
        await _userAuthService.EditUsername(userId, editUsernameDto);
        await _authService.GenerateAndSetTokenCookie(userId);
        
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
    }

    [HttpPatch("password")]
    public async Task<ActionResult> EditPassword(EditPasswordProfileDto editPasswordProfileDto)
    {
      try
      {
        await _userAuthService.EditPasswordProfile(GetUserId(), editPasswordProfileDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
    }

    private long GetUserId()
    {
      var userIdClaim = HttpContext.User.Claims.FirstOrDefault(c => 
          c.Type == ClaimTypes.NameIdentifier && long.TryParse(c.Value, out _));

      if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
      {
        throw new UnauthorizedAccessException("Usuario no autenticado o ID inválido");
      }
      return userId;
    }

  }
}