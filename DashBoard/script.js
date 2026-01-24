// ════════════════════════════════════════════════════════════════════════════════
// script.js - Dashboard QUASAR (Refactorizado con DB.js)
// ════════════════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────
// VARIABLES GLOBALES
// ────────────────────────────────────────────────
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');
const btnLogout = document.getElementById('btnLogout');

// ────────────────────────────────────────────────
// INICIALIZACIÓN
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard QUASAR inicializado');

    // Inicializar funcionalidades UI
    initSidebarToggle();
    initSubmenus();
    initLogout();

    // Iniciar con el Dashboard
    mostrarSeccion('dashboard');
    updateMainContentMargin();
});

// ────────────────────────────────────────────────
// TOGGLE SIDEBAR (UI)
// ────────────────────────────────────────────────
function initSidebarToggle() {
    if (!toggleBtn || !sidebar || !mainContent) return;

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (window.innerWidth < 992) sidebar.classList.toggle('show');
        updateMainContentMargin();
    });

    // Responsive stuff
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992 && sidebar.classList.contains('show')) sidebar.classList.remove('show');
        updateMainContentMargin();
    });
}

function updateMainContentMargin() {
    if (!mainContent || !sidebar) return;
    const isCollapsed = sidebar.classList.contains('collapsed');
    mainContent.style.marginLeft = isCollapsed ? 'var(--sidebar-collapsed-width, 70px)' : 'var(--sidebar-width, 250px)';
}

// ────────────────────────────────────────────────
// NAVEGACIÓN Y SECCIONES
// ────────────────────────────────────────────────
function initSubmenus() {
    const submenuItems = document.querySelectorAll('.nav-item.has-submenu > a');
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const submenuId = this.getAttribute('data-bs-target');
            const submenu = document.querySelector(submenuId);
            const chevron = this.querySelector('.bi-chevron-down');
            
            if (submenu.classList.contains('show')) {
                submenu.classList.remove('show');
                chevron?.classList.remove('rotate');
            } else {
                // Cerrar otros
                document.querySelectorAll('.collapse.show').forEach(s => s.classList.remove('show'));
                submenu.classList.add('show');
                chevron?.classList.add('rotate');
            }
        });
    });
}

// Función Central de Navegación
function mostrarSeccion(seccionId, params = {}) {
    // 1. Ocultar todo
    document.querySelectorAll('.section-content').forEach(el => el.classList.add('d-none'));
    
    // 2. Mostrar seleccionado
    const target = document.getElementById(seccionId);
    if (target) target.classList.remove('d-none');

    // 3. Cargar datos específicos (Lazy Loading)
    switch(seccionId) {
        case 'listing':
            initListingSection(); // Carga productos desde DB
            break;
        case 'add':
            initAddProductForm(params); // Prepara formulario (crear o editar)
            break;
        case 'pdetails':
            loadProductDetails(params.productId);
            break;
        case 'udetails':
            initUserSection(); // Carga usuarios desde DB
            break;
        case 'ticket':
            renderTickets();
            break;
        case 'newTicket':
            initNewTicketForm();
            break;
    }

    // 4. UI Ajustes (Móvil)
    if (window.innerWidth < 992 && sidebar?.classList.contains('show')) {
        sidebar.classList.remove('show');
    }
}

// ────────────────────────────────────────────────
// LOGOUT
// ────────────────────────────────────────────────
function initLogout() {
    if (!btnLogout) return;
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('¿Cerrar sesión?')) {
            // Usamos la función de tu db.js
            DB.logout();
        }
    });
}

// ════════════════════════════════════════════════════════════════════════════════
// LÓGICA DE PRODUCTOS (Corregida para usar DB.js y arreglar el bug de edición)
// ════════════════════════════════════════════════════════════════════════════════

async function initListingSection() {
    const tbody = document.querySelector('#listing .table tbody');
    const searchInput = document.querySelector('#listing input[type="text"]');
    const addBtn = document.querySelector('#listing .btn-danger');

    if (!tbody) return;

    // 1. Obtener datos reales de la DB
    const products = await DB.get('products');
    
    // 2. Renderizar tabla
    renderProductTable(products, tbody);

    // 3. Configurar botón añadir
    // Clonamos el botón para eliminar event listeners viejos y evitar duplicados
    const newAddBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAddBtn, addBtn);
    
    newAddBtn.addEventListener('click', () => {
        mostrarSeccion('add', { mode: 'add' });
    });

    // 4. Configurar búsqueda simple
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        renderProductTable(filtered, tbody);
    });
}

