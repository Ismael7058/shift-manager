/**
 * Parsea una fecha/hora (string ISO con 'Z' o Date) a un Date local
 * preservando exactamente los componentes numéricos (año, mes, día, hora, minuto)
 * sin sufrir desplazamiento de zona horaria (UTC-3).
 *
 * @param {string|Date} dateInput 
 * @returns {Date|null}
 */
export const parseDateToLocal = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return dateInput;

  const str = String(dateInput);
  const d = new Date(str);
  if (isNaN(d.getTime())) return null;

  if (str.endsWith('Z') || str.includes('+00:00')) {
    return new Date(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds()
    );
  }

  return d;
};
