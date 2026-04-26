/**
 * API Service for Frontend-Backend Communication
 */

const API_BASE_URL = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) return {} as T;

    return response.json();
}

export const api = {
    // Auth
    auth: {
        login: (credentials: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
        register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        logout: () => request<any>('/auth/logout', { method: 'POST' }),
        me: () => request<any>('/auth/me'),
    },

    // Users
    users: {
        getAll: () => request<any[]>('/users'),
        getById: (id: string) => request<any>(`/users/${id}`),
        create: (data: any) => request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
        updateStatus: (id: string, status: string) => request<any>(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
        delete: (id: string) => request<any>(`/users/${id}`, { method: 'DELETE' }),
    },

    // Books
    books: {
        getAll: () => request<any[]>('/books'),
        search: (query: string) => request<any[]>(`/books/search?q=${encodeURIComponent(query)}`),
        create: (data: any) => request<any>('/books', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request<any>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<any>(`/books/${id}`, { method: 'DELETE' }),
    },

    // Categories
    categories: {
        getAll: () => request<any[]>('/categories'),
        create: (data: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<any>(`/categories/${id}`, { method: 'DELETE' }),
    },

    // Loans
    loans: {
        getAll: () => request<any[]>('/loans'),
        getByUser: (userId: string) => request<any[]>(`/loans/user/${userId}`),
        borrow: (data: { book_id: string, user_id: string }) => request<any>('/loans', { method: 'POST', body: JSON.stringify(data) }),
        return: (id: string) => request<any>(`/loans/${id}/return`, { method: 'PATCH' }),
        extend: (id: string) => request<any>(`/loans/${id}/extend`, { method: 'PATCH' }),
        payPenalty: (id: string) => request<any>(`/loans/${id}/pay-penalty`, { method: 'PATCH' }),
    },

    // Reservations
    reservations: {
        getAll: () => request<any[]>('/reservations'),
        getByUser: (userId: string) => request<any[]>(`/reservations/user/${userId}`),
        create: (data: { book_id: string, user_id: string }) => request<any>('/reservations', { method: 'POST', body: JSON.stringify(data) }),
        cancel: (id: string) => request<any>(`/reservations/${id}/cancel`, { method: 'PATCH' }),
        convert: (id: string) => request<any>(`/reservations/${id}/convert`, { method: 'PATCH' }),
    }
};
