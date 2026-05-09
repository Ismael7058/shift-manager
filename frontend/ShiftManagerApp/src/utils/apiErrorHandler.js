/**
 * Centraliza el manejo de errores de la API.
 * @param {Error} err - El error capturado en el catch.
 * @param {Function} expireSession - Función para invalidar la sesión sin redirigir.
 * @returns {string} Mensaje de error para el usuario.
 */
export const handleApiError = (err, expireSession) => {
  const message = err.message || '';

  if (message.includes('401') || message.includes('Unexpected end of JSON input')) {
    if (expireSession) expireSession();
    return "Tu sesión ha expirado o no tienes permisos para esta acción.";
  }

  if (message.includes('500')) return "Error en el servidor. Intenta más tarde.";
  if (message.includes('400')) return "Solicitud inválida. Revisa los datos.";
  
  return "Error de conexión. Revisa tu internet.";
};