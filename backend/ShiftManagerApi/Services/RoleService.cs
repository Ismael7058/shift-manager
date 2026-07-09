using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
    public class RoleService : IRoleService
    {
        private readonly ShiftManagerContext _context;

        public RoleService(ShiftManagerContext context)
        {
            _context = context;
        }

        public async Task<List<RoleResponseDto>> GetAll()
        {
            var roles = await _context.Roles
            .Select(r => new RoleResponseDto
            {
                Id = r.Id,
                Name = r.Name
            }).ToListAsync();

            return roles;
        }
    }
}
