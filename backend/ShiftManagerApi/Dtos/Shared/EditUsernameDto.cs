using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record EditUsernameDto
  {
    [Required]
    [StringLength(70, MinimumLength = 1, ErrorMessage = "Username debe tener entre 1 y 70 caracteres")]
    public string Username { get; set; } = string.Empty;
  }
}