using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(UserAuth userAuth, UserProfile? userProfile, List<string> roles);
    }
}
