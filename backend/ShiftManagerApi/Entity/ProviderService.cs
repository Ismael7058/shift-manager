namespace ShiftManagerApi.Entity
{
  public class ProviderService
  {
    public long ProviderId { get; set; }
    public long ServiceId { get; set; }
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Service Service { get; set;} = null!;
    public UserProfile Provider { get; set; } = null!;
  }
}