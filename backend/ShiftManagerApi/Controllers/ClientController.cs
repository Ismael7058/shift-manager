using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Route("providers")]
  [Authorize]
  public class ClientController : ControllerBase
  {
    private readonly IClientService _clientService;


    public ClientController(IClientService clientService)
    {
      _clientService = clientService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedDto<ClientDto>>> GetProviders([FromQuery] ClientFilterDto filter)
    {
      filter ??= new ClientFilterDto();
      var response = await _clientService.GetAll(filter); 
      return Ok(response);
    }
  }
}