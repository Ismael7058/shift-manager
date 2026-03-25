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

    public ProfileController(IUserAuthService userAuthService)
    {
      _userAuthService = userAuthService;
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
        await _userAuthService.UpdateUser(GetUserId(), updateUserDto);
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
        await _userAuthService.EditEmail(GetUserId(), editEmailDto);
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
        await _userAuthService.EditUsername(GetUserId(), editUsernameDto);
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