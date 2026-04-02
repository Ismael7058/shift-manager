using System.ComponentModel.DataAnnotations;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Dtos
{
  public record ShiftFilterDto
  {

    [Range(1, int.MaxValue, ErrorMessage = "ProviderId debe ser mayor a 0")]
    public long? ProviderId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "ClientId debe ser mayor a 0")]
    public long? ClientId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "ServiceId debe ser mayor a 0")]
    public long? ServiceId { get; set; }

    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }

    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }

    public List<ShiftStatus>? Statuses { get; set; }

    public string? SearchTerm { get; set; }

    public string? SortBy { get; set; }
    public bool IsDescending { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "PageNumber debe ser mayor a 0")]
    public int PageNumber { get; set; } = 1;

    [Range(1, 100, ErrorMessage = "PageSize debe estar entre 1 y 100")]
    public int PageSize { get; set; } = 10;
  }
}