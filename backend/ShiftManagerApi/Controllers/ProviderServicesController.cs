using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize(Policy = "AdminOProveedor")]
  [Route("provider-services")]
  public class ProviderServiceController : ControllerBase
  {
    private IProviderServiceService _providerService;

    public ProviderServiceController(IProviderServiceService providerService)
    {
      _providerService = providerService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedDto<ProviderServiceDto>>> GetAll([FromQuery] long? providerId, [FromQuery] long? serviceId, [FromQuery] ProviderServiceFilterDto filterDto)
    {
      filterDto ??= new ProviderServiceFilterDto();

      var activeRole = GetActiveRole();
      var response = activeRole switch
      {
        "Proveedor" => await _providerService.GetAll(GetUserId(), serviceId, filterDto),
        _ => await _providerService.GetAll(providerId, serviceId, filterDto)
      };

      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProviderServiceDto>> GetById(long id, [FromQuery] long providerId)
    {
      try
      {
        var activeRole = GetActiveRole();

        switch (activeRole)
        {
          case "Proveedor":
            await _providerService.GetById(GetUserId(), id);
            break;
          default:
            await _providerService.GetById(providerId, id);
            break;
        }
        return Ok();
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [HttpPost]
    public async Task<ActionResult<ProviderServiceDto>> Post(long providerId, CreateProviderServiceDto createDto)
    {
      try
      {

        var activeRole = GetActiveRole();
        var response = activeRole switch
        {
          "Proveedor" => await _providerService.Create(GetUserId(), createDto),
          _ => await _providerService.Create(providerId, createDto)
        };

        return Ok(response);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(long id, long providerId, UpdateProviderServiceDto updateDto)
    {
      try
      {
        var activeRole = GetActiveRole();

        switch (activeRole)
        {
          case "Proveedor":
            await _providerService.Update(GetUserId(), id, updateDto);
            break;
          default:
            await _providerService.Update(providerId, id, updateDto);
            break;
        };
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult> Patch(long id, long providerId)
    {
      try
      {

        var activeRole = GetActiveRole();
        switch (activeRole)
        {
          case "Proveedor":
            await _providerService.SoftDelete(GetUserId(), id);
            break;
          default:
            await _providerService.SoftDelete(providerId, id);
            break;
        }; 
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{id}/active")]
    public async Task<ActionResult> Active(long id, long providerId)
    {
      try
      {
        var activeRole = GetActiveRole();
        switch (activeRole)
        {
          case "Proveedor":
            await _providerService.Active(GetUserId(), id);
            break;
          default:
            await _providerService.Active(providerId, id);
            break;
        }; 
        
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

    private string GetActiveRole()
    {
      var activeRole = User.FindFirst("active_role")?.Value;

      if (string.IsNullOrEmpty(activeRole))
      {
        throw new UnauthorizedAccessException("Usuario no autenticado o rol activo inválido.");
      }
      return activeRole;
    }

  }
}