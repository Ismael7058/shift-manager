namespace ShiftManagerApi.Dtos
{
  public record ServiceImageDto
  {
    public long Id { get; set; }
    public long ServiceId { get; set; }
    public string ImageUrl { get; set; } = null!;
  }
}
