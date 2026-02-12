document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
});

function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const tbody = document.getElementById('carrito-body');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    const tabla = document.getElementById('tabla-carrito');
    const panelResumen = document.getElementById('panel-resumen');
    
    // Elementos de precio
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('total-final');

    if (carrito.length === 0) {
        tabla.style.display = 'none';
        panelResumen.style.display = 'none';
        mensajeVacio.style.display = 'block';
        return;
    }

    // Mostrar contenido
    tabla.style.display = 'table';
    panelResumen.style.display = 'block';
    mensajeVacio.style.display = 'none';
    tbody.innerHTML = '';

    let sumaTotal = 0;

    carrito.forEach((item, index) => {
        const tr = document.createElement('tr');
        const imagenSrc = item.imagen || 'https://via.placeholder.com/100';

        tr.innerHTML = `
            <td class="td-producto">
                <img src="${imagenSrc}" alt="${item.titulo}" class="img-mini">
                <span style="font-weight: 600; color: #1e293b;">${item.titulo}</span>
            </td>
            <td>
                <small style="color: #64748b; font-size: 0.85rem;">${item.detalle}</small>
            </td>
            <td class="td-precio">$${item.precio.toLocaleString()}</td>
            <td>
                <button onclick="borrarDelCarrito(${index})" class="btn-eliminar-mini">
                    Quitar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
        sumaTotal += item.precio;
    });

    // Actualizar Totales
    subtotalSpan.innerText = `$${sumaTotal.toLocaleString()}`;
    totalSpan.innerText = `$${sumaTotal.toLocaleString()}`;

    // Configurar botón checkout
    const btnFinalizar = document.getElementById('btn-finalizar');
    if(btnFinalizar) {
        btnFinalizar.onclick = finalizarCompra;
    }
}

window.borrarDelCarrito = (index) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    
    Toastify({ 
        text: "Producto eliminado", 
        style: { background: "#ef4444" }, 
        duration: 2000 
    }).showToast();
};

window.vaciarCarrito = () => {
    localStorage.removeItem('carrito');
    renderizarCarrito();
};

function finalizarCompra() {
    Swal.fire({
        title: '¡Reserva Exitosa!',
        text: 'Hemos enviado los vouchers a tu correo electrónico. ¡Buen viaje!',
        icon: 'success',
        confirmButtonColor: '#0f172a',
        confirmButtonText: 'Volver al inicio'
    }).then(() => {
        localStorage.removeItem('carrito');
        window.location.href = 'index.html';
    });
}