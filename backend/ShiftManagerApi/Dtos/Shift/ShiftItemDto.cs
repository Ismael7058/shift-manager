namespace ShiftManagerApi.Dtos
{
  public record ShiftItemDto
  {
    public long Id { get; init; }
    public long ShiftId { get; init; }
    public long ServiceId { get; init; }
    public string NameService { get; init; }  = null!;
    public int DurationMinutes { get; init; }
    public decimal PriceAtMoment { get; init; }
  }
}