using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record CreateShiftItemDto
  {
    [Required]
    [Range(1, long.MaxValue, ErrorMessage = "ServiceId inválido")]
    public long ServiceId { get; init; }
  }
}