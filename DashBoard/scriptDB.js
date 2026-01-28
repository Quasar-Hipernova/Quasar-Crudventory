// ════════════════════════════════════════════════════════════════════════════════
// script.js - Dashboard QUASAR (Versión Mejorada)
// ════════════════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────
// VARIABLES GLOBALES
// ────────────────────────────────────────────────
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');
const btnLogout = document.getElementById('btnLogout');

let productTable, searchInput, categorySelect, statusSelect, priceSelect, perPageSelect, addProductBtn;
let products = [];
let tickets = [];
let eventHandlers = { productForm: null, ticketForm: null };

// ────────────────────────────────────────────────
// TOGGLE SIDEBAR
// ────────────────────────────────────────────────
function initSidebarToggle() {
    if (!toggleBtn || !sidebar || !mainContent) return;

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (window.innerWidth < 992) sidebar.classList.toggle('show');
        updateMainContentMargin();
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992 && sidebar.classList.contains('show') && 
            !sidebar.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth >= 992 && sidebar.classList.contains('show')) sidebar.classList.remove('show');
            updateMainContentMargin();
        }, 150);
    });
}

function updateMainContentMargin() {
    if (!mainContent || !sidebar) return;
    const isCollapsed = sidebar.classList.contains('collapsed');
    mainContent.style.marginLeft = window.innerWidth < 992 ? '0' : 
        (isCollapsed ? 'var(--sidebar-collapsed-width, 70px)' : 'var(--sidebar-width, 250px)');
}

// ────────────────────────────────────────────────
// GESTIÓN DE SUBMENÚS
// ────────────────────────────────────────────────
function initSubmenus() {
    document.querySelectorAll('.nav-item.has-submenu > a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const parentLi = this.parentElement;
            const submenu = document.querySelector(this.getAttribute('data-bs-target'));
            const chevron = this.querySelector('.bi-chevron-down');
            if (!submenu) return;

            const isExpanded = submenu.classList.contains('show');
            closeAllSubmenus(submenu);

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
    document.querySelectorAll('.nav-item.has-submenu ul.collapse').forEach(submenu => {
        if (submenu !== except) {
            submenu.classList.remove('show');
            const parentLink = submenu.closest('.has-submenu').querySelector('a');
            parentLink?.querySelector('.bi-chevron-down')?.classList.remove('rotate');
            submenu.closest('.has-submenu')?.classList.remove('submenu-open');
        }
    });
}

// ────────────────────────────────────────────────
// NAVEGACIÓN ENTRE SECCIONES
// ────────────────────────────────────────────────
function mostrarSeccion(seccionId, params = {}) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.add('d-none'));
    const targetSection = document.getElementById(seccionId);
    
    if (targetSection) {
        targetSection.classList.remove('d-none');
        if (seccionId === 'add') initAddProductForm(params);
        else if (seccionId === 'pdetails') loadProductDetails(params.productId);
        else if (seccionId === 'newTicket') initNewTicketForm();
        else if (seccionId === 'ticket') renderTickets();
        else if (seccionId === 'listing' && typeof applyFilters === 'function') applyFilters();
    } else {
        console.warn(`Sección "${seccionId}" no encontrada`);
        return;
    }

    updateActiveMenuItem(seccionId);
    if (window.innerWidth < 992 && sidebar?.classList.contains('show')) sidebar.classList.remove('show');
}

function updateActiveMenuItem(seccionId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`.nav-item[data-section="${seccionId}"]`);
    
    if (activeItem) {
        activeItem.classList.add('active');
        const parentSubmenu = activeItem.closest('.collapse');
        if (parentSubmenu) {
            parentSubmenu.classList.add('show');
            const parentLink = parentSubmenu.closest('.has-submenu').querySelector('a');
            parentLink?.querySelector('.bi-chevron-down')?.classList.add('rotate');
            parentSubmenu.closest('.has-submenu')?.classList.add('submenu-open');
        }
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
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        sessionStorage.clear();
        window.location.href = '../Login/login.html';
    }
}

