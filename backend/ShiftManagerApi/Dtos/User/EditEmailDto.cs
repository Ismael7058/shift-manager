using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record EditEmailDto
  {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
  }
}