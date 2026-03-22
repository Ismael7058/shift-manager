using System.ComponentModel.DataAnnotations;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Dtos
{
  public record RegisterDto
  {
    [Required]
    [StringLength(50, ErrorMessage = "FirstName no puede superar los 50 caracteres")]
    [RegularExpression(
      @"^[A-Za-z\s]+$",
      ErrorMessage = "FirstName solo puede contener letras, espacios y sin tildes"
    )]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [StringLength(50, ErrorMessage = "LastName no puede superar los 50 caracteres")]
    [RegularExpression(
      @"^[A-Za-z\s]+$",
      ErrorMessage = "LastName solo puede contener letras, espacios y sin tildes"
    )]
    public string LastName { get; set; } = string.Empty;
    [Required]
    public DateOnly DateOfBirth { get; set; }
    [Required]
    public GenderType Gender { get; set; }
    [RegularExpression(
      @"^\+?\d{8,15}$",
      ErrorMessage = "PhoneNumber debe tener solo numeros y puede empezar con +, entre 8 y 15 digitos"
    )]
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