// ────────────────────────────────────────────────
// PRODUCTS LISTING
// ────────────────────────────────────────────────
function initListingSection() {
    productTable = document.querySelector('#listing .table tbody');
    searchInput = document.querySelector('#listing input[type="text"]');
    categorySelect = document.querySelector('#listing select:nth-of-type(1)');
    statusSelect = document.querySelector('#listing select:nth-of-type(2)');
    priceSelect = document.querySelector('#listing select:nth-of-type(3)');
    perPageSelect = document.querySelector('#listing select:nth-of-type(4)');
    addProductBtn = document.querySelector('#listing .btn-danger');

    if (!productTable || !searchInput) {
        console.warn('Elementos de listing no encontrados');
        return;
    }

    loadProductsFromTable();

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });

    categorySelect?.addEventListener('change', applyFilters);
    statusSelect?.addEventListener('change', applyFilters);
    priceSelect?.addEventListener('change', applyFilters);
    perPageSelect?.addEventListener('change', applyFilters);
    addProductBtn?.addEventListener('click', () => mostrarSeccion('add', { mode: 'add' }));

    initTableActions();
}

function loadProductsFromTable() {
    products = [];
    productTable.querySelectorAll('tr').forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const productNameEl = cells[1].querySelector('.product-name');
            const statusEl = cells[5].querySelector('span');
            const dateEl = cells[6].querySelector('div:first-child');
            const timeEl = cells[6].querySelector('.text-muted');
            
            if (productNameEl && statusEl && dateEl && timeEl) {
                products.push({
                    id: index + 1,
                    name: productNameEl.textContent.trim(),
                    category: cells[2].textContent.trim(),
                    stock: parseInt(cells[3].textContent.trim()) || 0,
                    price: parseFloat(cells[4].textContent.trim().replace('$', '')) || 0,
                    status: statusEl.textContent.trim(),
                    published: dateEl.textContent.trim(),
                    publishedTime: timeEl.textContent.trim()
                });
            }
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
        const matchesCategory = category === 'Category' || category === product.category;
        const matchesStatus = status === 'Status' || status === product.status;
        let matchesPrice = true;
        
        if (priceRange !== 'Price Range') {
            if (priceRange === '$0 - $50') matchesPrice = product.price >= 0 && product.price <= 50;
            else if (priceRange === '$50 - $100') matchesPrice = product.price > 50 && product.price <= 100;
            else if (priceRange === '$100+') matchesPrice = product.price > 100;
        }
        return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });

    renderTable(filteredProducts.slice(0, perPage));
}

