using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record UpdateShiftDto
  {
    [Range(1, long.MaxValue, ErrorMessage = "ProviderId inválido")]
    public long? ProviderId { get; init; }

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime StartAt { get; init; }

    [Required]
    [MinLength(1, ErrorMessage = "Debe seleccionar al menos un servicio")]
    public List<UpdateShiftItemDto> Items { get; init; } = new();
  }
}