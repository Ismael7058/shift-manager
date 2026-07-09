namespace ShiftManagerApi.Dtos
{
  public record UpdateProviderServiceDto
  {
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
  }
}