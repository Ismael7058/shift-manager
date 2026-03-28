namespace ShiftManagerApi.Dtos
{
  public record ServiceDto
  {
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int DurationMinutes { get; set; }
    public bool IsActive { get; set; }
  }
}