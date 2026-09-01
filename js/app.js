let categoriaSeleccionada = "todos";

const contenedorProductos = document.querySelector("#productos");
const contenedorCarrito = document.querySelector("#carrito");
const totalCarrito = document.querySelector("#totalCarrito");
const contadorCarrito = document.querySelector("#contadorCarrito");

function formatearPrecio(valor) {
    return `$ ${valor.toLocaleString("es-UY")}`;
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarProductos() {
    const productosFiltrados = categoriaSeleccionada === "todos"
        ? productos
        : productos.filter((producto) => producto.categoria === categoriaSeleccionada);

    contenedorProductos.innerHTML = "";

    productosFiltrados.forEach((producto) => {
        contenedorProductos.innerHTML += `
            <div class="col-md-6">
                <article class="product-card">
                    <div class="product-image-box">
                        <img src="${producto.imagen}" class="product-image" alt="${producto.nombre}">
                    </div>
                    <div class="product-content">
                        <span class="section-label">${producto.categoria}</span>
                        <h2 class="h6 fw-bold mt-1 mb-1">${producto.nombre}</h2>
                        <p class="product-description">${producto.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center gap-2">
                            <strong>${formatearPrecio(producto.precio)}</strong>
                            <button class="btn btn-warning btn-sm fw-bold btn-agregar" data-id="${producto.id}" type="button">Agregar</button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    });

    document.querySelectorAll(".btn-agregar").forEach((boton) => {
        boton.addEventListener("click", () => {
            agregarAlCarrito(boton.dataset.id);
        });
    });
}

// Esta función ya está implementada como ejemplo.
function agregarAlCarrito(idProducto) {
    const carrito = obtenerCarrito();
    const producto = productos.find((producto) => producto.id === idProducto);
    const itemExistente = carrito.find((item) => item.idProducto === idProducto);

    if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) {
            mostrarMensaje("No hay más unidades disponibles.", "warning");
            return;
        }

        itemExistente.cantidad++;
    } else {
        carrito.push({ idProducto: idProducto, cantidad: 1 });
    }

    guardarCarrito(carrito);
    mostrarCarrito();
}

// TODO 1: aumentar en una unidad la cantidad del producto indicado.
// No se debe superar el stock disponible.
function aumentarCantidad(idProducto) {

}

// TODO 2: disminuir en una unidad la cantidad del producto indicado.
// Si la cantidad llega a 0, se debe eliminar el producto.
function disminuirCantidad(idProducto) {

}

// TODO 3: eliminar completamente el producto indicado.
// Pista: utilizar filter() y guardar el nuevo carrito.
function eliminarDelCarrito(idProducto) {

}

function calcularTotal(carrito) {
    return carrito.reduce((total, item) => {
        const producto = productos.find((producto) => producto.id === item.idProducto);
        return total + producto.precio * item.cantidad;
    }, 0);
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="empty-cart">
                <strong>Tu pedido está vacío</strong>
                <span class="small">Agregá un producto para comenzar.</span>
            </div>
        `;
    } else {
        carrito.forEach((item) => {
            const producto = productos.find((producto) => producto.id === item.idProducto);

            contenedorCarrito.innerHTML += `
                <div class="cart-item">
                    <div class="d-flex justify-content-between gap-3 mb-2">
                        <div>
                            <strong class="cart-item-name d-block">${producto.nombre}</strong>
                            <span class="small text-secondary">${formatearPrecio(producto.precio * item.cantidad)}</span>
                        </div>
                        <button class="cart-action ver" data-id="${item.idProducto}" type="button">Ver</button>
                    </div>

                    <div class="d-flex justify-content-between align-items-center gap-2">
                        <div class="quantity-control">
                            <button class="disminuir" data-id="${item.idProducto}" type="button" aria-label="Disminuir cantidad">−</button>
                            <span>${item.cantidad}</span>
                            <button class="aumentar" data-id="${item.idProducto}" type="button" aria-label="Aumentar cantidad">+</button>
                        </div>
                        <button class="cart-action eliminar" data-id="${item.idProducto}" type="button">Eliminar</button>
                    </div>
                </div>
            `;
        });
    }

    totalCarrito.textContent = formatearPrecio(calcularTotal(carrito));
    contadorCarrito.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);

    conectarEventosCarrito();
}

function conectarEventosCarrito() {
    document.querySelectorAll(".aumentar").forEach((boton) => {
        boton.addEventListener("click", () => {
            aumentarCantidad(boton.dataset.id);
            mostrarCarrito();
        });
    });

    document.querySelectorAll(".disminuir").forEach((boton) => {
        boton.addEventListener("click", () => {
            disminuirCantidad(boton.dataset.id);
            mostrarCarrito();
        });
    });

    document.querySelectorAll(".eliminar").forEach((boton) => {
        boton.addEventListener("click", () => {
            eliminarDelCarrito(boton.dataset.id);
            mostrarCarrito();
        });
    });

    document.querySelectorAll(".ver").forEach((boton) => {
        boton.addEventListener("click", () => {
            verProducto(boton.dataset.id);
        });
    });
}

// TODO 4: buscar el producto seleccionado, completar el modal y mostrarlo.
// Se deben actualizar la imagen, categoría, nombre, descripción y precio.
function verProducto(idProducto) {

}

function vaciarCarrito() {
    guardarCarrito([]);
    mostrarCarrito();
}

function confirmarPedido() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        mostrarMensaje("Agregá al menos un producto antes de confirmar.", "warning");
        return;
    }

    vaciarCarrito();
    mostrarMensaje("Pedido confirmado correctamente.", "success");
}

function mostrarMensaje(texto, tipo) {
    const mensaje = document.querySelector("#mensaje");
    mensaje.textContent = texto;
    mensaje.className = `alert alert-${tipo} mt-3 mb-0`;
}

document.querySelectorAll(".btn-category").forEach((boton) => {
    boton.addEventListener("click", () => {
        categoriaSeleccionada = boton.dataset.categoria;

        document.querySelectorAll(".btn-category").forEach((item) => item.classList.remove("active"));
        boton.classList.add("active");

        mostrarProductos();
    });
});

document.querySelector("#btnIrCarrito").addEventListener("click", () => {
    document.querySelector("#carritoPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#btnVaciar").addEventListener("click", vaciarCarrito);
document.querySelector("#btnConfirmar").addEventListener("click", confirmarPedido);

mostrarProductos();
mostrarCarrito();
