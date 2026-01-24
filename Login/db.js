const API_URL = "http://localhost:3000";

const DB = {
    // --- CRUD GENÉRICO ---
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`);
            return await response.json();
        } catch (error) { console.error(error); return []; }
    },

    insert: async (endpoint, item) => {
        if (!item.id) item.id = Date.now();
        await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
    },

    update: async (endpoint, id, data) => {
        await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    delete: async (endpoint, id) => {
        await fetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
    },

    // --- AUTH ---
    login: async (username, pass) => {
        const response = await fetch(`${API_URL}/users?username=${username}&pass=${pass}`);
        const users = await response.json();
        if (users.length > 0) {
            sessionStorage.setItem('activeUser', JSON.stringify(users[0]));
            return users[0];
        }
        return null;
    },

    register: async (name, username, pass, role = 'user') => {
        const check = await fetch(`${API_URL}/users?username=${username}`);
        const existing = await check.json();
        if (existing.length > 0) throw new Error("Usuario ya existe");
        
        await DB.insert('users', { name, username, pass, role, avatar: 'bi-person' });
    },

    // para salir de la cuenta
    logout: () => {
        sessionStorage.removeItem('activeUser');
        window.location.href = './login.html';
    },

    checkSession: () => {
        const user = JSON.parse(sessionStorage.getItem('activeUser'));
        if (!user) window.location.href = 'index.html';
        return user;
    },

    checkAdmin: () => {
        const user = JSON.parse(sessionStorage.getItem('activeUser'));
        if (!user) window.location.href = 'index.html';
        if (user.role !== 'admin') {
            alert("Acceso denegado");
            window.location.href = 'landing.html';
        }
        return user;
    }
};