namespace ShiftManagerApi.Dtos
{
  public record WorkSchedulesDto
  {
    public long Id { get; set; }
    public long ProviderId { get; set; }
    public int DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsActive { get; set; }
  }
}