namespace ShiftManagerApi.Dtos
{
  public record CreateProviderServiceDto
  {
    public long ServiceId { get; set; }
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
  }
}