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

    public ProfileController(IUserAuthService userAuthService, IAuthService authService)
    {
      _userAuthService = userAuthService;
      _authService = authService;

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
        await _authService.GenerateAndSetTokenCookie(userId, null);

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

    [HttpPatch("email")]
    public async Task<ActionResult> EditEmail(EditEmailDto editEmailDto)
    {
      try
      {
        var userId = GetUserId();
        await _userAuthService.EditEmail(userId, editEmailDto);
        await _authService.GenerateAndSetTokenCookie(userId, null);
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

    [HttpPatch("username")]
    public async Task<ActionResult> EditUsername(EditUsernameDto editUsernameDto)
    {
      try
      {
        var userId = GetUserId();
        await _userAuthService.EditUsername(userId, editUsernameDto);
        await _authService.GenerateAndSetTokenCookie(userId, null);
        
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

    [HttpPatch("role-active")]
    public async Task<ActionResult> ChangeRoleActive(RoleDto role)
    {
      try
      {
        await _authService.GenerateAndSetTokenCookie(GetUserId(), role);
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

    [HttpPost("picture")]
    public async Task<ActionResult> UpdatePicture(IFormFile? file)
    {
      try
      {
        var PictureURL = await _userAuthService.UpadetePictureProfile(GetUserId(), file);

        return Ok(PictureURL);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpDelete("picture")]
    public async Task<ActionResult> DeletePicture()
    {
      try
      {
        await _userAuthService.DeletePictureProfile(GetUserId());

        return Ok();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
      catch(Exception )
      {
        return StatusCode(500, new 
        { 
            message = "Ocurrió un error inesperado al eliminar la imagen de perfil." 
        });
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