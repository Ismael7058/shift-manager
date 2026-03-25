using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
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
  }
}