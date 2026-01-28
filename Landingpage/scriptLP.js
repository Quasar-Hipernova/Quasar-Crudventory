// ────────────────────────────────────────────────
// DATOS DE PRODUCTOS
// ────────────────────────────────────────────────
const listaProductos = [
    { id: 1, nombre: "Aguardiente", precio: 40000, precioAnterior: 60000, img: "./Landingpage/img/img-destacada/aguardiente-amarillo-manzanares-750ml-12004306-01.png", categoria: "destacados" },
    { id: 2, nombre: "Cigarrillos", precio: 5000, precioAnterior: 10000, img: "./Landingpage/img/img-destacada/cigarrillo-lucky-strike-gin-12004269-00.png", categoria: "destacados" },
    { id: 3, nombre: "Vodka", precio: 20000, precioAnterior: 35000, img: "./Landingpage/img/img-destacada/licor-vodka-smirnoff-spicy-tamarin-12007768-01.png", categoria: "destacados" },
    { id: 4, nombre: "Ron Viejo", precio: 25000, precioAnterior: 37000, img: "./Landingpage/img/img-destacada/ron-viejo-de-caldas-escencial-750ml-12006821-01.png", categoria: "destacados" },
    { id: 5, nombre: "Vino Francés", precio: 22000, precioAnterior: 31000, img: "./Landingpage/img/img-destacada/vino-frances-maison-1982-750-ml-01.png", categoria: "destacados" },
    { id: 6, nombre: "Vodka Russkaya", precio: 22000, precioAnterior: 31000, img: "./Landingpage/img/img-destacada/vodka-russkaya-750ml-12005185-01.png", categoria: "destacados" },
    { id: 7, nombre: "Cerveza", precio: 1800, precioAnterior: 2500, img: "./Landingpage/img/img-destacada/cerveza-aguila-269ml-12006670-01.png", categoria: "destacados" },
    { id: 8, nombre: "Vino Tinto", precio: 32000, precioAnterior: 25000, img: "./Landingpage/img/img-destacada/vino-tinto-bag-in-box-3-litros-pinta-negra-01.png", categoria: "destacados" }
];

const listaAseo = [
    { id: 9, nombre: "Cepillo", precio: 2000, img: "./Landingpage/img/img-aseo/cepillo-plancha-tidy-house-1-und-01.png", categoria: "aseo" },
    { id: 10, nombre: "Detergente Líquido", precio: 10000, img: "./Landingpage/img/img-aseo/detergente-liquido-bonaropa-3000-ml-01.png", categoria: "aseo" },
    { id: 11, nombre: "Detergente Ecoplanet", precio: 11000, img: "./Landingpage/img/img-aseo/detergente-liquido-bonaropa-ecoplanet-2l-01.png", categoria: "aseo" },
    { id: 12, nombre: "Detergente Black", precio: 8900, img: "./Landingpage/img/img-aseo/detergente-liquido-para-prendas-oscuras-bonaropa-1000-ml-01.png", categoria: "aseo" },
    { id: 13, nombre: "Jabón Barra", precio: 2000, img: "./Landingpage/img/img-aseo/jabon-en-barra-brilla-king-3-und-900-g-01.png", categoria: "aseo" },
    { id: 14, nombre: "Paño", precio: 3000, img: "./Landingpage/img/img-aseo/pano-absorbente-tidy-house-1-und-01.png", categoria: "aseo" },
    { id: 15, nombre: "Quitamanchas Polvo", precio: 9800, img: "./Landingpage/img/img-aseo/quitamanchas-blanco-polvo-bonaropa-450g-01.png", categoria: "aseo" },
    { id: 16, nombre: "Quitamanchas Líquido", precio: 12000, img: "./Landingpage/img/img-aseo/quitamanchas-liquido-bonaropa-1000-ml-01.png", categoria: "aseo" }
];

