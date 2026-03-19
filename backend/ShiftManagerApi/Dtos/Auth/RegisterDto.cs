using System.ComponentModel.DataAnnotations;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Dtos
{
  public record RegisterDto
  {
    [Required]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    public string LastName { get; set; } = string.Empty;
    [Required]
    public DateOnly DateOfBirth { get; set; }
    [Required]
    public GenderType Gender { get; set; }
    public string? PhoneNumber { get; set; }
    [Required]
    public string Username { get; set; } = string.Empty;
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;

  }
}