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

// 1: aumentar en una unidad la cantidad del producto indicado.
// No se debe superar el stock disponible.
function aumentarCantidad(idProducto) {
/*
Pasos sugeridos:
1. Recuperá el carrito actual usando obtenerCarrito().
2. Buscá dentro del carrito el ítem cuyo idProducto coincida con idProducto.
3. Buscá el producto completo dentro del array productos para conocer su stock.
4. Verificá que la cantidad actual sea menor que el stock disponible.
5. Si hay stock, aumentá la propiedad cantidad en una unidad.
6. Guardá el carrito actualizado con guardarCarrito().
7. Si no hay más stock, utilizá mostrarMensaje() para informar al usuario.

Importante:
No es necesario llamar a mostrarCarrito() dentro de esta función,
porque ya se llama luego de hacer clic en el botón "+".
*/
}

// 2: disminuir en una unidad la cantidad del producto indicado.
// Si la cantidad llega a 0, se debe eliminar el producto.
function disminuirCantidad(idProducto) {
/*
Pasos sugeridos:
1. Recuperá el carrito actual con obtenerCarrito().
2. Buscá el ítem correspondiente mediante su idProducto.
3. Comprobá la cantidad actual del ítem.
4. Si la cantidad es mayor que 1, restá una unidad.
5. Si la cantidad es igual a 1, no debe quedar en 0:
   reutilizá la función eliminarDelCarrito() para quitarlo completamente.
6. Si modificaste la cantidad, guardá el carrito actualizado con guardarCarrito().

Importante:
Luego del clic, mostrarCarrito() actualizará la interfaz.
*/
}

// TODO 3: eliminar completamente el producto indicado.
// Pista: utilizar filter() y guardar el nuevo carrito.
function eliminarDelCarrito(idProducto) {
/*
Pasos sugeridos:
1. Recuperá el carrito actual con obtenerCarrito().
2. Utilizá filter() para crear un nuevo array.
3. El nuevo array debe conservar únicamente los ítems cuyo idProducto
   sea diferente al idProducto recibido.
4. Guardá el nuevo array utilizando guardarCarrito().

Ejemplo de la lógica esperada:
Si el carrito contiene p1, p2 y p3, y se elimina p2,
el nuevo carrito debe contener solamente p1 y p3.

Importante:
No modifiques directamente el array original. filter() devuelve
un nuevo array con los elementos que deben permanecer.
*/
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

// 4: buscar el producto seleccionado, completar el modal y mostrarlo.
// Se deben actualizar la imagen, categoría, nombre, descripción y precio.
function verProducto(idProducto) {
/*
Pasos sugeridos:
1. Buscá el producto dentro del array productos utilizando find().
2. Obtené los elementos del modal mediante querySelector():
   - #modalProductoImagen
   - #modalProductoCategoria
   - #modalProductoNombre
   - #modalProductoDescripcion
   - #modalProductoPrecio
3. Actualizá los textos usando textContent.
4. Para la imagen, actualizá:
   - src con producto.imagen
   - alt con producto.nombre
5. Formateá el precio utilizando formatearPrecio(producto.precio).
6. Creá o recuperá la instancia del modal de Bootstrap usando
   el elemento #modalProducto.
7. Mostrá el modal.

Importante:
El idProducto recibido corresponde al valor guardado en el atributo
data-id del botón "Ver".
*/
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
