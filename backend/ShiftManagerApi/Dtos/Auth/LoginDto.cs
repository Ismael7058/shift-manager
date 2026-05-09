using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
    public record LoginDto
    {
        [Required]
        public string Identifier { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}