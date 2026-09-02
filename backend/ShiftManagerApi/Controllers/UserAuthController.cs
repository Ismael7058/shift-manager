using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize(Policy = "Administrador")]
  [Route("users")]
  public class UserAuthController : ControllerBase
  {

    private readonly IUserAuthService _userAuthService;

    public UserAuthController(IUserAuthService userAuthService)
    {
      _userAuthService = userAuthService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedDto<UserDto>>> GetAll([FromQuery] UserFilterDto userFilterDto)
    {
      userFilterDto ??= new UserFilterDto();
      
      var response = await _userAuthService.GetAll(userFilterDto);
      return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Post(CreateUserDto createUserDto)
    {
      try
      {
        var userDto = await _userAuthService.CreateUser(createUserDto);
        return Ok(userDto);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(long id, bool includeRol = true)
    {
      try
      {
        return Ok( await _userAuthService.GetById(id, includeRol));
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(long id, UpdateUserDto updateUserDto)
    {
      try
      {
        await _userAuthService.UpdateUser(id, updateUserDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{id}/email")]
    public async Task<ActionResult> EditEmail(long id, EditEmailDto editEmailDto)
    {
      try
      {
        await _userAuthService.EditEmail(id, editEmailDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{id}/username")]
    public async Task<ActionResult> EditUsername(long id, EditUsernameDto editUsernameDto)
    {
      try
      {
        await _userAuthService.EditUsername(id, editUsernameDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }
    
    [HttpPatch("{id}/password")]
    public async Task<ActionResult> EditPassword(long id, EditPasswordDto editPasswordDto)
    {
      try
      {
        await _userAuthService.EditPassword(id, editPasswordDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPost("{id}/picture")]
    public async Task<ActionResult> UpdatePicture(long id, IFormFile? file)
    {
      try
      {
        var PictureURL = await _userAuthService.UpadetePictureProfile(id, file);

        return Ok(new { pictureURL = PictureURL });
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpDelete("{id}/picture")]
    public async Task<ActionResult> DeletePicture(long id)
    {
      try
      {
        await _userAuthService.DeletePictureProfile(id);

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

    [HttpPatch("{id}/role")]
    public async Task<ActionResult> EditRole(long id, List<long> roles)
    {
      try
      {
        if(GetUserId() == id && !roles.Contains(1))
          throw new InvalidOperationException("No puedes quitarte tu rol de administracion.");
        
        await _userAuthService.EditRoles(id, roles);
        return Ok(new { message = "Los roles han sido actualizado con exito"});
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult> ChangeStatus(long id, UpdateStatusDto status)
    {
      try
      {
        if(GetUserId() == id )
          throw new InvalidOperationException("No puedes inhabilitar tu propia cuenta.");
        await _userAuthService.ChangeStatus(id, status);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
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