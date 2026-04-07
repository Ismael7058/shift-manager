const API_URL = "http://localhost:5256";

export const loginRequest = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }

  return response.json();
};

export const logoutRequest = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let message = 'Error al cerrar sesión.';
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {}
    throw new Error(message);
  }

  return true;
};