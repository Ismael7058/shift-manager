using System.ComponentModel.DataAnnotations;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Dtos
{
  public record UpdateUserDto
  {
    [StringLength(50, MinimumLength = 1, ErrorMessage = "FirstName debe tener entre 1 y 50 caracteres")]
    [RegularExpression(@"^[\p{L}\s]+$", ErrorMessage = "FirstName solo puede contener letras y espacios")]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(50, MinimumLength = 1, ErrorMessage = "LastName debe tener entre 1 y 50 caracteres")]
    [RegularExpression(@"^[\p{L}\s]+$", ErrorMessage = "LastName solo puede contener letras y espacios")]
    public string LastName { get; set; } = string.Empty;

    public DateOnly DateOfBirth { get; set; }

    [EnumDataType(typeof(GenderType), ErrorMessage = "El valor para Gender no es válido.")]
    public GenderType Gender { get; set; }

    [StringLength(15, MinimumLength = 8, ErrorMessage = "PhoneNumber debe tener entre 1 y 50 caracteres")]
    [RegularExpression(@"^\+?\d{8,15}$", ErrorMessage = "PhoneNumber invalido")]
    public string? PhoneNumber { get; set; }
  }
}