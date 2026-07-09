namespace ShiftManagerApi.Dtos
{
  public record RoleResponseDto
    {
    public long Id { get; init; }
    public string Name { get; init; } = string.Empty;
    }
}
