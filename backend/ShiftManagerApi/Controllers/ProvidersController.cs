using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Route("providers")]
  [Authorize]
  public class ProvidersController : ControllerBase
  {
    private readonly IProviderService _providerService;

    public ProvidersController(IProviderService providerService)
    {
      _providerService = providerService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedDto<UserDto>>> GetProviders([FromQuery] ProviderFilterDto filter)
    {
      filter ??= new ProviderFilterDto();
      var response = await _providerService.GetAll(filter); 
      return Ok(response);
    }

  }
}