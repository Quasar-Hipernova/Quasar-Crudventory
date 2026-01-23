// ════════════════════════════════════════════════════════════════════════════════
// script.js - Dashboard QUASAR
// ════════════════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────
// VARIABLES GLOBALES
// ────────────────────────────────────────────────
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');
const btnLogout = document.getElementById('btnLogout');

// Variables específicas para la sección de listing
let productTable;
let searchInput;
let categorySelect;
let statusSelect;
let priceSelect;
let perPageSelect;
let addProductBtn;

// Datos de productos (extraídos de la tabla HTML para manipulación dinámica)
let products = [];

// Datos para tickets
let tickets = [];

// ────────────────────────────────────────────────
// TOGGLE SIDEBAR (Menú hamburguesa)
// ────────────────────────────────────────────────
function initSidebarToggle() {
    if (!toggleBtn || !sidebar || !mainContent) return;

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        
        // Para móviles: mostrar/ocultar completamente la sidebar
        if (window.innerWidth < 992) {
            sidebar.classList.toggle('show');
        }

        // Ajustar margen del contenido principal
        updateMainContentMargin();
    });

    // Cerrar sidebar en móviles al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992 && 
            sidebar.classList.contains('show') && 
            !sidebar.contains(e.target) && 
            e.target !== toggleBtn && 
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });

    // Ajustar al cambiar tamaño de ventana (responsive)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
        updateMainContentMargin();
    });
}

function updateMainContentMargin() {
    if (!mainContent || !sidebar) return;
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    mainContent.style.marginLeft = isCollapsed 
        ? 'var(--sidebar-collapsed-width, 70px)' 
        : 'var(--sidebar-width, 250px)';
}

// ────────────────────────────────────────────────
// GESTIÓN DE SUBMENÚS (Products, Users, Support)
// ────────────────────────────────────────────────
function initSubmenus() {
    // Obtener todos los items con submenú
    const submenuItems = document.querySelectorAll('.nav-item.has-submenu > a');

    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const parentLi = this.parentElement;
            const submenuId = this.getAttribute('data-bs-target');
            const submenu = document.querySelector(submenuId);
            const chevron = this.querySelector('.bi-chevron-down');

            if (!submenu) return;

            // Toggle del submenú
            const isExpanded = submenu.classList.contains('show');
            
            // Cerrar otros submenús (opcional, para comportamiento acordeón)
            closeAllSubmenus(submenu);

            // Abrir/cerrar el submenú actual
            if (isExpanded) {
                submenu.classList.remove('show');
                chevron?.classList.remove('rotate');
                parentLi.classList.remove('submenu-open');
            } else {
                submenu.classList.add('show');
                chevron?.classList.add('rotate');
                parentLi.classList.add('submenu-open');
            }
        });
    });
}

function closeAllSubmenus(except = null) {
    const allSubmenus = document.querySelectorAll('.nav-item.has-submenu ul.collapse');
    
    allSubmenus.forEach(submenu => {
        if (submenu !== except) {
            submenu.classList.remove('show');
            
            // Remover rotación del chevron
            const parentLink = submenu.closest('.has-submenu').querySelector('a');
            const chevron = parentLink?.querySelector('.bi-chevron-down');
            chevron?.classList.remove('rotate');
            submenu.closest('.has-submenu')?.classList.remove('submenu-open');
        }
    });
}

// ────────────────────────────────────────────────
// CAMBIO DE SECCIONES (Navegación entre vistas)
// ────────────────────────────────────────────────
function mostrarSeccion(seccionId, params = {}) {
    // Ocultar todas las secciones
    const allSections = document.querySelectorAll('.section-content');
    allSections.forEach(section => {
        section.classList.add('d-none');
    });

    // Mostrar la sección solicitada
    const targetSection = document.getElementById(seccionId);
    if (targetSection) {
        targetSection.classList.remove('d-none');
        
        // Lógica específica por sección
        if (seccionId === 'add') {
            initAddProductForm(params);
        } else if (seccionId === 'pdetails') {
            loadProductDetails(params.productId);
        } else if (seccionId === 'newTicket') {
            initNewTicketForm();
        } else if (seccionId === 'ticket') {
            renderTickets();
        }
    } else {
        console.warn(`Sección con ID "${seccionId}" no encontrada`);
        return;
    }

    // Actualizar estado activo en el menú
    updateActiveMenuItem(seccionId);

    // Cerrar sidebar en móviles después de seleccionar
    if (window.innerWidth < 992 && sidebar?.classList.contains('show')) {
        sidebar.classList.remove('show');
    }
}

