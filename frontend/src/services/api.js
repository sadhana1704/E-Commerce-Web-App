const API_BASE_URL = '/api';

/**
 * Custom fetch wrapper that adds JSON headers and Bearer token if available
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('aura_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth API
  auth: {
    register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me', { method: 'GET' }),
    updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),
  },

  // Products API
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value);
        }
      });
      const queryString = query.toString();
      return request(`/products${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
    },
    getById: (id) => request(`/products/${id}`, { method: 'GET' }),
    getCategories: () => request('/products/categories', { method: 'GET' }),
    create: (productData) => request('/products', { method: 'POST', body: productData }),
    update: (id, productData) => request(`/products/${id}`, { method: 'PUT', body: productData }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  },

  // Orders API
  orders: {
    create: (orderData) => request('/orders', { method: 'POST', body: orderData }),
    getMyOrders: () => request('/orders', { method: 'GET' }),
    getById: (id) => request(`/orders/${id}`, { method: 'GET' }),
  },

  // Admin API
  admin: {
    getStats: () => request('/admin/stats', { method: 'GET' }),
    getAllOrders: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value);
        }
      });
      const queryString = query.toString();
      return request(`/admin/orders${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
    },
    updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: { status } }),
  },
};
