using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize(Policy = "Proveedor")]
  [Route("me/work-schedules")]
  public class MyWorkSchedulesController : ControllerBase
  {
    private readonly IWorkSchedulesService _workSchedulesService;

    public MyWorkSchedulesController(IWorkSchedulesService workSchedulesService)
    {
      _workSchedulesService = workSchedulesService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedDto<WorkSchedulesDto>>> GetAll([FromQuery] WorkSchedulesFilterDto filterDto)
    {
      filterDto ??= new WorkSchedulesFilterDto();
      
      var response = await _workSchedulesService.GetAll(GetUserId(), filterDto);
      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkSchedulesDto>> GetById(long id)
    {
      try
      {
        return Ok(await _workSchedulesService.GetById(GetUserId(), id));
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }

    [HttpPost]
    public async Task<ActionResult<WorkSchedulesDto>> Post(CreateWorkSchedulesDto createDto)
    {
      try
      {
        var response = await _workSchedulesService.Create(GetUserId(), createDto);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(long id, UpdateWorkSchedulesDto updateDto)
    {
      try
      {
        await _workSchedulesService.Update(GetUserId(), id, updateDto);
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }

    [HttpPatch("{id}/active")]
    public async Task<ActionResult> Patch(long id, [FromBody] bool isActive)
    {
      try
      {
        await _workSchedulesService.SetIsActive(GetUserId(), id, isActive);
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