namespace ShiftManagerApi.Entity
{
  public class Shift
  {
    public long Id { get; set; }
    public long ProviderId { get; set; }
    public long ClientId { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public ShiftStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public UserAuth Provider { get; set; } = null!;
    public UserAuth Client { get; set; } = null!;
    public List<ShiftItems> ShiftItems { get; set; } = new();
  }

  public enum ShiftStatus
  {
   pending,
   confirmed,
   canceled,
   completed,
   no_show
  }
}