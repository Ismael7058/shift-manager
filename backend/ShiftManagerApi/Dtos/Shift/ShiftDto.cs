namespace ShiftManagerApi.Dtos
{
  public record ShiftDto
  {
    public long Id { get; init; }
    public long ProviderId { get; init; }
    public string ProviderFullName { get; init; } = string.Empty;
    public long ClientId { get; init; }
    public string ClientFullName { get; init; } = string.Empty;
    public DateTime StartAt { get; init; }
    public DateTime EndAt { get; init; }
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public List<ShiftItemDto> Items { get; init; } = new();

    public decimal TotalAmount => Items.Sum(x => x.PriceAtMoment);
    public long CreatedById { get; init; }
    public string CreatedByRole { get; init; } = string.Empty;
    public long? ConfirmedById { get; init; }
    public long? CanceledById { get; init; }
    public UserResumDto CreatedByUser { get; set; } = null!;
    public UserResumDto? ConfirmedByUser { get; set; }
    public UserResumDto? CanceledByUser { get; set; }
  }
}