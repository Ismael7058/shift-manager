using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Route("services")]
  public class ServiceController : ControllerBase
  {
    private IServiceService _serviceService;
    public ServiceController(IServiceService serviceService)
    {
      _serviceService = serviceService;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<PaginatedDto<ServiceDto>>> GetAll([FromQuery] ServiceFilterDto serviceFilterDto)
    {
      serviceFilterDto ??= new ServiceFilterDto();
      
      var response = await _serviceService.GetAll(serviceFilterDto);
      return Ok(response);
    }

    [Authorize]
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

    [Authorize(Policy = "Administrador")]
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

    [Authorize(Policy = "Administrador")]
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

    [Authorize(Policy = "Administrador")]
    [HttpPatch("{id}")]
    public async Task<ActionResult> Patch(long id, [FromBody] UpdateStatusDto statusDto)
    {
      try
      {
        await _serviceService.IsActive(id, statusDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [Authorize(Policy = "Administrador")]
    [HttpPost("{id}/images")]
    public async Task<ActionResult<List<ServiceImageDto>>> AddImages(long id, [FromForm] List<IFormFile> files)
    {
      try
      {
        if (files == null || files.Count == 0)
          return BadRequest(new { message = "No se enviaron archivos válidos." });

        var images = await _serviceService.AddImages(id, files);
        return Ok(images);
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
      catch (InvalidOperationException ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [Authorize(Policy = "Administrador")]
    [HttpDelete("{serviceId}/images/{imageId}")]
    public async Task<ActionResult> DeleteImage(long serviceId, long imageId)
    {
      try
      {
        await _serviceService.DeleteImage(serviceId, imageId);
        return NoContent();
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
      catch (Exception)
      {
        return StatusCode(500, new { message = "Ocurrió un error inesperado al eliminar la imagen del servicio." });
      }
    }
  }
}