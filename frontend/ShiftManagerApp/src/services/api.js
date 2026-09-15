export const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5256/').replace(/\/+$/, '');
export const API_BASE_URL = BASE_URL;

/**
 * @param {string} endpoint - Ruta del endpoint
 * @param {RequestInit} options - Opciones de fetch
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  /** @type {Record<string, any>} */
  const headers = { ...options.headers };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  } else if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Configuraciones por defecto
  /** @type {RequestInit} */
  const config = {
    ...options,
    headers,
    credentials: 'include'
  };

  try {
    const response = await fetch(url, config);

    // Si la sesión expiró en cualquier petición que NO sea el login
    if (response.status === 401 && !endpoint.includes('/login')) {
      localStorage.removeItem('user');
      window.location.href = '/';
      throw new Error('Sesión expirada o no autorizada.');
    }

    // 204 No Content no tiene cuerpo que parsear
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("json")) {
      const data = await response.json();

      if (!response.ok) {
        const validationError = data.errors ? Object.values(data.errors).flat()[0] : null;
        const message = validationError || data.message || data.title || 'Ocurrió un error en la solicitud.';
        const error = Object.assign(new Error(message), {
          errors: data.errors,
          status: response.status,
          data: data
        });
        throw error;
      }

      return data;
    }

    if (!response.ok) {
      const statusInfo = response.statusText ? `${response.status} ${response.statusText}` : `${response.status}`;
      throw new Error(`Error en el servidor: ${statusInfo}`);
    }

    return null;
  } catch (error) {
    if (error instanceof TypeError || error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.');
    }
    throw error;
  }
}
