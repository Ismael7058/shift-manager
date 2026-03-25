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
  }
}