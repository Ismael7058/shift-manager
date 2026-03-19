namespace ShiftManagerApi.Entity
{
  public class UserProfile
  {
    public long Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public GenderType Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public UserAuth UserAuth { get; set; } = null!;
  }

  public enum GenderType
  {
    male,
    female,
    other
  }
}