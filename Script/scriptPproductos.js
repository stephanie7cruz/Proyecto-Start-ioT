


document.addEventListener("DOMContentLoaded", function () {
    let productos = [];
    const contenedorProductos = document.querySelector("#list-items");

    // Cargar productos desde el archivo data.json
    fetch('../Template/data.json')
        .then(response => response.json())
        .then(data => {
            productos = data.item;

            // Mostrar todos los productos en la sección de "Productos"
            cargarProductos(productos, "#contenedorTodosProductos");


        })
        .catch(error => console.error("Error al cargar los productos:", error));

    // filtros
    // Evento para aplicar filtros
    document.querySelector("#applyFilters").addEventListener("click", function () {
        aplicarFiltros();
    });

    // Evento para limpiar filtros
    document.querySelector("#clearFilters").addEventListener("click", function () {
        document.querySelectorAll("#filter-section input").forEach(input => input.checked = false);
        cargarProductos(productos);
    });

    // ordenar
    document.querySelector("#sortBy").addEventListener("change", function () {
        ordenarProductos(this.value);
    });
    // ordenar

    // Función para filtrar productos
    function aplicarFiltros() {
        const categoriasSeleccionadas = [...document.querySelectorAll("#categoryFilter input:checked")].map(el => el.value);
        const activosSeleccionados = [...document.querySelectorAll("#activoFilter input:checked")].map(el => el.value);
        const rangoPrecio = document.querySelector("#priceFilter input:checked")?.value;

        let productosFiltrados = productos;

        // Filtrar por categoría
        if (categoriasSeleccionadas.length > 0) {
            productosFiltrados = productosFiltrados.filter(producto => categoriasSeleccionadas.includes(producto.categoria));
        }

        // Filtrar por tipo de activo
        if (activosSeleccionados.length > 0) {
            productosFiltrados = productosFiltrados.filter(producto => activosSeleccionados.includes(producto.activo));
        }

        // Filtrar por precio
        if (rangoPrecio) {
            const [min, max] = rangoPrecio.split("-").map(Number);
            productosFiltrados = productosFiltrados.filter(producto => producto.precio >= min && producto.precio <= max);
        }

        cargarProductos(productosFiltrados);
    }
    // cerrar filtros
    // ordenar
    function ordenarProductos(criterio) {
        let productosOrdenados = [...productos]; // Clonar el array para no modificar el original

        if (criterio === "lowToHigh") {
            productosOrdenados.sort((a, b) => a.precio - b.precio);
        } else if (criterio === "highToLow") {
            productosOrdenados.sort((a, b) => b.precio - a.precio);
        }

        cargarProductos(productosOrdenados);
    }

    // ordenar

    // Cargar navbar desde nav.html
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;

            // Aquí ya podemos acceder al contenedor del carrito y agregar el evento de click
            const cartIconContainer = document.querySelector(".cart-icon");
            if (cartIconContainer) {
                cartIconContainer.addEventListener("click", function () {

                    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
                    cartModal.show();
                    mostrarCarrito();
                });
            } else {
                console.log("El contenedor del carrito no se encontró.");
            }
        })
        .catch(error => console.error('Error al cargar el navbar:', error));

    // Función para cargar y renderizar los productos                   

    function cargarProductos(productosElegidos) {
        contenedorProductos.innerHTML = "";
        productosElegidos.forEach((producto, index) => {
            const div = document.createElement("div");
            div.classList.add("col-10", "col-md-6", "col-lg-3", "mb-4");
            div.innerHTML = `
                <div class="card w-100 h-100" style="width: 18rem;">
                    <i class="fas fa-heart heart-icon" onclick="toggleHeart(this)"></i>
                    <img src="${producto.img}" class="card-img-top object-fit-conten" alt="image" style="height: 300px; width: 300px; object-fit: cover;">
                    <div class="info">
                        <p class="categoria">${producto.categoria}<
                        
                        /p>
                        <h5 class="card-title">${producto.name}</h5>
                        <p class="precio">${producto.precio}</p>
                        <p class="descripcion">${producto.description}</p>
                        <div class="clasificacion" id="clasificacion-${index}"></div>
                    </div>
                    <a href="#" class="btn btn-cart w-100 producto-agregar" id="${producto.id}">
                        <i class="fas fa-shopping-cart"></i> Agregar al carrito
                    </a>
                </div>
            `;
            contenedorProductos.append(div);

            estrella(`clasificacion-${index}`, producto.rating || 4);

            const botonAgregar = div.querySelector('.producto-agregar');
            botonAgregar.addEventListener('click', agregarAlCarrito);
        });
    }



    // Función para agregar estrellas de calificación
    function estrella(containerId, rating) {
        const contenedorEstrella = document.getElementById(containerId);
        contenedorEstrella.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                contenedorEstrella.innerHTML += '<i class="fas fa-star"></i>';
            } else {
                contenedorEstrella.innerHTML += '<i class="far fa-star"></i>';
            }
        }
    }

    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    // Función para agregar al carrito
    function agregarAlCarrito(e) {
        e.preventDefault();

        const boton = e.currentTarget;
        const idBoton = e.currentTarget.id;
        const productoAgregado = productos.find(producto => producto.id === idBoton);

        const textoOriginal = boton.innerHTML;

        boton.classList.add("clicked");
        boton.innerHTML = `<i class="fas fa-check"></i> AGREGADO AL CARRITO`;


        setTimeout(() => {
            boton.classList.remove("clicked");
            boton.innerHTML = textoOriginal;
        }, 2000); // 1 segundo


        if (productosEnCarrito.some(producto => producto.id === idBoton)) {
            const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
            productosEnCarrito[index].cantidad++;
        } else {
            productoAgregado.cantidad = 1;
            productosEnCarrito.push(productoAgregado);
        }

        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        actualizarNumerito();
    }


    // Función para actualizar el numerito del carrito
    function actualizarNumerito() {
        const cartCountElement = document.getElementById("cart-count");
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        if (cartCountElement) {
            cartCountElement.innerText = nuevoNumerito;
        }
    }

    // Función para mostrar el contenido del carrito en el modal
    function mostrarCarrito() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        cartItemsContainer.innerHTML = '';

        if (productosEnCarrito.length === 0) {
            cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
        } else {
            productosEnCarrito.forEach(producto => {
                const div = document.createElement('div');
                div.classList.add('cart-item');
                div.innerHTML = `
                <img src="${producto.img}" alt="${producto.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <p>${producto.name} - ${producto.cantidad} x $${producto.precio}</p>
                </div>
                <button class="btn btn-danger btn-sm" id="eliminar-${producto.id}">Eliminar</button>
            `;
                cartItemsContainer.append(div);

                // Añadir el evento de eliminar a cada botón después de que se haya añadido al DOM
                const botonEliminar = document.getElementById(`eliminar-${producto.id}`);
                botonEliminar.addEventListener('click', function () {
                    eliminarDelCarrito(producto.id);
                });
            });
        }
    }

    // Función para eliminar un producto del carrito
    function eliminarDelCarrito(idProducto) {
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idProducto);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        actualizarNumerito();
        mostrarCarrito();  // Vuelve a mostrar el carrito con los productos actualizados
    }

    document.getElementById("checkoutButton").addEventListener("click", () => {
        window.location.href = "carrito.html";
    });


});

function toggleHeart(heartIcon) {
    // console.log("Toggle Heart Function Triggered");
    heartIcon.classList.toggle('active');
}
// filtro
// Funcionalidad para minimizar categorías
const toggleButton = document.getElementById("toggleCategories");
const categoryFilter = document.getElementById("categoryFilter");

let isCategoryVisible = true;
toggleButton.addEventListener("click", () => {
    isCategoryVisible = !isCategoryVisible;
    categoryFilter.style.display = isCategoryVisible ? "block" : "none";
    toggleButton.textContent = isCategoryVisible ? "[-]" : "[+]";
});

// Permitir deselección de rango de precios
const priceRadios = document.querySelectorAll("input[name='price']");
let selectedPrice = null;

priceRadios.forEach(radio => {
    radio.addEventListener("click", function () {
        if (this === selectedPrice) {
            this.checked = false;
            selectedPrice = null;
        } else {
            selectedPrice = this;
        }
    });
});

// Botón (ahora ícono) para quitar todos los filtros
document.getElementById("clearFilters").addEventListener("click", () => {
    document.querySelectorAll("input[type='checkbox'], input[type='radio']").forEach(input => input.checked = false);
    selectedPrice = null;
});


// filtro