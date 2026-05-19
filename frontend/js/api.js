/**
 * API Service for Vanilla JS Frontend
 */

const API_BASE_URL = '/api';

async function request(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;
    
    // Default headers
    const headers = { ...options.headers };
    
    // Don't set Content-Type if it's FormData (browser will set it with boundary)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (response.status === 401 && !path.includes('/auth/login') && !path.includes('/auth/me')) {
        window.location.href = '/login.html';
        return;
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) return {};

    return response.json();
}

const api = {
    auth: {
        login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
        register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        logout: () => request('/auth/logout', { method: 'POST' }),
        me: () => request('/auth/me'),
    },
    users: {
        getAll: () => request('/users'),
        getById: (id) => request(`/users/${id}`),
        create: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
        updateStatus: (id, status) => request(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
        delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
    },
    books: {
        getAll: () => request('/books'),
        getById: (id) => request(`/books/${id}`),
        search: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
        create: (data) => request('/books', { 
            method: 'POST', 
            body: data instanceof FormData ? data : JSON.stringify(data) 
        }),
        update: (id, data) => request(`/books/${id}`, { 
            method: 'POST', // Use POST for updates to support multipart/form-data
            body: data instanceof FormData ? data : JSON.stringify(data) 
        }),
        delete: (id) => request(`/books/${id}`, { method: 'DELETE' }),
    },
    categories: {
        getAll: () => request('/categories'),
        create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
    },
    loans: {
        getAll: () => request('/loans'),
        getByUser: (userId) => request(`/loans/user/${userId}`),
        borrow: (data) => request('/loans', { method: 'POST', body: JSON.stringify(data) }),
        return: (id) => request(`/loans/${id}/return`, { method: 'PATCH' }),
        extend: (id) => request(`/loans/${id}/extend`, { method: 'PATCH' }),
        payPenalty: (id) => request(`/loans/${id}/pay-penalty`, { method: 'PATCH' }),
    },
    reservations: {
        getAll: () => request('/reservations'),
        getByUser: (userId) => request(`/reservations/user/${userId}`),
        create: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
        cancel: (id) => request(`/reservations/${id}/cancel`, { method: 'PATCH' }),
        convert: (id) => request(`/reservations/${id}/convert`, { method: 'PATCH' }),
    }
};

window.api = api;

/**
 * Performance Booster: Link Preloading & Interaction
 * Makes the app feel like an SPA by starting page loads on hover
 */
document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin) && link.href.endsWith('.html')) {
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = link.href;
        document.head.appendChild(prefetch);
    }
}, { passive: true });

// Optional: Subtle vibration on click for mobile "premium" feel
document.addEventListener('click', (e) => {
    if (e.target.closest('a') && window.navigator.vibrate) {
        window.navigator.vibrate(5);
    }
}, { passive: true });