function renderProductTable(products, tbody) {
    tbody.innerHTML = '';
    products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.id}</td>
            <td><div class="product-name fw-bold">${p.name}</div></td>
            <td>${p.category || 'General'}</td>
            <td>${p.stock || 0}</td>
            <td>$${p.price}</td>
            <td><span class="badge ${p.state === 'publicado' ? 'bg-success' : 'bg-warning'}">${p.state}</span></td>
            <td>${p.published || '-'}</td>
            <td>
                <button class="btn btn-sm btn-light border" onclick="mostrarSeccion('pdetails', {productId: ${p.id}})"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-warning" onclick="mostrarSeccion('add', {mode: 'edit', productId: ${p.id}})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger delete-prod-btn" data-id="${p.id}"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Agregar eventos delete
    document.querySelectorAll('.delete-prod-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if(confirm('¿Borrar producto?')) {
                await DB.delete('products', btn.dataset.id);
                initListingSection(); // Recargar tabla
            }
        });
    });
}

// FORMULARIO DE PRODUCTOS (Crear y Editar)
async function initAddProductForm(params) {
    const container = document.getElementById('add');
    const isEdit = params.mode === 'edit';
    let productData = {};

    // Si es edición, buscar datos
    if (isEdit) {
        const products = await DB.get('products');
        productData = products.find(p => p.id == params.productId) || {};
    }

    // Inyectar HTML del formulario
    container.innerHTML = `
        <h2 class="mb-4">${isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form id="dynamic-product-form" class="card p-4 shadow-sm">
            <input type="hidden" id="prodId" value="${isEdit ? productData.id : ''}">
            
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Nombre</label>
                    <input type="text" id="prodName" class="form-control" value="${productData.name || ''}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Categoría</label>
                    <select id="prodCategory" class="form-select">
                        <option>Electronics</option><option>Fashion</option><option>Home</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Precio</label>
                    <input type="number" id="prodPrice" class="form-control" value="${productData.price || ''}" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Stock</label>
                    <input type="number" id="prodStock" class="form-control" value="${productData.stock || 0}">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Estado</label>
                    <select id="prodState" class="form-select">
                        <option value="publicado" ${productData.state === 'publicado' ? 'selected' : ''}>Publicado</option>
                        <option value="borrador" ${productData.state === 'borrador' ? 'selected' : ''}>Borrador</option>
                        <option value="agotado" ${productData.state === 'agotado' ? 'selected' : ''}>Agotado</option>
                    </select>
                </div>
                <div class="col-12">
                    <label class="form-label">URL Imagen</label>
                    <input type="text" id="prodImg" class="form-control" value="${productData.img || ''}" placeholder="https://...">
                </div>
                <div class="col-12">
                    <label class="form-label">Descripción</label>
                    <textarea id="prodDesc" class="form-control" rows="3">${productData.desc || ''}</textarea>
                </div>
            </div>
            <div class="mt-4">
                <button type="submit" class="btn btn-primary px-4">Guardar</button>
                <button type="button" class="btn btn-secondary px-4" onclick="mostrarSeccion('listing')">Cancelar</button>
            </div>
        </form>
    `;

    // Manejar Submit
    document.getElementById('dynamic-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('prodId').value; // Recuperamos el ID oculto
        const data = {
            name: document.getElementById('prodName').value,
            category: document.getElementById('prodCategory').value,
            price: document.getElementById('prodPrice').value,
            stock: document.getElementById('prodStock').value,
            state: document.getElementById('prodState').value,
            img: document.getElementById('prodImg').value || 'https://via.placeholder.com/150',
            desc: document.getElementById('prodDesc').value,
            published: new Date().toLocaleDateString()
        };

        if (id) {
            // Si hay ID, es ACTUALIZACIÓN (Fix del bug)
            await DB.update('products', id, data);
        } else {
            // Si no hay ID, es CREACIÓN
            await DB.insert('products', data);
        }

        mostrarSeccion('listing'); // Volver al listado
    });
}

async function loadProductDetails(id) {
    const container = document.getElementById('pdetails');
    const products = await DB.get('products');
    const p = products.find(prod => prod.id == id);

    if(!p) return;

    container.innerHTML = `
        <h2>Detalles: ${p.name}</h2>
        <div class="card p-4">
            <div class="row">
                <div class="col-md-4">
                    <img src="${p.img}" class="img-fluid rounded">
                </div>
                <div class="col-md-8">
                    <h4>${p.name} <span class="badge bg-secondary">${p.state}</span></h4>
                    <h3 class="text-success">$${p.price}</h3>
                    <p>${p.desc}</p>
                    <hr>
                    <p><strong>Stock:</strong> ${p.stock}</p>
                    <p><strong>Categoría:</strong> ${p.category}</p>
                </div>
            </div>
        </div>
        <button class="btn btn-secondary mt-3" onclick="mostrarSeccion('listing')">Volver</button>
    `;
}


