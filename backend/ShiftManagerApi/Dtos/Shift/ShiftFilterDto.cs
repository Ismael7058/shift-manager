using System.ComponentModel.DataAnnotations;
using ShiftManagerApi.Entity;

namespace ShiftManagerApi.Dtos
{
  public record ShiftFilterDto
  {
    [Range(1, int.MaxValue, ErrorMessage = "ServiceId debe ser mayor a 0")]
    public long? ServiceId { get; set; }

    private DateTime? _dateFrom;
    public DateTime? DateFrom
    {
        get => _dateFrom;
        set => _dateFrom = value.HasValue ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null;
    }

    private DateTime? _dateTo;
    public DateTime? DateTo
    {
        get => _dateTo;
        set => _dateTo = value.HasValue ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null;
    }


    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }

    public string? Statuses { get; set; }

    public string? ProviderName { get; set; }
    public string? ClientName { get; set; }

    public string? SortBy { get; set; }
    public bool IsDescending { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "PageNumber debe ser mayor a 0")]
    public int PageNumber { get; set; } = 1;

    [Range(1, 100, ErrorMessage = "PageSize debe estar entre 1 y 100")]
    public int PageSize { get; set; } = 10;
  }
}