const BASE_URL = 'http://localhost:5226/api';

/**
 * @param {string} endpoint - Ruta del endpoint
 * @param {RequestInit} options - Opciones de fetch
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  // Configuraciones por defecto
  /** @type {RequestInit} */
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include'
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/';
      throw new Error('Sesión expirada o no autorizada.');
    }

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
    console.error(`Error Fetching ${endpoint}:`, error);
    throw error;
  }
}
