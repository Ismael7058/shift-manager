namespace ShiftManagerApi.Entity
{
  public class ServiceImage
  {
    public long Id { get; set; }
    public long ServiceId { get; set; }
    public string ImageUrl { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Service Service { get; set; } = null!;
  }
}
