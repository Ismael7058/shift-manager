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
    private readonly IProviderServiceService _providerServiceService;

    public ProvidersController(IProviderService providerService, IProviderServiceService providerServiceService)
    {
      _providerService = providerService;
      _providerServiceService = providerServiceService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedDto<UserDto>>> GetProviders([FromQuery] ProviderFilterDto filter)
    {
      filter ??= new ProviderFilterDto();
      var response = await _providerService.GetAll(filter); 
      return Ok(response);
    }

    [HttpGet("{id}/services")]
    public async Task<ActionResult<PaginatedDto<ProviderServiceDto>>> GetServices(long id, [FromQuery] ProviderServiceFilterDto filter)
    {
      filter ??= new ProviderServiceFilterDto();
      filter.IsActive = 1;
      var response = await _providerServiceService.GetAll(id, null, filter);
      return Ok(response);
    }

  }
}