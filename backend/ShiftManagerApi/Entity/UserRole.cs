namespace ShiftMangerApi.Entity
{
  public class UserRole
  {
    public long UserId { get; set; }
    public long RoleId { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }


    public UserAuth UserAuth { get; set; } = null!;
    public Role Role { get; set; } = null!;
  }

}