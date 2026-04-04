using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record CreateShiftDto
  {
    [Required]
    [Range(1, long.MaxValue, ErrorMessage = "ProviderId inválido")]
    public long ProviderId { get; init; }

    [Required]
    public DateTime StartAt { get; init; }

    [Required]
    [MinLength(1, ErrorMessage = "Debe seleccionar al menos un servicio")]
    public List<CreateShiftItemDto> Items { get; init; } = new();
  }
}