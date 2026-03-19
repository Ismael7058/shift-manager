namespace ShiftMangerApi.Entity
{
  public class Role
  {
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
  }
}