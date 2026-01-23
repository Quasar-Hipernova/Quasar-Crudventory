
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
        nombre: "Vodka Russkaya",
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

    const listaAseo = [
    {
        nombre: "Cepillo",
        precio: "$2.000", 
        img: "img/img-aseo/cepillo-plancha-tidy-house-1-und-01.png" },
    {
        nombre: "Detergente Liquido",
        precio: "$10.000",
        img: "img/img-aseo/detergente-liquido-bonaropa-3000-ml-01.png",
    },
    {
        nombre: "Detergente Ecoplanet",
        precio: "$11.000",
        img: "img/img-aseo/detergente-liquido-bonaropa-ecoplanet-2l-01.png",
    },
    {
        nombre: "Detergente Black",
        precio: "$8.900",
        img: "img/img-aseo/detergente-liquido-para-prendas-oscuras-bonaropa-1000-ml-01.png",
    },
    { 
        nombre: "Jabón Barra", 
        precio: "$2.000", 
        img: "img/img-aseo/jabon-en-barra-brilla-king-3-und-900-g-01.png" },
    {
        nombre: "Paño", 
        precio: "$3.000", 
        img: "img/img-aseo/pano-absorbente-tidy-house-1-und-01.png" },
    {
        nombre: "Quitamanchas Polvo",
        precio: "$9.800",
        img: "img/img-aseo/quitamanchas-blanco-polvo-bonaropa-450g-01.png",
    },
    {
        nombre: "Quitamanchas Liquido",
        precio: "$12.000",
        img: "img/img-aseo/quitamanchas-liquido-bonaropa-1000-ml-01.png",
    },
    ];

    const listaVerduras = [
    {
        nombre: "Aguacate",
        precio: "$8.000",
        img: "img/img-verduras/aguacate-fruver-12002754-01.png",
    },
    { 
        nombre: "Ahuyama", 
        precio: "$10.000", 
        img: "img/img-verduras/ahuyama-fruver-12006188-01.png" },
    { 
        nombre: "Bananos", 
        precio: "$4.000", 
        img: "img/img-verduras/banano-fruver-12005468-01.png" },
    {
        nombre: "Cebolla Cabezona",
        precio: "$7.500",
        img: "img/img-verduras/cebolla-cabezona-fruver-12005767-01.png",
    },
    {
        nombre: "Cebolla Rama",
        precio: "$3.000",
        img: "img/img-verduras/cebolla-larga-500-gr-01.png",
    },
    { 
        nombre: "Lechuga", 
        precio: "$2.900", 
        img: "img/img-verduras/lechuga-verde-crespa-fruver-12005805-01.png" },
    {
        nombre: "Mezcla de Verduras",
        precio: "$5.600",
        img: "img/img-verduras/mezcla-de-verduras-wok-cooltivo-400-g-01.png",
    },
    {
        nombre: "Pimentón",
        precio: "$1.500",
        img: "img/img-verduras/pimenton-fruver-12005183-01.png",
    },
    ];
    const listaDespensa = [
    {
        nombre: "Aceite Girasol",
        precio: "$18.000",
        img: "img/img-despensa/aceite-de-girasol-don-olio-900-ml-01.png",
    },
    { 
        nombre: "Arepa", 
        precio: "$1.000", 
        img: "img/img-despensa/arepa_promo.png" },
    { 
        nombre: "Atún", 
        precio: "$4.400", 
        img: "img/img-despensa/atun-en-agua-carlo-forte-170-g-neto-01.png" },
    {
        nombre: "Sal",
        precio: "$2.500",
        img: "img/img-despensa/caldo-de-gallina-condimentos-12002946-1.png",
    },
    {
        nombre: "Chorizo",
        precio: "$7.000",
        img: "img/img-despensa/chorizo-antioqueno-viande-225g-01.png",
    },
    { 
        nombre: "Crema de Leche", 
        precio: "$2.900", 
        img: "img/img-despensa/crema_promo.png" },
    {
        nombre: "Spaghetti",
        precio: "$4.600",
        img: "img/img-despensa/spaghetti_promo.png",
    },
    {
        nombre: "Tocineta",
        precio: "$11.500",
        img: "img/img-despensa/tocineta_promo.png",
    },
    ];
    
    const listaPollo = [
        {
        nombre: "Alitas Sin Costillal",
        precio: "$12.000",
        img: "img/img-pollo/alas-sin-costillar-pollo-fiesta-x-800-g-01.png",
    },
    { 
        nombre: "Alitas BBQ", 
        precio: "$19.500", 
        img: "img/img-pollo/alitas-de-pollo-bbq-brasset-900-g-01.png" },
    { 
        nombre: "Carne Molida Cerdo", 
        precio: "$14.400", 
        img: "img/img-pollo/carne-molida-de-cerdo-500g-01.png" },
    {
        nombre: "Milanesa de Cerdo",
        precio: "$22.500",
        img: "img/img-pollo/milanesa-de-cerdo-red-cut-500-gr-01.png",
    },
    {
        nombre: "Milanesa de Res",
        precio: "$17.000",
        img: "img/img-pollo/molida-de-res-95-5-red-cut-500g-01.png",
    },
    { 
        nombre: "Muslos de Pollo", 
        precio: "$7.900", 
        img: "img/img-pollo/muslos-de-pollo-brasset-700-g-01.png" },
    {
        nombre: "Pinchos de Pollo",
        precio: "$14.200",
        img: "img/img-pollo/pinchos-de-pollo-apanado-brasset-4-und---200-g-01.png",
    },
    {
        nombre: "Recorte de Pollo",
        precio: "$7.500",
        img: "img/img-pollo/surtida-de-pollo-marinada-500g-01.png",
    },
    ];

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
      // Solo muestra el precio anterior si existe en el objeto
      const precioAnteriorHtml = prod.anterior
        ? `<p class="text-muted text-decoration-line-through mb-1">${prod.anterior}</p>`
        : '<p class="mb-1">&nbsp;</p>'; // Espacio vacío para mantener alineación

      cardsHtml += `
                <div class="col-lg-3 col-md-6 col-sm-6 mb-3">
                    <div class="card product-card h-100 shadow-sm">
                        <img src="${prod.img}" class="card-img-top p-3" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/150'">
                        <div class="card-body text-center d-flex flex-column">
                            <h6 class="card-title">${prod.nombre}</h6>
                            ${precioAnteriorHtml}
                            <p class="fw-bold text-primary mt-auto">${prod.precio}</p>
                            <button class="btn btn-primary btn-sm w-100">Agregar</button>
                        </div>
                    </div>
                </div>`;
    });

    htmlFinal += `
            <div class="carousel-item ${claseActive}">
                <div class="row px-5">
                    ${cardsHtml}
                </div>
            </div>`;
  }
  contenedor.innerHTML = htmlFinal;
}

// INICIALIZAR LOS 3 CARRUSELES
document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrusel(listaProductos, "contenedor-destacados");
  renderizarCarrusel(listaAseo, "contenedor-aseo");
  renderizarCarrusel(listaVerduras, "contenedor-verduras");
  renderizarCarrusel(listaDespensa, "contenedor-despensa");
  renderizarCarrusel(listaPollo, "contenedor-pollo");
});
