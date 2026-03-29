namespace ShiftManagerApi.Dtos
{
  public record UpdateProviderServiceDto
  {
    public long ServiceId { get; set; }
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
  }
}