function renderTable(filteredProducts) {
    if (!productTable) return;
    productTable.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productTable.innerHTML = '<tr><td colspan="8" class="text-center py-4">No se encontraron productos</td></tr>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        const statusClass = product.status.toLowerCase().replace(/ /g, '-');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><div class="product-name">${escapeHtml(product.name)}</div></td>
            <td>${escapeHtml(product.category)}</td>
            <td>${product.stock}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="badge-${statusClass}">${escapeHtml(product.status)}</span></td>
            <td>
                <div>${escapeHtml(product.published)}</div>
                <div class="text-muted" style="font-size: 0.75rem;">${escapeHtml(product.publishedTime)}</div>
            </td>
            <td>
                <button class="action-btn view-btn" data-id="${product.id}" title="details"><i class="bi bi-eye"></i></button>
                <button class="action-btn edit-btn" data-id="${product.id}" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="action-btn delete-btn" data-id="${product.id}" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        `;
        productTable.appendChild(row);
    });

    initTableActions();
}

function initTableActions() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => mostrarSeccion('pdetails', { productId: parseInt(btn.dataset.id) }));
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => mostrarSeccion('add', { mode: 'edit', productId: parseInt(btn.dataset.id) }));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === productId);
            if (confirm(`¿Eliminar "${product?.name}"?`)) {
                products = products.filter(p => p.id !== productId);
                products.forEach((p, index) => p.id = index + 1);
                applyFilters();
            }
        });
    });
}

// ────────────────────────────────────────────────
// ADD/EDIT PRODUCT
// ────────────────────────────────────────────────
function initAddProductForm(params) {
    const addSection = document.getElementById('add');
    if (!addSection) return;

    if (!addSection.querySelector('form')) {
        addSection.innerHTML = `
            <h2>${params.mode === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
            <div class="card shadow-sm border-0">
                <div class="card-body">
                    <form id="product-form">
                        <div class="mb-3">
                            <label for="name" class="form-label">Product Name</label>
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
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label for="stock" class="form-label">Stock</label>
                                <input type="number" class="form-control" id="stock" min="0" required>
                            </div>
                            <div class="col-md-6">
                                <label for="price" class="form-label">Price</label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="number" step="0.01" class="form-control" id="price" min="0" required>
                                </div>
                            </div>
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
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">Save</button>
                            <button type="button" class="btn btn-secondary" onclick="mostrarSeccion('listing')">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    const form = document.getElementById('product-form');
    if (!form) return;

    if (eventHandlers.productForm) form.removeEventListener('submit', eventHandlers.productForm);
    
    if (params.mode === 'edit' && params.productId) {
        const product = products.find(p => p.id === params.productId);
        if (product) {
            form.querySelector('#name').value = product.name;
            form.querySelector('#category').value = product.category;
            form.querySelector('#stock').value = product.stock;
            form.querySelector('#price').value = product.price;
            form.querySelector('#status').value = product.status;
            
            const dateParts = product.published.split(' ');
            if (dateParts.length >= 3) {
                const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', 
                            Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
                const day = dateParts[0].padStart(2, '0');
                const month = months[dateParts[1].replace(',', '')];
                const year = dateParts[2];
                form.querySelector('#published').value = `${year}-${month}-${day}`;
            }
        }
    } else {
        form.reset();
        form.querySelector('#published').value = new Date().toISOString().split('T')[0];
    }

    eventHandlers.productForm = (e) => handleProductSubmit(e, params);
    form.addEventListener('submit', eventHandlers.productForm);
}

function handleProductSubmit(e, params) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const newProduct = {
        name: form.querySelector('#name').value.trim(),
        category: form.querySelector('#category').value,
        stock: parseInt(form.querySelector('#stock').value),
        price: parseFloat(form.querySelector('#price').value),
        status: form.querySelector('#status').value,
        published: new Date(form.querySelector('#published').value).toLocaleDateString('en-US', { 
            day: '2-digit', month: 'short', year: 'numeric' 
        }),
        publishedTime: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: true 
        })
    };

    if (params.mode === 'edit' && params.productId) {
        const index = products.findIndex(p => p.id === params.productId);
        if (index !== -1) {
            newProduct.id = params.productId;
            products[index] = newProduct;
        }
    } else {
        newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(newProduct);
    }

    mostrarSeccion('listing');
}

