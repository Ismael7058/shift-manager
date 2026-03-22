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
  }
}