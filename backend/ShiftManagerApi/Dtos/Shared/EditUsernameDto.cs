using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record EditUsernameDto
  {
    [Required]
    [StringLength(70, MinimumLength = 1, ErrorMessage = "Username debe tener entre 1 y 70 caracteres")]
    [RegularExpression(@"^[\p{L}\s]+$", ErrorMessage = "Username solo puede contener letras y espacios")]
    public string Username { get; set; } = string.Empty;
  }
}