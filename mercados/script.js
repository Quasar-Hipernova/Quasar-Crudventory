
const listaProductos = [
{
    nombre: "Aguardiente",
    precio: "$40.000",
    anterior: "$60.000",
    img: "img/img-destacada/aguardiente-amarillo-manzanares-750ml-12004306-01.png",
},
{
    nombre: "Cigarrillos",
    precio: "$5.000",
    anterior: "$10.000",
    img: "img/img-destacada/cigarrillo-lucky-strike-gin-12004269-00.png",
},
{
    nombre: "Vodka",
    precio: "$20.000",
    anterior: "$35.000",
    img: "img/img-destacada/licor-vodka-smirnoff-spicy-tamarin-12007768-01.png",
},
{
    nombre: "Ron Viejo",
    precio: "$25.000",
    anterior: "$37.000",
    img: "img/img-destacada/ron-viejo-de-caldas-escencial-750ml-12006821-01.png",
},
{
    nombre: "Vino Francés",
    precio: "$22.000",
    anterior: "$31.000",
    img: "img/img-destacada/vino-frances-maison-1982-750-ml-01.png",
},
{
    nombre: "Vodka",
    precio: "$22.000",
    anterior: "$31.000",
    img: "img/img-destacada/vodka-russkaya-750ml-12005185-01.png",
},
{
    nombre: "Cerveza",
    precio: "$1.800",
    anterior: "$2.500",
    img: "img/img-destacada/cerveza-aguila-269ml-12006670-01.png",
},
{
    nombre: "Vino Tinto",
    precio: "$32.000",
    anterior: "$25.000",
    img: "img/img-destacada/vino-tinto-bag-in-box-3-litros-pinta-negra-01.png",
},
];  

const contenedor = document.getElementById("contenedor-carrusel");

function renderizarProductos() {
let htmlFinal = "";
const productosPorSlide = 4; // Cambia este número si quieres más o menos por slide

// Ciclo for que salta de 4 en 4
for (let i = 0; i < listaProductos.length; i += productosPorSlide) {
// Creamos un sub-grupo de 4 productos usando .slice()
const grupo = listaProductos.slice(i, i + productosPorSlide);

    // El primer slide DEBE tener la clase 'active', los demás no
    const claseActive = i === 0 ? "active" : "";

    let cardsHtml = "";

    // Generamos el HTML de las 4 tarjetas del grupo actual
    grupo.forEach((prod) => {
        cardsHtml += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card product-card h-100">
                        <img src="${prod.img}" class="card-img-top">
                        <div class="card-body text-center">
                            <h6>${prod.nombre}</h6>
                            <p class="text-muted text-decoration-line-through mb-1">${prod.anterior}</p>
                            <p class="fw-bold">${prod.precio}</p>
                            <button class="btn btn-danger w-100">Agregar</button>
                        </div>
                    </div>
                </div>`;
    });

    // Metemos las 4 tarjetas dentro de un carousel-item
    htmlFinal += `
            <div class="carousel-item ${claseActive}">
                <div class="row g-4">
                    ${cardsHtml}
                </div>
            </div>`;
}

contenedor.innerHTML = htmlFinal;
}

// Ejecutamos la función
renderizarProductos();

