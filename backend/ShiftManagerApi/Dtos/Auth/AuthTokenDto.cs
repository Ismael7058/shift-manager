namespace ShiftManagerApi.Dtos
{
    public record AuthTokenDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateOnly Expiration { get; set; }
        public UserDto User { get; set; } = new UserDto();
    }
}