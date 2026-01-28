// ════════════════════════════════════════════════════════════════════════════════
// login.js - Manejo de Autenticación (Versión Mejorada)
// ════════════════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────
// ELEMENTOS DEL DOM
// ────────────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const alertMsg = document.getElementById('alertMsg');

// Inputs de login
const logUser = document.getElementById('logUser');
const logPass = document.getElementById('logPass');

// Inputs de registro
const regName = document.getElementById('regName');
const regUser = document.getElementById('regUser');
const regPass = document.getElementById('regPass');

// Botones de submit
const loginBtn = loginForm?.querySelector('button[type="submit"]');
const registerBtn = registerForm?.querySelector('button[type="submit"]');

// ────────────────────────────────────────────────
// FUNCIONES DE UTILIDAD
// ────────────────────────────────────────────────
function showAlert(message, type = 'danger') {
    if (!alertMsg) return;
    
    alertMsg.textContent = message;
    alertMsg.className = `mt-3 text-${type} text-center small`;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        alertMsg.textContent = '';
    }, 5000);
}

function clearAlert() {
    if (alertMsg) {
        alertMsg.textContent = '';
    }
}

function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
}

// ────────────────────────────────────────────────
// VERIFICAR CONEXIÓN AL SERVIDOR
// ────────────────────────────────────────────────
async function checkServerConnection() {
    try {
        const result = await DB.healthCheck();
        
        if (!result.success) {
            showAlert('⚠️ No se pudo conectar al servidor. Asegúrate de que json-server esté ejecutándose.', 'warning');
            console.error('Server health check failed:', result);
            return false;
        }
        
        return true;
    } catch (error) {
        showAlert('⚠️ Error al verificar conexión con el servidor.', 'warning');
        console.error('Server connection error:', error);
        return false;
    }
}

// ────────────────────────────────────────────────
// MANEJO DE LOGIN
// ────────────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();
    clearAlert();
    
    // Validaciones
    const username = sanitizeInput(logUser.value);
    const password = logPass.value;
    
    if (!username || !password) {
        showAlert('Por favor, completa todos los campos.', 'warning');
        return;
    }
    
    if (username.length < 3) {
        showAlert('El usuario debe tener al menos 3 caracteres.', 'warning');
        return;
    }
    
    // Mostrar loading
    setButtonLoading(loginBtn, true);
    
    try {
        // Intentar login
        const result = await DB.login(username, password);
        
        if (result.success && result.user) {
            showAlert('✓ Login exitoso. Redirigiendo...', 'success');
            
            // Pequeño delay para mostrar el mensaje
            setTimeout(() => {
                if (result.user.role === 'admin') {
                    window.location.href = '../DashBoard/indexDB.html';
                } else {
                    window.location.href = '../indexLP.html';
                }
            }, 500);
        } else {
            showAlert(result.error || 'Usuario o contraseña incorrectos.', 'danger');
            setButtonLoading(loginBtn, false);
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Error al iniciar sesión. Intenta nuevamente.', 'danger');
        setButtonLoading(loginBtn, false);
    }
}

// ────────────────────────────────────────────────
// MANEJO DE REGISTRO
// ────────────────────────────────────────────────
async function handleRegister(e) {
    e.preventDefault();
    clearAlert();
    
    // Obtener y sanitizar valores
    const name = sanitizeInput(regName.value);
    const username = sanitizeInput(regUser.value);
    const password = regPass.value;
    
    // Validaciones
    if (!name || !username || !password) {
        showAlert('Por favor, completa todos los campos.', 'warning');
        return;
    }
    
    if (name.length < 2) {
        showAlert('El nombre debe tener al menos 2 caracteres.', 'warning');
        return;
    }
    
    if (username.length < 3) {
        showAlert('El usuario debe tener al menos 3 caracteres.', 'warning');
        return;
    }
    
    if (password.length < 4) {
        showAlert('La contraseña debe tener al menos 4 caracteres.', 'warning');
        return;
    }
    
    // Validar que el username solo contenga caracteres permitidos
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showAlert('El usuario solo puede contener letras, números y guiones bajos.', 'warning');
        return;
    }
    
    // Mostrar loading
    setButtonLoading(registerBtn, true);
    
    try {
        const result = await DB.register(name, username, password);
        
        if (result.success) {
            showAlert('✓ Cuenta creada exitosamente. Ahora puedes iniciar sesión.', 'success');
            
            // Limpiar formulario
            registerForm.reset();
            
            // Cambiar a tab de login después de 2 segundos
            setTimeout(() => {
                const loginTab = document.querySelector('[data-bs-target="#login"]');
                if (loginTab) {
                    const tab = new bootstrap.Tab(loginTab);
                    tab.show();
                }
                
                // Pre-llenar el username en el login
                logUser.value = username;
                logPass.focus();
            }, 2000);
        } else {
            showAlert(result.error || 'Error al crear la cuenta.', 'danger');
        }
    } catch (error) {
        console.error('Register error:', error);
        showAlert(error.message || 'Error al registrar usuario.', 'danger');
    } finally {
        setButtonLoading(registerBtn, false);
    }
}

// ────────────────────────────────────────────────
// VERIFICAR SI YA ESTÁ AUTENTICADO
// ────────────────────────────────────────────────
function checkIfAlreadyLoggedIn() {
    if (DB.isAuthenticated()) {
        const user = DB.getCurrentUser();
        
        if (user) {
            console.log('Usuario ya autenticado:', user.username);
            
            // Redirigir según el rol
            if (user.role === 'admin') {
                window.location.href = '../DashBoard/indexDB.html';
            } else {
                window.location.href = '../indexLP.html';
            }
        }
    }
}

// ────────────────────────────────────────────────
// EVENT LISTENERS
// ────────────────────────────────────────────────
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

// Limpiar mensaje de error al cambiar de tab
const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
tabButtons.forEach(button => {
    button.addEventListener('click', clearAlert);
});

// Limpiar mensaje al escribir en cualquier input
const allInputs = [logUser, logPass, regName, regUser, regPass];
allInputs.forEach(input => {
    if (input) {
        input.addEventListener('input', () => {
            if (alertMsg && alertMsg.textContent) {
                clearAlert();
            }
        });
    }
});

// Enter para enviar en inputs de password
if (logPass) {
    logPass.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

if (regPass) {
    regPass.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            registerForm.dispatchEvent(new Event('submit'));
        }
    });
}

// ────────────────────────────────────────────────
// INICIALIZACIÓN
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Login page initialized');
    
    // Verificar si ya está autenticado
    checkIfAlreadyLoggedIn();
    
    // Verificar conexión al servidor
    const serverAvailable = await checkServerConnection();
    
    if (!serverAvailable) {
        console.warn('Servidor no disponible');
        
        // Deshabilitar formularios si no hay servidor
        if (loginBtn) loginBtn.disabled = true;
        if (registerBtn) registerBtn.disabled = true;
    }
    
    // Focus en el primer input
    if (logUser) {
        logUser.focus();
    }
});

// ────────────────────────────────────────────────
// MANEJO DE ERRORES GLOBALES
// ────────────────────────────────────────────────
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});