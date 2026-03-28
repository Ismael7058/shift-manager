using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize(Policy = "Administrador")]
  [Route("services")]
  public class ServiceController : ControllerBase
  {
    private IServiceService _serviceService;
    public ServiceController(IServiceService serviceService)
    {
      _serviceService = serviceService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedDto<ServiceDto>>> GetAll([FromQuery] ServiceFilterDto serviceFilterDto)
    {
      serviceFilterDto ??= new ServiceFilterDto();
      
      var response = await _serviceService.GetAll(serviceFilterDto);
      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetById(long id)
    {
      try
      {
        return Ok( await _serviceService.GetById(id));
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [HttpPost]
    public async Task<ActionResult<ServiceDto>> Post(CreateServiceDto createServiceDto)
    {
      try
      {
        var service = await _serviceService.CreateService(createServiceDto);
        return Ok(service);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(long id, UpdateServiceDto updateServiceDto)
    {
      try
      {
        await _serviceService.UpdateService(id, updateServiceDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult> Patch(long id, bool isActive)
    {
      try
      {
        await _serviceService.IsActive(id, isActive);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }
  }
}