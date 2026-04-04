using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
  [ApiController]
  [Authorize(Policy = "AdminORecepcion")]
  [Route("shifts")]
  public class ShiftController : ControllerBase
  {
    private readonly IShiftService _shiftService;


    public ShiftController(IShiftService shiftIShiftService)
    {
      _shiftService = shiftIShiftService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedDto<ShiftDto>>> GetShifts([FromQuery] long? providerId, [FromQuery] long? clientId, [FromQuery] ShiftFilterDto filter)
    {
      filter ??= new ShiftFilterDto();
      var response = await _shiftService.GetShifts(providerId, clientId,  filter);
      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShiftDto>> GetById(long id)
    {
      try
      {
        return Ok(await _shiftService.GetById(null, null, id));
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }


    [HttpPost]
    public async Task<ActionResult<ShiftDto>> Post(long clientId, CreateShiftDto createDto)
    {
      try
      {
        var response = await _shiftService.Create(clientId, createDto);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
      }
      catch (InvalidOperationException ex)
      {
        return Conflict(new { message = ex.Message });
      }
    }
  
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

    [HttpPatch("{id}")]
    public async Task<ActionResult> ChangeStatus(long id, ShiftStatus status)
    {
      try
      {
      await _shiftService.ChangeStatus(null, null, id, status);
      return NoContent();
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }
  }
}