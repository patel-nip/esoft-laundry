const API_BASE_URL = 'http://localhost:5000/api';
// Remove trailing slash ↑

function getAuthToken() {
    return localStorage.getItem('token');
}

async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Check if response is OK before parsing JSON
        if (!response.ok) {
            const text = await response.text();
            console.error('API Error:', response.status, text);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Auth API
export const authAPI = {
    login: (username, password) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    getMe: () => apiRequest('/auth/me'),
};

// Customers API
export const customersAPI = {
    getAll: (search = '') => {
        const timestamp = `_t=${Date.now()}`; // Cache buster
        const searchParam = search ? `search=${search}&` : '';
        return apiRequest(`/customers?${searchParam}${timestamp}`);
    },

    getById: (id) => apiRequest(`/customers/${id}`),

    create: (customerData) =>
        apiRequest('/customers', {
            method: 'POST',
            body: JSON.stringify(customerData),
        }),

    update: (id, customerData) =>
        apiRequest(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(customerData),
        }),

    delete: (id) =>
        apiRequest(`/customers/${id}`, {
            method: 'DELETE',
        }),
};

// Orders API
export const ordersAPI = {
    getAll: (status = '') =>
        apiRequest(`/orders${status ? `?status=${status}` : ''}`),

    getById: (id) => apiRequest(`/orders/${id}`),

    create: (orderData) =>
        apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        }),

    update: (id, orderData) =>
        apiRequest(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(orderData),
        }),

    delete: (id) =>
        apiRequest(`/orders/${id}`, {
            method: 'DELETE',
        }),

    addPayment: (id, paymentData) =>
        apiRequest(`/orders/${id}/payments`, {
            method: 'POST',
            body: JSON.stringify(paymentData),
        }),
};

// Reports API
export const reportsAPI = {
    getServices: (from, to) =>
        apiRequest(`/reports/services?from=${from}&to=${to}`),

    getOrdersByDate: (date) =>
        apiRequest(`/reports/orders-by-date?date=${date}`),

    getCustomerReport: (customerId) =>
        apiRequest(`/reports/customer/${customerId}`),

    getCompletedOrders: (from, to) =>
        apiRequest(`/reports/completed-orders?from=${from}&to=${to}`),
};

// NCF API
export const ncfAPI = {
    getRanges: () => apiRequest('/ncf/ranges'),

    getRangeById: (id) => apiRequest(`/ncf/ranges/${id}`),

    createRange: (rangeData) =>
        apiRequest('/ncf/ranges', {
            method: 'POST',
            body: JSON.stringify(rangeData),
        }),

    updateRange: (id, rangeData) =>
        apiRequest(`/ncf/ranges/${id}`, {
            method: 'PUT',
            body: JSON.stringify(rangeData),
        }),

    getConfig: () => apiRequest('/ncf/config'),

    updateConfig: (configData) =>
        apiRequest('/ncf/config', {
            method: 'PUT',
            body: JSON.stringify(configData),
        }),
};


// Helper to save/remove token
export const authHelpers = {
    saveToken: (token) => localStorage.setItem('token', token),
    removeToken: () => localStorage.removeItem('token'),
    getToken: () => localStorage.getItem('token'),
};

export const servicePricesAPI = {
    getAll: () => apiRequest('/service-prices'),

    getById: (id) => apiRequest(`/service-prices/${id}`),

    create: (priceData) =>
        apiRequest('/service-prices', {
            method: 'POST',
            body: JSON.stringify(priceData),
        }),

    update: (id, priceData) =>
        apiRequest(`/service-prices/${id}`, {
            method: 'PUT',
            body: JSON.stringify(priceData),
        }),

    delete: (id) =>
        apiRequest(`/service-prices/${id}`, {
            method: 'DELETE',
        }),
};

export const companyAPI = {
    get: () => apiRequest('/company'),

    update: (companyData) =>
        apiRequest('/company', {
            method: 'PUT',
            body: JSON.stringify(companyData),
        }),
};

export const invoiceSettingsAPI = {
    get: () => apiRequest('/invoice-settings'),

    update: (settingsData) =>
        apiRequest('/invoice-settings', {
            method: 'PUT',
            body: JSON.stringify(settingsData),
        }),
};

export const usersAPI = {
    getAll: () => apiRequest('/users'),

    getById: (id) => apiRequest(`/users/${id}`),

    create: (userData) =>
        apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    update: (id, userData) =>
        apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        }),

    delete: (id) =>
        apiRequest(`/users/${id}`, {
            method: 'DELETE',
        }),
};

export const rolesAPI = {
    getMatrix: () => apiRequest('/roles/matrix'),

    getByRole: (role) => apiRequest(`/roles/${role}`),

    updatePermission: (permissionData) =>
        apiRequest('/roles/permission', {
            method: 'PUT',
            body: JSON.stringify(permissionData),
        }),

    updateBulk: (permissionsData) =>
        apiRequest('/roles/permissions/bulk', {
            method: 'PUT',
            body: JSON.stringify(permissionsData),
        }),
};

export const printersAPI = {
    get: () => apiRequest('/printers'),

    update: (settingsData) =>
        apiRequest('/printers', {
            method: 'PUT',
            body: JSON.stringify(settingsData),
        }),
};

export const backupAPI = {
    get: () => apiRequest('/backup'),

    update: (configData) =>
        apiRequest('/backup', {
            method: 'PUT',
            body: JSON.stringify(configData),
        }),

    trigger: () =>
        apiRequest('/backup/trigger', {
            method: 'POST',
        }),
};