// ════════════════════════════════════════════════════════════════════════════════
// LÓGICA DE USUARIOS (NUEVO CRUD)
// ════════════════════════════════════════════════════════════════════════════════

async function initUserSection() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    // 1. Obtener usuarios de DB
    const users = await DB.get('users');
    tbody.innerHTML = '';

    // 2. Renderizar filas
    users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><i class="bi ${u.avatar || 'bi-person-circle'} fs-3 text-secondary"></i></td>
            <td>
                <div class="fw-bold">${u.name}</div>
                <div class="small text-muted">@${u.username}</div>
            </td>
            <td>
                <span class="badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${u.role.toUpperCase()}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="setupEditUser(${u.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUserAction(${u.id})"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function editUser(id) {
    const users = await DB.get('users');
    const u = users.find(x => x.id == id);
    document.getElementById('userId').value = u.id;
    document.getElementById('userName').value = u.name;
    document.getElementById('userLogin').value = u.username;
    document.getElementById('userPass').value = u.pass;
    document.getElementById('userRole').value = u.role;
    document.getElementById('modal-usuario').classList.remove('hidden');
}

// Abrir Modal de Usuario (Vacío o con Datos)
function abrirModalUsuario() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    const modal = document.getElementById('modal-usuario');
    modal.classList.remove('hidden');
}

function cerrarModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// Preparar edición de usuario
async function setupEditUser(id) {
    const users = await DB.get('users');
    const u = users.find(user => user.id == id);
    if(u) {
        document.getElementById('userId').value = u.id;
        document.getElementById('userName').value = u.name;
        document.getElementById('userLogin').value = u.username;
        document.getElementById('userPass').value = u.pass;
        document.getElementById('userRole').value = u.role;
        
        const modal = document.getElementById('modal-usuario');
        modal.classList.remove('hidden');
    }
}

// Acción de borrado
async function deleteUserAction(id) {
    if(confirm('¿Eliminar usuario permanentemente?')) {
        await DB.delete('users', id);
        initUserSection(); // Refrescar tabla
    }
}

// Event Listener para el Formulario de Usuarios (SOLO UNA VEZ)
const userForm = document.getElementById('userForm');
if(userForm) {
    const newForm = userForm.cloneNode(true);
    userForm.parentNode.replaceChild(newForm, userForm);

    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('userId').value;
        const data = {
            name: document.getElementById('userName').value,
            username: document.getElementById('userLogin').value,
            pass: document.getElementById('userPass').value,
            role: document.getElementById('userRole').value,
            avatar: 'bi-person-circle'
        };

        if(id) {
            await DB.update('users', id, data);
        } else {
            try {
                await DB.register(data.name, data.username, data.pass, data.role);
            } catch(err) {
                alert(err.message);
                return;
            }
        }
        
        cerrarModal('modal-usuario');
        initUserSection(); // Refrescar tabla
    });
}

// ════════════════════════════════════════════════════════════════════════════════
// FIN DE LÓGICA DE USUARIOS (NUEVO CRUD)
// ════════════════════════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════════════════════════
// LÓGICA DE TICKETS (Mantener existente)
// ════════════════════════════════════════════════════════════════════════════════
let tickets = []; // Local array simulation for tickets

function initNewTicketForm() {
    const form = document.getElementById('ticket-form');
    if(!form) return;
    form.reset();
    // Remover listener anterior
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTicket = {
            id: tickets.length + 1,
            subject: document.getElementById('subject').value,
            requesterName: document.getElementById('requesterName').value,
            priority: document.getElementById('priority').value,
            status: document.getElementById('status').value,
            created: new Date().toLocaleDateString()
        };
        tickets.push(newTicket);
        mostrarSeccion('ticket');
    });
}

function renderTickets() {
    const tbody = document.getElementById('tickets-table');
    if(!tbody) return;
    tbody.innerHTML = '';
    tickets.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.id}</td><td>${t.subject}</td><td>${t.requesterName}</td>
            <td>${t.priority}</td><td><span class="badge bg-info">${t.status}</span></td>
            <td>${t.created}</td><td><button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button></td>
        `;
        tbody.appendChild(row);
    });
}