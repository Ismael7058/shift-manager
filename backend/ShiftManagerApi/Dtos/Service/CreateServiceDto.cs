using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record CreateServiceDto
  {
    [Required]
    [RegularExpression(@"^[\p{L}\s]+$", ErrorMessage = "FirstName solo puede contener letras y espacios")]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "DurationMinutes debe ser mayor a 0")]
    public int DurationMinutes { get; set; }
  }
}