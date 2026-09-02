using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("role")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoleResponseDto>>> GetAll()
        {
            try
            {
                var response = await _roleService.GetAll();
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message = "Ocurrió un error inesperado al obtener los roles."
                });
            }
        }
    }
}
