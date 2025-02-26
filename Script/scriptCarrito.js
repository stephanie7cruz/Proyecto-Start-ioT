
document.addEventListener("DOMContentLoaded", function () {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const totalContainer = document.getElementById('total');

    // Mostrar productos en el carrito
    function mostrarCarrito() {
        cartItemsContainer.innerHTML = `
        <div class="cart-header">
            <div class="cart-header-item">Producto</div>
            <div class="cart-header-item">Precio</div>
            <div class="cart-header-item">Cantidad</div>
            <div class="cart-header-item">Acciones</div>
        </div>
     `;

        if (productosEnCarrito.length === 0) {
            cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
        } else {
            let total = 0;

            productosEnCarrito.forEach(producto => {
                const productoHTML = `
                <div class="cart-item">
                    <div class="cart-item-producto">
                        <img src="${producto.img}" alt="${producto.nombre}" class="cart-item-img">
                        <span>${producto.nombre}</span>
                    </div>
                    <div class="cart-item-precio">$${producto.precio.toFixed(2)}</div>
                    <div class="cart-item-cantidad">${producto.cantidad}</div>
                    <div class="cart-item-acciones">
                        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito('${producto.id_producto}')">Eliminar</button>
                    </div>
                </div>
            `;

                cartItemsContainer.innerHTML += productoHTML;
                total += producto.precio * producto.cantidad;
            });

            totalContainer.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
        }
    }

    // Eliminar producto del carrito
    window.eliminarDelCarrito = function (idProducto) {
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id_producto !== parseInt(idProducto, 10));
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        mostrarCarrito();
    };

    document.getElementById("checkoutBtn").addEventListener("click", () => {
        const usuarioLogueado = localStorage.getItem("usuario"); // Verifica si hay un usuario en sesión
        

        if (!usuarioLogueado) {
            // Si el usuario NO ha iniciado sesión, mostrar modal de inicio de sesión
            Swal.fire({
                title: "Inicia sesión",
                text: "Debes iniciar sesión para completar la compra.",
                icon: "info",
                confirmButtonText: "Iniciar sesión",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    // Abre el modal de inicio de sesión
                    const modalLogin = new bootstrap.Modal(document.getElementById("modalInicioSesion1"));
                    modalLogin.show();
                }
            });
            return; // Detener el proceso de compra hasta que inicie sesión
        }
    
        // Si el usuario ha iniciado sesión, proceder con la compra
        if (productosEnCarrito.length > 0) {
            Swal.fire({
                title: "¡Compra Realizada!",
                text: "Tu pedido llegará pronto 🏃‍♀️‍➡️",
                icon: "success",
                background: "#f8f9fa",
                color: "#333",
                timer: 4000,
                showConfirmButton: true,
            }).then(() => {
                productosEnCarrito = []; // Vaciar el array en memoria
                localStorage.removeItem("productos-en-carrito"); // Limpiar el almacenamiento local
                mostrarCarrito(); // Refrescar la vista del carrito
                document.getElementById("total").textContent = "$0"; // Reiniciar total
            });
        } else {
            Swal.fire({
                title: "Carrito Vacío",
                text: "No tienes productos en el carrito.",
                icon: "warning",
                confirmButtonText: "Agregar productos",
            });
        }
    });
    
    
eliminarDelCarrito();
    mostrarCarrito();
});



