namespace ShiftManagerApi.Dtos
{
  public record ProviderServiceDto
  {
    public long Id { get; set; }
    public long ProviderId { get; set; }
    public long ServiceId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int DurationMinutes { get; set; }
    public int DurationMinutesBase { get; set; }
    public decimal Price { get; set; }
  }
}