const listaVerduras = [
    { id: 17, nombre: "Aguacate", precio: 8000, img: "./Landingpage/img/img-verduras/aguacate-fruver-12002754-01.png", categoria: "fruver" },
    { id: 18, nombre: "Ahuyama", precio: 10000, img: "./Landingpage/img/img-verduras/ahuyama-fruver-12006188-01.png", categoria: "fruver" },
    { id: 19, nombre: "Bananos", precio: 4000, img: "./Landingpage/img/img-verduras/banano-fruver-12005468-01.png", categoria: "fruver" },
    { id: 20, nombre: "Cebolla Cabezona", precio: 7500, img: "./Landingpage/img/img-verduras/cebolla-cabezona-fruver-12005767-01.png", categoria: "fruver" },
    { id: 21, nombre: "Cebolla Rama", precio: 3000, img: "./Landingpage/img/img-verduras/cebolla-larga-500-gr-01.png", categoria: "fruver" },
    { id: 22, nombre: "Lechuga", precio: 2900, img: "./Landingpage/img/img-verduras/lechuga-verde-crespa-fruver-12005805-01.png", categoria: "fruver" },
    { id: 23, nombre: "Mezcla de Verduras", precio: 5600, img: "./Landingpage/img/img-verduras/mezcla-de-verduras-wok-cooltivo-400-g-01.png", categoria: "fruver" },
    { id: 24, nombre: "Pimentón", precio: 1500, img: "./Landingpage/img/img-verduras/pimenton-fruver-12005183-01.png", categoria: "fruver" }
];

const listaDespensa = [
    { id: 25, nombre: "Aceite Girasol", precio: 18000, img: "./Landingpage/img/img-despensa/aceite-de-girasol-don-olio-900-ml-01.png", categoria: "despensa" },
    { id: 26, nombre: "Arepa", precio: 1000, img: "./Landingpage/img/img-despensa/arepa_promo.png", categoria: "despensa" },
    { id: 27, nombre: "Atún", precio: 4400, img: "./Landingpage/img/img-despensa/atun-en-agua-carlo-forte-170-g-neto-01.png", categoria: "despensa" },
    { id: 28, nombre: "Sal", precio: 2500, img: "./Landingpage/img/img-despensa/caldo-de-gallina-condimentos-12002946-1.png", categoria: "despensa" },
    { id: 29, nombre: "Chorizo", precio: 7000, img: "./Landingpage/img/img-despensa/chorizo-antioqueno-viande-225g-01.png", categoria: "despensa" },
    { id: 30, nombre: "Crema de Leche", precio: 2900, img: "./Landingpage/img/img-despensa/crema_promo.png", categoria: "despensa" },
    { id: 31, nombre: "Spaghetti", precio: 4600, img: "./Landingpage/img/img-despensa/spaghetti_promo.png", categoria: "despensa" },
    { id: 32, nombre: "Tocineta", precio: 11500, img: "./Landingpage/img/img-despensa/tocineta_promo.png", categoria: "despensa" }
];

const listaPollo = [
    { id: 33, nombre: "Alitas Sin Costillal", precio: 12000, img: "./Landingpage/img/img-pollo/alas-sin-costillar-pollo-fiesta-x-800-g-01.png", categoria: "carnes" },
    { id: 34, nombre: "Alitas BBQ", precio: 19500, img: "./Landingpage/img/img-pollo/alitas-de-pollo-bbq-brasset-900-g-01.png", categoria: "carnes" },
    { id: 35, nombre: "Carne Molida Cerdo", precio: 14400, img: "./Landingpage/img/img-pollo/carne-molida-de-cerdo-500g-01.png", categoria: "carnes" },
    { id: 36, nombre: "Milanesa de Cerdo", precio: 22500, img: "./Landingpage/img/img-pollo/milanesa-de-cerdo-red-cut-500-gr-01.png", categoria: "carnes" },
    { id: 37, nombre: "Milanesa de Res", precio: 17000, img: "./Landingpage/img/img-pollo/molida-de-res-95-5-red-cut-500g-01.png", categoria: "carnes" },
    { id: 38, nombre: "Muslos de Pollo", precio: 7900, img: "./Landingpage/img/img-pollo/muslos-de-pollo-brasset-700-g-01.png", categoria: "carnes" },
    { id: 39, nombre: "Pinchos de Pollo", precio: 14200, img: "./Landingpage/img/img-pollo/pinchos-de-pollo-apanado-brasset-4-und---200-g-01.png", categoria: "carnes" },
    { id: 40, nombre: "Recorte de Pollo", precio: 7500, img: "./Landingpage/img/img-pollo/surtida-de-pollo-marinada-500g-01.png", categoria: "carnes" }
];

