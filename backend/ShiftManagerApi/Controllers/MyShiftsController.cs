using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Route("me/shifts")]
  public class MyShiftController : ControllerBase
  {
    private readonly IShiftService _shiftService;


    public MyShiftController(IShiftService shiftIShiftService)
    {
      _shiftService = shiftIShiftService;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<PaginatedDto<ShiftDto>>> GetShifts([FromQuery] ShiftFilterDto filter)
    {
      filter ??= new ShiftFilterDto();
      var userId = GetUserId();
      var activeRole = GetActiveRole();

      var response = activeRole switch
      {
        "Proveedor" => await _shiftService.GetShifts(userId, null, filter),
        "Cliente" => await _shiftService.GetShifts(null, userId, filter),
        _ => throw new UnauthorizedAccessException("El rol activo no tiene permisos para esta operación.")
      };

      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShiftDto>> GetById(long id)
    {
      try
      {
      var userId = GetUserId();
      var activeRole = GetActiveRole();

      var response = activeRole switch
      {
        "Proveedor" => await _shiftService.GetById(userId, null, id),
        "Cliente" => await _shiftService.GetById(null, userId, id),
        _ => throw new UnauthorizedAccessException("El rol activo no tiene permisos para esta operación.")
      };

      return Ok(response);

      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [Authorize(Policy = "Cliente")]
    [HttpPost]
    public async Task<ActionResult<ShiftDto>> Post(CreateShiftDto createDto)
    {
      try
      {
        var userId = GetUserId();
        var response = await _shiftService.Create(userId, createDto);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult> ChangeStatus(long id, ShiftStatus status)
    {
      try
      {
        var userId = GetUserId();
        var activeRole = GetActiveRole();

        await (activeRole switch
        {
          "Proveedor" => _shiftService.ChangeStatus(userId, null, id, status),
          "Cliente" => _shiftService.ChangeStatus(null, userId, id, status),
          _ => throw new UnauthorizedAccessException("El rol activo no tiene permisos para esta operación.")
        });

        return NoContent();
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

    private string GetActiveRole() {
      var activeRole = User.FindFirst("active_role")?.Value;

      if (string.IsNullOrEmpty(activeRole))
      {
        throw new UnauthorizedAccessException("Usuario no autenticado o rol activo inválido.");
      }
      return activeRole;
    }

  }
}