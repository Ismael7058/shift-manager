using System.ComponentModel.DataAnnotations;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Dtos
{
  public record CreateUserDto
  {
    [Required]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "FirstName debe tener entre 1 y 50 caracteres")]
    [RegularExpression(@"^[\p{L}\s]+$", ErrorMessage = "FirstName solo puede contener letras y espacios")]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "LastName debe tener entre 1 y 50 caracteres")]
    [RegularExpression(@"^[\p{L}\s]+$", ErrorMessage = "LastName solo puede contener letras y espacios")]
    public string LastName { get; set; } = string.Empty;
    [Required]
    public DateOnly DateOfBirth { get; set; }
    [Required]
    [EnumDataType(typeof(GenderType), ErrorMessage = "El valor para Gender no es válido.")]
    public GenderType Gender { get; set; }
    [StringLength(15, MinimumLength = 8, ErrorMessage = "PhoneNumber debe tener entre 1 y 50 caracteres")]
    [RegularExpression(@"^\+?\d{8,15}$", ErrorMessage = "PhoneNumber invalido")]
    public string? PhoneNumber { get; set; }
    [Required]
    public string Username { get; set; } = string.Empty;
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Password es requerido")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "NewPassword debe tener entre 8 y 100 caracteres")]
    [RegularExpression(
      @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$",
      ErrorMessage = "NewPassword debe contener al menos una mayuscula, una minuscula, un numero y un simbolo"
    )]
    public string Password { get; set; } = string.Empty;
    [Required(ErrorMessage = "ConfirmPassword es requerido")]
    [Compare("NewPassword", ErrorMessage = "Las contraseñas no coinciden")]
    public string ConfirmPassword { get; set; } = null!;
    [Required]
    [MinLength(1, ErrorMessage = "RolesId debe tener por lo menos 1 rol")]
    public List<long> RolesId { get; set; } = new();
  }
}