// ────────────────────────────────────────────────
// CARRITO DE COMPRAS
// ────────────────────────────────────────────────
let carrito = [];

// Cargar carrito del localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id === producto.id);
    
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    guardarCarrito();
    actualizarCarrito();
    mostrarToast(`${producto.nombre} agregado al carrito`);
}

// Actualizar visualización del carrito
function actualizarCarrito() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Actualizar contador
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar items del carrito
    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <i class="fa-solid fa-cart-shopping text-muted" style="font-size: 4rem;"></i>
                <p class="text-muted mt-3">Tu carrito está vacío</p>
            </div>
        `;
        cartTotal.textContent = formatearPrecio(0);
        return;
    }
    
    cartItems.innerHTML = carrito.map(item => `
        <div class="cart-item mb-3 p-3 border rounded">
            <div class="row align-items-center">
                <div class="col-3">
                    <img src="${item.img}" class="img-fluid" alt="${item.nombre}"
                         onerror="this.src='https://via.placeholder.com/80'">
                </div>
                <div class="col-6">
                    <h6 class="mb-1 small">${item.nombre}</h6>
                    <p class="text-primary fw-bold mb-1">${formatearPrecio(item.precio)}</p>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${item.id}, -1)">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <button class="btn btn-outline-secondary disabled">${item.cantidad}</button>
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${item.id}, 1)">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-3 text-end">
                    <p class="fw-bold mb-2">${formatearPrecio(item.precio * item.cantidad)}</p>
                    <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${item.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    cartTotal.textContent = formatearPrecio(total);
}

// Cambiar cantidad de producto
function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            guardarCarrito();
            actualizarCarrito();
        }
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarrito();
}

// ────────────────────────────────────────────────
// RENDERIZADO DE CARRUSELES
// ────────────────────────────────────────────────
function formatearPrecio(precio) {
    return `$${precio.toLocaleString('es-CO')}`;
}

function renderizarCarrusel(lista, idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    let htmlFinal = "";
    const productosPorSlide = 4;

    for (let i = 0; i < lista.length; i += productosPorSlide) {
        const grupo = lista.slice(i, i + productosPorSlide);
        const claseActive = i === 0 ? "active" : "";

        let cardsHtml = "";
        grupo.forEach((prod) => {
            const precioFormateado = formatearPrecio(prod.precio);
            const precioAnteriorFormateado = prod.precioAnterior ? formatearPrecio(prod.precioAnterior) : null;
            const descuento = prod.precioAnterior ? 
                Math.round(((prod.precioAnterior - prod.precio) / prod.precioAnterior) * 100) : 0;

            cardsHtml += `
                <div class="col-lg-3 col-md-6 col-6 mb-3">
                    <div class="card product-card h-100 shadow-sm border-0">
                        ${descuento > 0 ? `<span class="discount-badge">${descuento}% OFF</span>` : ''}
                        <img src="${prod.img}" class="card-img-top p-3" alt="${prod.nombre}" 
                             onerror="this.src='https://via.placeholder.com/150/1E9BEF/FFFFFF?text=${prod.nombre}'">
                        <div class="card-body text-center d-flex flex-column">
                            <h6 class="card-title fw-bold small">${prod.nombre}</h6>
                            ${precioAnteriorFormateado ? 
                                `<p class="text-muted text-decoration-line-through mb-1 small">${precioAnteriorFormateado}</p>` : 
                                '<p class="mb-1 small">&nbsp;</p>'}
                            <p class="fw-bold text-primary mt-auto mb-2">${precioFormateado}</p>
                            <button class="btn btn-primary btn-sm w-100 rounded-pill" 
                                    onclick='agregarAlCarrito(${JSON.stringify(prod).replace(/'/g, "&apos;")})'>
                                <i class="fa-solid fa-cart-plus me-1"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>`;
        });

        htmlFinal += `
            <div class="carousel-item ${claseActive}">
                <div class="row g-2 px-md-5">
                    ${cardsHtml}
                </div>
            </div>`;
    }
    contenedor.innerHTML = htmlFinal;
}

