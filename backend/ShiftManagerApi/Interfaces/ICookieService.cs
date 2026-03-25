namespace ShiftManagerApi.Interfaces
{
  public interface ICookieService
  {
    void DeleteTokenCookie();
    void SetTokenCookie(string token);
  }
}