// ────────────────────────────────────────────────
// PRODUCT DETAILS
// ────────────────────────────────────────────────
function loadProductDetails(productId) {
    const detailsSection = document.getElementById('pdetails');
    if (!detailsSection) return;

    const product = products.find(p => p.id === productId);
    if (!product) {
        detailsSection.innerHTML = `
            <h2>Product Not Found</h2>
            <p class="text-muted">El producto no existe.</p>
            <button class="btn btn-secondary mt-3" onclick="mostrarSeccion('listing')">Back</button>
        `;
        return;
    }

    const statusClass = product.status.toLowerCase().replace(/ /g, '-');
    detailsSection.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Product Details</h2>
            <div class="d-flex gap-2">
                <button class="btn btn-primary btn-sm" onclick="mostrarSeccion('add', { mode: 'edit', productId: ${product.id} })">
                    <i class="bi bi-pencil me-1"></i>Edit
                </button>
                <button class="btn btn-secondary btn-sm" onclick="mostrarSeccion('listing')">
                    <i class="bi bi-arrow-left me-1"></i>Back
                </button>
            </div>
        </div>
        <div class="card shadow-sm border-0">
            <div class="card-body">
                <div class="row g-4">^^^^
                    <div class="col-md-6">
                        <h5 class="text-muted mb-3">Product Information</h5>
                        <p><strong>Name:</strong> ${escapeHtml(product.name)}</p>
                        <p><strong>Category:</strong> ${escapeHtml(product.category)}</p>
                        <p><strong>Stock:</strong> ${product.stock} units</p>
                        <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-muted mb-3">Status</h5>
                        <p><strong>Status:</strong> <span class="badge-${statusClass}">${escapeHtml(product.status)}</span></p>
                        <p><strong>Published:</strong> ${escapeHtml(product.published)}</p>
                        <p><strong>Time:</strong> ${escapeHtml(product.publishedTime)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ────────────────────────────────────────────────
// TICKETS
// ────────────────────────────────────────────────
function initNewTicketForm() {
    const form = document.getElementById('ticket-form');
    if (!form) return;

    if (eventHandlers.ticketForm) form.removeEventListener('submit', eventHandlers.ticketForm);
    form.reset();
    eventHandlers.ticketForm = handleTicketSubmit;
    form.addEventListener('submit', eventHandlers.ticketForm);
}

function handleTicketSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const newTicket = {
        id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
        requesterName: document.getElementById('requesterName').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value,
        tags: document.getElementById('tags').value.trim(),
        description: document.getElementById('description').value.trim(),
        created: new Date().toLocaleString()
    };

    tickets.push(newTicket);
    alert('Ticket created successfully!');
    mostrarSeccion('ticket');
}

function renderTickets() {
    const ticketsTable = document.getElementById('tickets-table');
    if (!ticketsTable) return;

    ticketsTable.innerHTML = '';

    if (tickets.length === 0) {
        ticketsTable.innerHTML = '<tr><td colspan="7" class="text-center py-4">No hay tickets</td></tr>';
        return;
    }

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        const statusBadgeClass = ticket.status === 'Open' ? 'warning' : 
            ticket.status === 'In Progress' ? 'info' : 
            ticket.status === 'Resolved' ? 'success' : 'danger';
            
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${escapeHtml(ticket.subject)}</td>
            <td>${escapeHtml(ticket.requesterName)}</td>
            <td>${escapeHtml(ticket.priority)}</td>
            <td><span class="badge bg-${statusBadgeClass}">${escapeHtml(ticket.status)}</span></td>
            <td>${escapeHtml(ticket.created)}</td>
            <td>
                <button class="action-btn view-ticket" data-id="${ticket.id}" title="View"><i class="bi bi-eye"></i></button>
                <button class="action-btn delete-ticket" data-id="${ticket.id}" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        `;
        ticketsTable.appendChild(row);
    });

    document.querySelectorAll('.view-ticket').forEach(btn => {
        btn.addEventListener('click', () => {
            const ticket = tickets.find(t => t.id === parseInt(btn.dataset.id));
            if (ticket) alert(`Ticket: ${ticket.subject}\n${ticket.description}`);
        });
    });

    document.querySelectorAll('.delete-ticket').forEach(btn => {
        btn.addEventListener('click', () => {
            const ticketId = parseInt(btn.dataset.id);
            const ticket = tickets.find(t => t.id === ticketId);
            if (confirm(`¿Eliminar "${ticket?.subject}"?`)) {
                tickets = tickets.filter(t => t.id !== ticketId);
                renderTickets();
            }
        });
    });
}

// ────────────────────────────────────────────────
// UTILIDADES
// ────────────────────────────────────────────────
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ────────────────────────────────────────────────
// INICIALIZACIÓN
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard QUASAR inicializado');
    initSidebarToggle();
    initSubmenus();
    initLogout();
    initListingSection();
    mostrarSeccion('dashboard');
    updateMainContentMargin();
});