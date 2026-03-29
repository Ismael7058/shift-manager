

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize(Policy = "Proveedor")]
  [Route("me/services")]
  public class MyServiceController : ControllerBase
  {
    private IProviderServiceService _privderService;

    public MyServiceController(IProviderServiceService providerService)
    {
      _privderService = providerService;
    }
    
    [HttpGet]
    public async Task<ActionResult<PaginatedDto<ProviderServiceDto>>> GetAll([FromQuery] ProviderServiceFilterDto filterDto)
    {
      filterDto ??= new ProviderServiceFilterDto();
      
      var response = await _privderService.GetAll(GetUserId(), filterDto);
      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProviderServiceDto>> GetById(long id)
    {
      try
      {
        return Ok(await _privderService.GetById(GetUserId(), id));
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [HttpPost]
    public async Task<ActionResult<ProviderServiceDto>> Post(CreateProviderServiceDto createDto)
    {
      try
      {
        var ps = await _privderService.Create(GetUserId(), createDto);
        return Ok(ps);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(long id, UpdateProviderServiceDto updateDto)
    {
      try
      {
        await _privderService.Update(GetUserId(), id, updateDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
      try
      {
        await _privderService.Delete(GetUserId(), id);
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