// ────────────────────────────────────────────────
// LOGOUT
// ────────────────────────────────────────────────
function initLogout() {
    if (!btnLogout) return;

    btnLogout.addEventListener('click', handleLogout);
}

function handleLogout(e) {
    e.preventDefault();

    // Confirmación antes de cerrar sesión
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar datos de sesión
        sessionStorage.removeItem('admin');
        sessionStorage.clear();
        
        // Opcional: limpiar localStorage si lo usas
        // localStorage.clear();

        // Redirigir al login
        window.location.href = '../Login/login.html';
    }
}

// ────────────────────────────────────────────────
// INICIALIZACIÓN ESPECÍFICA PARA LISTING
// ────────────────────────────────────────────────
function initListingSection() {
    productTable = document.querySelector('#listing .table tbody');
    searchInput = document.querySelector('#listing input[type="text"]');
    categorySelect = document.querySelector('#listing select:nth-of-type(1)');
    statusSelect = document.querySelector('#listing select:nth-of-type(2)');
    priceSelect = document.querySelector('#listing select:nth-of-type(3)');
    perPageSelect = document.querySelector('#listing select:nth-of-type(4)');
    addProductBtn = document.querySelector('#listing .btn-danger');

    if (!productTable || !searchInput || !categorySelect || !statusSelect || !priceSelect || !addProductBtn) return;

    // Extraer datos iniciales de la tabla a un array
    loadProductsFromTable();

    // Evento para búsqueda
    searchInput.addEventListener('input', applyFilters);

    // Eventos para filtros
    categorySelect.addEventListener('change', applyFilters);
    statusSelect.addEventListener('change', applyFilters);
    priceSelect.addEventListener('change', applyFilters);
    perPageSelect.addEventListener('change', applyFilters); // Aunque no hay paginación, limitará los resultados visibles

    // Botón Add Product
    addProductBtn.addEventListener('click', () => {
        mostrarSeccion('add', { mode: 'add' });
    });

    // Inicializar acciones (ojo, lápiz, basura)
    initTableActions();
}

function loadProductsFromTable() {
    products = [];
    const rows = productTable.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            products.push({
                id: index + 1,
                name: cells[1].querySelector('.product-name').textContent.trim(),
                category: cells[2].textContent.trim(),
                stock: parseInt(cells[3].textContent.trim()),
                price: parseFloat(cells[4].textContent.trim().replace('$', '')),
                status: cells[5].querySelector('span').textContent.trim(),
                published: cells[6].querySelector('div:first-child').textContent.trim(),
                publishedTime: cells[6].querySelector('.text-muted').textContent.trim()
            });
        }
    });
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const status = statusSelect.value;
    const priceRange = priceSelect.value;
    const perPage = parseInt(perPageSelect.value) || 8;

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = (category === 'Category' || category === product.category);
        const matchesStatus = (status === 'Status' || status === product.status);
        let matchesPrice = true;
        if (priceRange !== 'Price Range') {
            if (priceRange === '$0 - $50') {
                matchesPrice = product.price >= 0 && product.price <= 50;
            } else if (priceRange === '$50 - $100') {
                matchesPrice = product.price > 50 && product.price <= 100;
            } else if (priceRange === '$100+') {
                matchesPrice = product.price > 100;
            }
        }
        return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });

    // Limitar por página (aunque no hay paginación completa, solo mostramos los primeros N)
    filteredProducts = filteredProducts.slice(0, perPage);

    renderTable(filteredProducts);
}

