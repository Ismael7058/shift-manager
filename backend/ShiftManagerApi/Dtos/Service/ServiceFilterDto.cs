using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public record ServiceFilterDto
  {
    [RegularExpression(@"^[\p{L}\s]+$", ErrorMessage = "Name solo puede contener letras y espacios")]
    public string? Name { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "DurationMinutes debe ser mayor a 0")]
    public int? DurationMinutes { get; set; }
    public int? IsActive { get; set; }
    public string? SortBy { get; set; }
    public bool IsDescending { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "PageNumber debe ser mayor a 0")]
    public int PageNumber { get; set; } = 1;

    [Range(1, 100, ErrorMessage = "PageSize debe estar entre 1 y 100")]
    public int PageSize { get; set; } = 10;
  }
}