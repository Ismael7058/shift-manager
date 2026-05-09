namespace ShiftManagerApi.Dtos
{
  public record DateRangeDto
  {
    public DateTime StartAt { get; init; }
    public DateTime EndAt { get; init; }
  }
  
}