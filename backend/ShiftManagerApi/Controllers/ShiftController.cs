using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize]
  [Route("shifts")]
  public class ShiftController : ControllerBase
  {
    private readonly IShiftService _shiftService;


    public ShiftController(IShiftService shiftIShiftService)
    {
      _shiftService = shiftIShiftService;
    }

    [Authorize(Policy = "AnyAuthenticatedRole")]
    [HttpGet]
    public async Task<ActionResult<PaginatedDto<ShiftDto>>> GetShifts([FromQuery] long? providerId, [FromQuery] long? clientId, [FromQuery] ShiftFilterDto filter)
    {
      filter ??= new ShiftFilterDto();
      var activeRole = GetActiveRole();
      var response = activeRole switch
      {
        "Proveedor" => await _shiftService.GetShifts(GetUserId(), clientId, filter),
        "Cliente" => await _shiftService.GetShifts(providerId, GetUserId(), filter),
        _ => await _shiftService.GetShifts(providerId, clientId, filter)
      };
      return Ok(response);
    }

    [Authorize(Policy = "AnyAuthenticatedRole")]
    [HttpGet("{id}")]
    public async Task<ActionResult<ShiftDto>> GetById(long id)
    {
      try
      {
        var activeRole = GetActiveRole();

        var response = activeRole switch
        {
          "Proveedor" => await _shiftService.GetById(GetUserId(), null, id),
          "Cliente" => await _shiftService.GetById(null, GetUserId(), id),
          _ => await _shiftService.GetById(null, null, id)
        };

        return Ok(response);
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }


    [Authorize(Policy = "NonProvider")]
    [HttpPost]
    public async Task<ActionResult<ShiftDto>> Post(long clientId, CreateShiftDto createDto)
    {
      try
      {
        var activeRole = GetActiveRole();
        var response = activeRole switch
        {
          "Cliente" => await _shiftService.Create(GetUserId(), createDto, false),
          _ => await _shiftService.Create(clientId, createDto, true)
        };

        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [Authorize(Policy = "AdminORecepcion")]
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(long id, UpdateShiftDto updateDto)
    {
      try
      {
        await _shiftService.Update(id, updateDto);
        return NoContent();
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [Authorize(Policy = "AnyAuthenticatedRole")]
    [HttpPatch("{id}/status")]
    public async Task<ActionResult> ChangeStatus(long id, ShiftStatus status)
    {
      try
      {
        var activeRole = GetActiveRole();
        switch (activeRole)
        {
          case "Proveedor":
            await _shiftService.ChangeStatus(GetUserId(), null, id, status);
            break;

          case "Cliente":
            await _shiftService.ChangeStatus(null, GetUserId(), id, status);
            break;

          default:
            await _shiftService.ChangeStatus(null, null, id, status);
            break;
        }

        return NoContent();
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
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