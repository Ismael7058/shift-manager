namespace ShiftManagerApi.Entity
{
  public class WorkSchedules
  {
    public long Id { get; set; }
    public long ProviderId { get; set; }
    public int DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsActive { get; set; }

    public UserAuth UserAuth { get; set; } = null!;
  }
}     