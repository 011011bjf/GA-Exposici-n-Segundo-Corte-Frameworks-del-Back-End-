const API_BASE_URL = 'http://localhost:8080/api';

const authStore = {
    getToken() {
        return localStorage.getItem('accessToken');
    },
    setToken(token) {
        localStorage.setItem('accessToken', token);
    },
    removeToken() {
        localStorage.removeItem('accessToken');
    }
};

async function fetchWithAuth(url, options = {}) {
    const token = authStore.getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    let response = await fetch(`${API_BASE_URL}${url}`, config);

    if (response.status === 401) {
        // Podríamos intentar refresh token aquí, pero para mantenerlo sencillo:
        authStore.removeToken();
        // Redirigir al login si no estamos ya allí
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    return response;
}
