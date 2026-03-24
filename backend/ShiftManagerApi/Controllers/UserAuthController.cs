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
  }
}