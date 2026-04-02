namespace ShiftManagerApi.Entity
{
  public class ShiftItems
  {
    public long Id { get; set; }
    public long ShiftId { get; set; }
    public long ServiceId { get; set; }
    public decimal PriceAtMoment { get; set; }

    public Shift Shift {get; set;} = null!;
    public Service Service {get; set;} = null!;
  }
}