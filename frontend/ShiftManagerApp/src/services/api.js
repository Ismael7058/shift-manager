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
  } else {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
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

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ocurrió un error en la solicitud.');
      }
      return data;
    }

    if (!response.ok) {
      throw new Error('Error en el servidor: ' + response.statusText);
    }

    return null;
  } catch (error) {
    if (error instanceof TypeError || error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.');
    }
    throw error;
  }
}
