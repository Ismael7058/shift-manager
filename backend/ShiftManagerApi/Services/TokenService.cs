using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class TokenService : ITokenService
  {
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    public string GenerateToken(UserAuth userAuth, UserProfile userProfile, List<string> roles, string activeRole)
    {
      var claims = new List<Claim>
      {
        new(JwtRegisteredClaimNames.Sub, userAuth.UserId.ToString()),
        new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

        new(ClaimTypes.NameIdentifier, userAuth.UserId.ToString()),
        new(ClaimTypes.Name, userAuth.Username),
        new(ClaimTypes.Email, userAuth.Email),
        new Claim(ClaimTypes.GivenName, userProfile.FirstName),
        new Claim(ClaimTypes.Surname, userProfile.LastName),

        new Claim("active_role", activeRole)
      };
      claims.AddRange(roles.Distinct().Select(role => new Claim(ClaimTypes.Role, role)));

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: _configuration["Jwt:Issuer"],
          audience: _configuration["Jwt:Audience"],
          claims: claims,
          expires: DateTime.UtcNow.AddMinutes(15),
          signingCredentials: creds
      );
      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
