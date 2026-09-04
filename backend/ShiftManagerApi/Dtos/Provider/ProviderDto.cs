namespace ShiftManagerApi.Dtos
{
  public record ProviderDto
  {
    public long Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PictureURL { get; set; }
    public List<ProviderServiceDto> Service { get; set; } = null!;
    public List<WorkSchedulesDto> Works { get; set; } = null!;
    public List<DateRangeDto> RestrictedDates { get; set; } = null!;
  }
}