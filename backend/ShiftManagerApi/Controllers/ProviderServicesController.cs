using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize(Policy = "Administrador")]
  [Route("providers")]
  public class ProviderServiceController : ControllerBase
  {
    private IProviderServiceService _privderService;

    public ProviderServiceController(IProviderServiceService providerService)
    {
      _privderService = providerService;
    }

    [HttpGet("{providerId}/services")]
    public async Task<ActionResult<PaginatedDto<ProviderServiceDto>>> GetAll([FromQuery] ProviderServiceFilterDto filterDto, long providerId)
    {
      filterDto ??= new ProviderServiceFilterDto();

      var response = await _privderService.GetAll(providerId, filterDto);
      return Ok(response);
    }

    [HttpGet("{providerId}/services/{id}")]
    public async Task<ActionResult<ProviderServiceDto>> GetById(long providerId, long id)
    {
      try
      {
        return Ok(await _privderService.GetById(providerId, id));
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [HttpPost("{providerId}/services")]
    public async Task<ActionResult<ProviderServiceDto>> Post(long providerId, CreateProviderServiceDto createDto)
    {
      try
      {
        var ps = await _privderService.Create(providerId, createDto);
        return Ok(ps);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPut("{providerId}/services/{id}")]
    public async Task<ActionResult> Put(long providerId, long id, UpdateProviderServiceDto updateDto)
    {
      try
      {
        await _privderService.Update(providerId, id, updateDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpDelete("{providerId}/services/{id}")]
    public async Task<ActionResult> Delete(long providerId, long id)
    {
      try
      {
        await _privderService.Delete(providerId, id);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

  }
}