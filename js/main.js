let datosGlobales = { nacionales: [], internacionales: [] };
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
actualizarContador();

document.addEventListener('DOMContentLoaded', async () => {
    // 1. OBTENER DATOS (Simulado o API)
    const datos = await obtenerViajes();
    
    if (datos) {
        datosGlobales.nacionales = datos.paquetesNacionales;
        datosGlobales.internacionales = datos.destinosInternacionales;

        // 2. RENDERIZAR TODO AL INICIO
        renderizarNacionales(datosGlobales.nacionales);
        renderizarInternacionales(datosGlobales.internacionales);
    } else {
        Toastify({ text: "Error cargando datos", style: { background: "red" } }).showToast();
    }

    // 3. ACTIVAR BUSCADOR
    const input = document.getElementById('input-buscador');
    if(input) input.addEventListener('input', (e) => filtrarViajes(e.target.value));
});

// --- FILTRADO ---
function filtrarViajes(texto) {
    const busqueda = texto.toLowerCase().trim();
    const secNac = document.getElementById('nacionales');
    const secInt = document.getElementById('internacionales');
    const msg = document.getElementById('mensaje-sin-resultados');

    const nacFiltrados = datosGlobales.nacionales.filter(p => p.destino.toLowerCase().includes(busqueda));
    const intFiltrados = datosGlobales.internacionales.filter(d => d.ciudad.toLowerCase().includes(busqueda) || d.pais.toLowerCase().includes(busqueda));

    // Mostrar/Ocultar Nacionales
    if(nacFiltrados.length > 0) {
        secNac.style.display = 'block';
        renderizarNacionales(nacFiltrados);
    } else {
        secNac.style.display = 'none';
    }

    // Mostrar/Ocultar Internacionales
    if(intFiltrados.length > 0) {
        secInt.style.display = 'block';
        renderizarInternacionales(intFiltrados);
    } else {
        secInt.style.display = 'none';
    }

    // Mostrar Mensaje si todo está vacío
    if(nacFiltrados.length === 0 && intFiltrados.length === 0) {
        msg.style.display = 'block';
    } else {
        msg.style.display = 'none';
    }
}

// --- RENDERIZADORES ---
function renderizarNacionales(lista) {
    const cont = document.getElementById('container-nacionales');
    cont.innerHTML = '';
    lista.forEach(pack => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <img src="${pack.imagen}" alt="${pack.destino}">
            <div class="card-body">
                <h3>${pack.destino}</h3>
                <p style="color:#64748b; font-size:0.9rem;">${pack.dias} Días | ${pack.descripcion}</p>
                <p class="precio-destacado">$${pack.precioTotal.toLocaleString()}</p>
                <div style="margin-bottom:15px;">
                    <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                        <input type="checkbox" id="seguro-${pack.id}"> Incluir Seguro (+$15.000)
                    </label>
                </div>
                <button class="btn" onclick="agregarNacional('${pack.id}', '${pack.destino}', ${pack.precioTotal}, '${pack.imagen}')">Reservar</button>
            </div>
        `;
        cont.appendChild(div);
    });
}

function renderizarInternacionales(lista) {
    const cont = document.getElementById('container-internacionales');
    cont.innerHTML = '';
    lista.forEach(dest => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <img src="${dest.imagen}" alt="${dest.ciudad}">
            <div class="card-body">
                <h3>${dest.ciudad}, ${dest.pais}</h3>
                <p style="color:#64748b; font-size:0.9rem;">Vuelo: $${dest.precioVuelo.toLocaleString()}</p>
                <div class="inputs-container">
                    <input type="number" id="dias-${dest.id}" placeholder="Días (Mín 3)" min="3">
                    <input type="number" id="adultos-${dest.id}" placeholder="Adultos" min="1">
                </div>
                <button class="btn" onclick="cotizarInternacional('${dest.id}', '${dest.ciudad}', ${dest.precioVuelo}, ${dest.precioHotelNoche}, '${dest.imagen}')">Cotizar</button>
            </div>
        `;
        cont.appendChild(div);
    });
}

// --- CARRITO LOGICA ---
window.agregarNacional = (id, dest, precio, img) => {
    const seg = document.getElementById(`seguro-${id}`);
    let final = precio;
    let desc = "2 Personas";
    if(seg && seg.checked) { final += 15000; desc += " + Seguro"; }
    addCart({ id: Date.now(), titulo: dest, detalle: desc, precio: final, imagen: img });
};

window.cotizarInternacional = (id, ciudad, vuelo, hotel, img) => {
    const dias = parseInt(document.getElementById(`dias-${id}`).value) || 0;
    const adu = parseInt(document.getElementById(`adultos-${id}`).value) || 0;
    if(dias < 3 || adu < 1) { Toastify({ text: "Mínimo 3 días y 1 adulto", style: { background: "#0f172a" } }).showToast(); return; }
    const total = (vuelo + (hotel * dias)) * adu;
    addCart({ id: Date.now(), titulo: `Viaje a ${ciudad}`, detalle: `${dias} Días, ${adu} Adultos`, precio: total, imagen: img });
};

function addCart(prod) {
    carrito.push(prod);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    Toastify({ text: "¡Agregado!", style: { background: "#0f172a" } }).showToast();
}

function actualizarContador() {
    const s = document.getElementById('contador-carrito');
    if(s) s.innerText = carrito.length;
}