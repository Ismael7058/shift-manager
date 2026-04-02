namespace ShiftManagerApi.Dtos
{
  public record CreateWorkSchedulesDto
  {
    public int DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
  }
}