// ────────────────────────────────────────────────
// BÚSQUEDA DE PRODUCTOS
// ────────────────────────────────────────────────
function buscarProductos(termino) {
    const todosProductos = [...listaProductos, ...listaAseo, ...listaVerduras, ...listaDespensa, ...listaPollo];
    const resultados = todosProductos.filter(prod => 
        prod.nombre.toLowerCase().includes(termino.toLowerCase())
    );
    
    if (resultados.length > 0) {
        alert(`Se encontraron ${resultados.length} productos con "${termino}"`);
    } else {
        alert(`No se encontraron productos con "${termino}"`);
    }
}

// ────────────────────────────────────────────────
// FILTRAR POR CATEGORÍA
// ────────────────────────────────────────────────
function filterByCategory(categoria) {
    const seccion = document.getElementById(`seccion-${categoria}`);
    if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ────────────────────────────────────────────────
// SCROLL TO SECTION
// ────────────────────────────────────────────────
function scrollToSection(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ────────────────────────────────────────────────
// MOSTRAR TOAST
// ────────────────────────────────────────────────
function mostrarToast(mensaje) {
    const toastElement = document.getElementById('cartToast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = mensaje;
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// ────────────────────────────────────────────────
// VERIFICAR AUTENTICACIÓN
// ────────────────────────────────────────────────
function verificarAutenticacion() {
    const userSection = document.getElementById('userSection');
    
    if (typeof DB !== 'undefined' && DB.isAuthenticated && DB.isAuthenticated()) {
        const user = DB.getCurrentUser();
        if (user) {
            userSection.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-primary rounded-pill px-3 dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown">
                        <i class="fa-solid fa-user-circle me-1"></i> ${user.name}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#">
                            <i class="fa-solid fa-user me-2"></i> Mi Perfil
                        </a></li>
                        <li><a class="dropdown-item" href="#">
                            <i class="fa-solid fa-box me-2"></i> Mis Pedidos
                        </a></li>
                        ${user.role === 'admin' ? 
                            '<li><a class="dropdown-item" href="./DashBoard/index.html"><i class="fa-solid fa-gauge me-2"></i> Dashboard</a></li>' : 
                            ''}
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="cerrarSesion()">
                            <i class="fa-solid fa-right-from-bracket me-2"></i> Cerrar Sesión
                        </a></li>
                    </ul>
                </div>
            `;
        }
    }
}

function cerrarSesion() {
    if (typeof DB !== 'undefined' && DB.logout) {
        DB.logout();
    } else {
        window.location.href = '../Login/login.html';
    }
}

// ────────────────────────────────────────────────
// FINALIZAR COMPRA
// ────────────────────────────────────────────────
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    if (typeof DB !== 'undefined' && !DB.isAuthenticated()) {
        if (confirm('Debes iniciar sesión para continuar con la compra. ¿Deseas ir al login?')) {
            window.location.href = '../Login/login.html';
        }
        return;
    }
    
    alert(`Compra procesada por ${formatearPrecio(total)}. ¡Gracias por tu compra!`);
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    
    // Cerrar offcanvas
    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
    if (offcanvas) offcanvas.hide();
}

// ────────────────────────────────────────────────
// SCROLL TO TOP
// ────────────────────────────────────────────────
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ────────────────────────────────────────────────
// EVENT LISTENERS
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Renderizar carruseles
    renderizarCarrusel(listaProductos, "contenedor-destacados");
    renderizarCarrusel(listaAseo, "contenedor-aseo");
    renderizarCarrusel(listaVerduras, "contenedor-verduras");
    renderizarCarrusel(listaDespensa, "contenedor-despensa");
    renderizarCarrusel(listaPollo, "contenedor-pollo");
    
    // Cargar carrito
    cargarCarrito();
    
    // Verificar autenticación
    verificarAutenticacion();
    
    // Inicializar scroll to top
    initScrollToTop();
    
    // Form de búsqueda
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const termino = document.getElementById('searchInput').value;
            if (termino.trim()) {
                buscarProductos(termino);
            }
        });
    }
    
    // Form de newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value;
            alert(`¡Gracias por suscribirte! Te enviaremos ofertas a ${email}`);
            newsletterForm.reset();
        });
    }
    
    // Botón de checkout
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', finalizarCompra);
    }
});