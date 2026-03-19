namespace ShiftManagerApi.Entity
{
  public class UserAuth
  {
    public long UserId { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public UserProfile UserProfile { get; set; } = null!;
  }

}