using System.ComponentModel.DataAnnotations;

namespace ShiftManagerApi.Dtos
{
  public class EditPasswordProfileDto
  {
    [Required(ErrorMessage = "OldPassword es requerido")]
    public string OldPassword { get; set;} = null!;

    [Required(ErrorMessage = "NewPassword es requerido")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "NewPassword debe tener entre 8 y 100 caracteres")]
    [RegularExpression(
      @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$",
      ErrorMessage = "NewPassword debe contener al menos una mayuscula, una minuscula, un numero y un simbolo"
    )]
    public string NewPassword { get; set; } = null!;

    [Required(ErrorMessage = "ConfirmPassword es requerido")]
    [Compare("NewPassword", ErrorMessage = "Las contraseñas no coinciden")]
    public string ConfirmPassword { get; set; } = null!;
  }
}