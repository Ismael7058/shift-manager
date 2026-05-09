namespace ShiftManagerApi.Dtos
{
  public record UpdateWorkSchedulesDto
  {
    public int DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
  }
}