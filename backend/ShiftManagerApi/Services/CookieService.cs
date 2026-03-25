using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class CookieService : ICookieService
  {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CookieService(IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    public void DeleteTokenCookie()
    {
      _httpContextAccessor.HttpContext?.Response.Cookies.Delete("accessToken");
    }

    public void SetTokenCookie(string token)
    {
      var cookieOptions = new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.UtcNow.AddMinutes(15)
      };
      _httpContextAccessor.HttpContext?.Response.Cookies.Append("accessToken", token, cookieOptions);
    }
  }
}