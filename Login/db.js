// ════════════════════════════════════════════════════════════════════════════════
// db.js - Database API Handler (Versión Mejorada)
// ════════════════════════════════════════════════════════════════════════════════

const API_URL = "http://localhost:3000";

const DB = {
    // ────────────────────────────────────────────────
    // UTILIDADES PRIVADAS
    // ────────────────────────────────────────────────
    _handleResponse: async (response) => {
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorData || response.statusText}`);
        }
        
        // Verificar si hay contenido en la respuesta
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    },

    _handleError: (error, context = '') => {
        console.error(`[DB Error${context ? ` - ${context}` : ''}]:`, error);
        
        // Mensajes de error más amigables
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return {
                success: false,
                error: 'No se pudo conectar al servidor. Verifica que el servidor esté ejecutándose.',
                details: error.message
            };
        }
        
        return {
            success: false,
            error: error.message || 'Error desconocido',
            details: error
        };
    },

    _validateEndpoint: (endpoint) => {
        if (!endpoint || typeof endpoint !== 'string') {
            throw new Error('Endpoint inválido');
        }
        // Sanitizar endpoint para prevenir inyecciones
        return endpoint.replace(/[^a-zA-Z0-9_-]/g, '');
    },

    // ────────────────────────────────────────────────
    // CRUD GENÉRICO
    // ────────────────────────────────────────────────
    get: async (endpoint, params = {}) => {
        try {
            endpoint = DB._validateEndpoint(endpoint);
            
            // Construir query string desde params
            const queryString = Object.keys(params).length > 0
                ? '?' + new URLSearchParams(params).toString()
                : '';
            
            const response = await fetch(`${API_URL}/${endpoint}${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await DB._handleResponse(response);
            return { success: true, data };
        } catch (error) {
            return DB._handleError(error, `GET ${endpoint}`);
        }
    },

    getById: async (endpoint, id) => {
        try {
            endpoint = DB._validateEndpoint(endpoint);
            
            if (!id) {
                throw new Error('ID requerido');
            }
            
            const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await DB._handleResponse(response);
            return { success: true, data };
        } catch (error) {
            return DB._handleError(error, `GET ${endpoint}/${id}`);
        }
    },

    insert: async (endpoint, item) => {
        try {
            endpoint = DB._validateEndpoint(endpoint);
            
            if (!item || typeof item !== 'object') {
                throw new Error('Item inválido');
            }
            
            // Generar ID solo si no existe
            if (!item.id) {
                item.id = Date.now();
            }
            
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
            
            const data = await DB._handleResponse(response);
            return { success: true, data };
        } catch (error) {
            return DB._handleError(error, `INSERT ${endpoint}`);
        }
    },

    update: async (endpoint, id, data) => {
        try {
            endpoint = DB._validateEndpoint(endpoint);
            
            if (!id) {
                throw new Error('ID requerido');
            }
            
            if (!data || typeof data !== 'object') {
                throw new Error('Datos inválidos');
            }
            
            const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await DB._handleResponse(response);
            return { success: true, data: result };
        } catch (error) {
            return DB._handleError(error, `UPDATE ${endpoint}/${id}`);
        }
    },

    replace: async (endpoint, id, data) => {
        try {
            endpoint = DB._validateEndpoint(endpoint);
            
            if (!id) {
                throw new Error('ID requerido');
            }
            
            if (!data || typeof data !== 'object') {
                throw new Error('Datos inválidos');
            }
            
            const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await DB._handleResponse(response);
            return { success: true, data: result };
        } catch (error) {
            return DB._handleError(error, `REPLACE ${endpoint}/${id}`);
        }
    },

    delete: async (endpoint, id) => {
        try {
            endpoint = DB._validateEndpoint(endpoint);
            
            if (!id) {
                throw new Error('ID requerido');
            }
            
            const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'DELETE'
            });
            
            await DB._handleResponse(response);
            return { success: true, message: 'Eliminado correctamente' };
        } catch (error) {
            return DB._handleError(error, `DELETE ${endpoint}/${id}`);
        }
    },

    // ────────────────────────────────────────────────
    // AUTENTICACIÓN Y SESIÓN
    // ────────────────────────────────────────────────
    login: async (username, pass) => {
        try {
            // Validar inputs
            if (!username || !pass) {
                throw new Error('Usuario y contraseña son requeridos');
            }

            // Sanitizar username para prevenir inyecciones
            const sanitizedUsername = username.trim().replace(/[^a-zA-Z0-9_]/g, '');
            
            const result = await DB.get('users', { 
                username: sanitizedUsername, 
                pass: pass 
            });
            
            if (!result.success) {
                return {
                    success: false,
                    error: 'Error al conectar con el servidor'
                };
            }
            
            const users = result.data;
            
            if (users && users.length > 0) {
                const user = users[0];
                
                // No guardar la contraseña en sessionStorage
                const userSession = {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    role: user.role,
                    avatar: user.avatar,
                    loginTime: new Date().toISOString()
                };
                
                sessionStorage.setItem('activeUser', JSON.stringify(userSession));
                sessionStorage.setItem('isAuthenticated', 'true');
                
                return { success: true, user: userSession };
            }
            
            return {
                success: false,
                error: 'Credenciales incorrectas'
            };
        } catch (error) {
            return DB._handleError(error, 'LOGIN');
        }
    },

    register: async (name, username, pass, role = 'user') => {
        try {
            // Validaciones
            if (!name || !username || !pass) {
                throw new Error('Todos los campos son requeridos');
            }

            if (username.length < 3) {
                throw new Error('El usuario debe tener al menos 3 caracteres');
            }

            if (pass.length < 4) {
                throw new Error('La contraseña debe tener al menos 4 caracteres');
            }

            // Sanitizar inputs
            const sanitizedUsername = username.trim().replace(/[^a-zA-Z0-9_]/g, '');
            const sanitizedName = name.trim();

            // Verificar si el usuario ya existe
            const checkResult = await DB.get('users', { username: sanitizedUsername });
            
            if (!checkResult.success) {
                throw new Error('Error al verificar usuario existente');
            }
            
            const existing = checkResult.data;
            
            if (existing && existing.length > 0) {
                throw new Error('El usuario ya existe');
            }
            
            // Crear nuevo usuario
            const newUser = {
                name: sanitizedName,
                username: sanitizedUsername,
                pass: pass, // NOTA: En producción, esto debería estar hasheado
                role: role === 'admin' ? 'admin' : 'user',
                avatar: 'bi-person',
                createdAt: new Date().toISOString()
            };
            
            const insertResult = await DB.insert('users', newUser);
            
            if (!insertResult.success) {
                throw new Error('Error al crear usuario');
            }
            
            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                data: insertResult.data
            };
        } catch (error) {
            return DB._handleError(error, 'REGISTER');
        }
    },

    logout: () => {
        try {
            // Limpiar toda la sesión
            sessionStorage.removeItem('activeUser');
            sessionStorage.removeItem('isAuthenticated');
            sessionStorage.clear();
            
            // Redirigir al login
            window.location.href = '../Login/login.html';
            
            return { success: true };
        } catch (error) {
            console.error('Error en logout:', error);
            // Intentar redirigir de todas formas
            window.location.href = '../Login/login.html';
        }
    },

    checkSession: () => {
        try {
            const userStr = sessionStorage.getItem('activeUser');
            const isAuthenticated = sessionStorage.getItem('isAuthenticated');
            
            if (!userStr || !isAuthenticated || isAuthenticated !== 'true') {
                console.warn('Sesión no válida, redirigiendo al login');
                window.location.href = '../Login/login.html';
                return null;
            }
            
            const user = JSON.parse(userStr);
            
            // Validar que el objeto de usuario tenga los campos necesarios
            if (!user.id || !user.username || !user.role) {
                console.warn('Datos de sesión corruptos, redirigiendo al login');
                DB.logout();
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            DB.logout();
            return null;
        }
    },

    checkAdmin: () => {
        try {
            const user = DB.checkSession();
            
            if (!user) {
                return null;
            }
            
            if (user.role !== 'admin') {
                alert('Acceso denegado. Se requieren permisos de administrador.');
                window.location.href = '../indexLP.html';
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Error al verificar admin:', error);
            DB.logout();
            return null;
        }
    },

    isAuthenticated: () => {
        const isAuth = sessionStorage.getItem('isAuthenticated');
        const user = sessionStorage.getItem('activeUser');
        return isAuth === 'true' && user !== null;
    },

    getCurrentUser: () => {
        try {
            const userStr = sessionStorage.getItem('activeUser');
            if (!userStr) return null;
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error al obtener usuario actual:', error);
            return null;
        }
    },

    // ────────────────────────────────────────────────
    // FUNCIONES ESPECÍFICAS DE PRODUCTOS
    // ────────────────────────────────────────────────
    getProducts: async () => {
        return await DB.get('products');
    },

    getProductById: async (id) => {
        return await DB.getById('products', id);
    },

    createProduct: async (product) => {
        // Validar campos requeridos
        if (!product.name || !product.price) {
            return {
                success: false,
                error: 'Nombre y precio son requeridos'
            };
        }
        
        const productData = {
            name: product.name.trim(),
            price: parseFloat(product.price) || 0,
            state: product.state || 'borrador',
            img: product.img || 'https://via.placeholder.com/150/FF8C00/FFFFFF?text=Producto',
            desc: product.desc || '',
            createdAt: new Date().toISOString()
        };
        
        return await DB.insert('products', productData);
    },

    updateProduct: async (id, product) => {
        return await DB.update('products', id, product);
    },

    deleteProduct: async (id) => {
        return await DB.delete('products', id);
    },

    // ────────────────────────────────────────────────
    // HEALTH CHECK
    // ────────────────────────────────────────────────
    healthCheck: async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            return {
                success: response.ok,
                status: response.status,
                message: response.ok ? 'Servidor conectado' : 'Servidor no disponible'
            };
        } catch (error) {
            return {
                success: false,
                status: 0,
                message: 'No se pudo conectar al servidor',
                error: error.message
            };
        }
    }
};

// ────────────────────────────────────────────────
// EXPORTAR (si se usa como módulo)
// ────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DB;
}