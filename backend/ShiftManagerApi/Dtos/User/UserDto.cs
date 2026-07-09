namespace ShiftManagerApi.Dtos
{
  public record UserDto
  {
    public long Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PictureURL { get; set; }

    public List<string> Roles { get; set; } = null!;
  }
}
