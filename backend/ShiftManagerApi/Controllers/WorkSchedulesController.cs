using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize]
  [Route("work-schedules")]
  public class WorkSchedulesController : ControllerBase
  {
    private readonly IWorkSchedulesService _workSchedulesService;

    public WorkSchedulesController(IWorkSchedulesService workSchedulesService)
    {
      _workSchedulesService = workSchedulesService;
    }

    [Authorize(Policy = "AdminOProveedor")]
    [HttpGet]
    public async Task<ActionResult<PaginatedDto<WorkSchedulesDto>>> GetAll([FromQuery] long? providerId, [FromQuery] WorkSchedulesFilterDto filterDto)
    {
      filterDto ??= new WorkSchedulesFilterDto();
      var activeRole = GetActiveRole();
      var response = activeRole switch
      {
        "Proveedor" => await _workSchedulesService.GetAll(GetUserId(), filterDto),
        _ => await _workSchedulesService.GetAll(providerId, filterDto)
      };
      return Ok(response);
    }

    [Authorize(Policy = "AdminOProveedor")]
    [HttpGet("{id}")]
    public async Task<ActionResult<WorkSchedulesDto>> GetById(long id, [FromQuery] long? providerId)
    {
      try
      {
        var activeRole = GetActiveRole();
        var response = activeRole switch
        {
          "Proveedor" => await _workSchedulesService.GetById(GetUserId(), id),
          _ => await _workSchedulesService.GetById(providerId, id)
        };
        return Ok(response);
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [HttpPost("{providerId}/work-schedules")]
    public async Task<ActionResult<WorkSchedulesDto>> Post(long providerId, CreateWorkSchedulesDto createDto)
    {
      try
      {
        var response = await _workSchedulesService.Create(providerId, createDto);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPut("{providerId}/work-schedules/{id}")]
    public async Task<ActionResult> Put(long providerId, long id, UpdateWorkSchedulesDto updateDto)
    {
      try
      {
        await _workSchedulesService.Update(providerId, id, updateDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{providerId}/work-schedules/{id}/active")]
    public async Task<ActionResult> Patch(long providerId, long id, [FromBody] UpdateStatusDto statusDto)
    {
      try
      {
        await _workSchedulesService.SetIsActive(providerId, id, statusDto);
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