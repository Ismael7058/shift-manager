using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(UserAuth userAuth, List<string> roles, string activeRole);
    }
}
