using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record RoleDto
  {
    [Required]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Name debe tener entre 1 y 50 caracteres")]
    [RegularExpression(@"^[\p{L}]+$", ErrorMessage = "Name solo puede contener letras")]
    public string Name { get; set; } = string.Empty;
  }
}