function renderTable(filteredProducts) {
    productTable.innerHTML = '';
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><div class="product-name">${product.name}</div></td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="badge-${product.status.toLowerCase().replace(' ', '-') || 'published'}">${product.status}</span></td>
            <td>
                <div>${product.published}</div>
                <div class="text-muted" style="font-size: 0.75rem;">${product.publishedTime}</div>
            </td>
            <td>
                <button class="action-btn view-btn" data-id="${product.id}" title="details"><i class="bi bi-eye"></i></button>
                <button class="action-btn edit-btn" data-id="${product.id}" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="action-btn delete-btn" data-id="${product.id}" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        `;
        productTable.appendChild(row);
    });

    // Re-inicializar acciones después de renderizar
    initTableActions();
}

function initTableActions() {
    // View (ojo)
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);
            mostrarSeccion('pdetails', { productId });
        });
    });

    // Edit (lápiz)
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);
            mostrarSeccion('add', { mode: 'edit', productId });
        });
    });

    // Delete (basura)
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                products = products.filter(p => p.id !== productId);
                // Re-asignar IDs para mantener consistencia
                products.forEach((p, index) => { p.id = index + 1; });
                applyFilters();
            }
        });
    });
}

// ────────────────────────────────────────────────
// FUNCIONES PARA ADD/EDIT PRODUCT (Sección 'add')
// ────────────────────────────────────────────────
function initAddProductForm(params) {
    const addSection = document.getElementById('add');
    if (!addSection) return;

    // Si el formulario no existe, crearlo dinámicamente (ya que en HTML es placeholder)
    if (!addSection.querySelector('form')) {
        addSection.innerHTML = `
            <h2>${params.mode === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
            <form id="product-form">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" required>
                </div>
                <div class="mb-3">
                    <label for="category" class="form-label">Category</label>
                    <select class="form-select" id="category" required>
                        <option>Electronics</option>
                        <option>Home & Office</option>
                        <option>Fashion</option>
                        <option>Fitness</option>
                        <option>Gaming</option>
                        <option>Furniture</option>
                        <option>Toys</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="stock" class="form-label">Stock</label>
                    <input type="number" class="form-control" id="stock" required>
                </div>
                <div class="mb-3">
                    <label for="price" class="form-label">Price</label>
                    <input type="number" step="0.01" class="form-control" id="price" required>
                </div>
                <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="status" required>
                        <option>Published</option>
                        <option>Pending</option>
                        <option>Out of Stock</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="published" class="form-label">Published Date</label>
                    <input type="date" class="form-control" id="published" required>
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn btn-secondary" onclick="mostrarSeccion('listing')">Cancel</button>
            </form>
        `;
    }

    const form = document.getElementById('product-form');
    if (!form) return;

    // Limpiar evento submit previo si existe
    form.removeEventListener('submit', handleProductSubmit);
    
    // Cargar datos si es edición
    if (params.mode === 'edit' && params.productId) {
        const product = products.find(p => p.id === params.productId);
        if (product) {
            form.querySelector('#name').value = product.name;
            form.querySelector('#category').value = product.category;
            form.querySelector('#stock').value = product.stock;
            form.querySelector('#price').value = product.price;
            form.querySelector('#status').value = product.status;
            form.querySelector('#published').value = product.published.split(', ').reverse().join('-'); // Convertir a YYYY-MM-DD
        }
    } else {
        form.reset();
    }

    // Evento submit
    form.addEventListener('submit', (e) => handleProductSubmit(e, params));
}

function handleProductSubmit(e, params) {
    e.preventDefault();
    const form = e.target;

    const newProduct = {
        name: form.querySelector('#name').value,
        category: form.querySelector('#category').value,
        stock: parseInt(form.querySelector('#stock').value),
        price: parseFloat(form.querySelector('#price').value),
        status: form.querySelector('#status').value,
        published: new Date(form.querySelector('#published').value).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        publishedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase().replace(' ', '')
    };

    if (params.mode === 'edit' && params.productId) {
        const index = products.findIndex(p => p.id === params.productId);
        if (index !== -1) {
            newProduct.id = params.productId;
            products[index] = newProduct;
        }
    } else {
        newProduct.id = products.length + 1;
        products.push(newProduct);
    }

    // Volver a listing y refrescar tabla
    mostrarSeccion('listing');
    applyFilters();
}

// ────────────────────────────────────────────────
// FUNCIONES PARA PRODUCT DETAILS (Sección 'pdetails')
// ────────────────────────────────────────────────
function loadProductDetails(productId) {
    const detailsSection = document.getElementById('pdetails');
    if (!detailsSection) return;

    const product = products.find(p => p.id === productId);
    if (!product) {
        detailsSection.innerHTML = '<h2>Product Not Found</h2>';
        return;
    }

    // Renderizar detalles (reemplazar placeholder)
    detailsSection.innerHTML = `
        <h2>Product Details: ${product.name}</h2>
        <div class="card">
            <div class="card-body">
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Status:</strong> ${product.status}</p>
                <p><strong>Published:</strong> ${product.published} at ${product.publishedTime}</p>
            </div>
        </div>
        <button class="btn btn-secondary mt-3" onclick="mostrarSeccion('listing')">Back to Listing</button>
    `;
}

// ────────────────────────────────────────────────
// FUNCIONES PARA NEW TICKET
// ────────────────────────────────────────────────
function initNewTicketForm() {
    const form = document.getElementById('ticket-form');
    if (!form) return;

    // Limpiar evento submit previo si existe
    form.removeEventListener('submit', handleTicketSubmit);

    // Resetear formulario
    form.reset();

    // Agregar evento submit
    form.addEventListener('submit', handleTicketSubmit);
}

function handleTicketSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const newTicket = {
        id: tickets.length + 1,
        requesterName: document.getElementById('requesterName').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value,
        tags: document.getElementById('tags').value,
        description: document.getElementById('description').value,
        created: new Date().toLocaleString()
    };

    tickets.push(newTicket);

    // Volver a ticket details y refrescar
    mostrarSeccion('ticket');
}

// ────────────────────────────────────────────────
// FUNCIONES PARA TICKET DETAILS
// ────────────────────────────────────────────────
function renderTickets() {
    const ticketsTable = document.getElementById('tickets-table');
    if (!ticketsTable) return;

    ticketsTable.innerHTML = '';

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.requesterName}</td>
            <td>${ticket.priority}</td>
            <td><span class="badge bg-${ticket.status === 'Open' ? 'warning' : ticket.status === 'In Progress' ? 'info' : ticket.status === 'Resolved' ? 'success' : 'danger'}">${ticket.status}</span></td>
            <td>${ticket.created}</td>
            <td>
                <button class="action-btn view-ticket" data-id="${ticket.id}" title="View"><i class="bi bi-eye"></i></button>
                <button class="action-btn delete-ticket" data-id="${ticket.id}" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        `;
        ticketsTable.appendChild(row);
    });

    // Inicializar acciones
    document.querySelectorAll('.view-ticket').forEach(btn => {
        btn.addEventListener('click', () => {
            const ticketId = parseInt(btn.dataset.id);
            // Aquí puedes expandir para mostrar detalles completos, por ahora solo console
            console.log('View ticket:', tickets.find(t => t.id === ticketId));
        });
    });

    document.querySelectorAll('.delete-ticket').forEach(btn => {
        btn.addEventListener('click', () => {
            const ticketId = parseInt(btn.dataset.id);
            if (confirm('¿Estás seguro de eliminar este ticket?')) {
                tickets = tickets.filter(t => t.id !== ticketId);
                renderTickets();
            }
        });
    });
}

// ────────────────────────────────────────────────
// INICIALIZACIÓN
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard QUASAR inicializado');

    // Inicializar funcionalidades
    initSidebarToggle();
    initSubmenus();
    initLogout();
    initListingSection();

    // Mostrar sección por defecto (dashboard)
    mostrarSeccion('dashboard');

    // Ajustar margen inicial del contenido
    updateMainContentMargin();
});

// ────────────────────────────────────────────────
// FUNCIONES AUXILIARES
// ────────────────────────────────────────────────

// Ejemplo: función para cargar datos del dashboard
function loadDashboardData() {
    // Aquí irían llamadas a tu API
    // fetch('/api/dashboard-stats')
    //     .then(res => res.json())
    //     .then(data => updateDashboardUI(data));
}

// Ejemplo: actualizar métricas del dashboard
function updateDashboardMetrics(data) {
    // Actualizar valores dinámicamente
    // document.querySelector('.total-users').textContent = data.users;
    // document.querySelector('.total-sales').textContent = data.sales;
}