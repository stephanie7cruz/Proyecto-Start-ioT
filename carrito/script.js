document.addEventListener("DOMContentLoaded", function () {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const totalContainer = document.getElementById('total');

    // Mostrar productos en el carrito
    function mostrarCarrito() {
        cartItemsContainer.innerHTML = "";

        if (productosEnCarrito.length === 0) {
            cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
        } else {
            let total = 0;
            productosEnCarrito.forEach(producto => {
                const div = document.createElement('div');
                div.classList.add('cart-item');
                div.innerHTML = `
                    <img src="${producto.img}" alt="${producto.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <p>${producto.name} - ${producto.cantidad} x $${producto.precio}</p>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito('${producto.id}')">Eliminar</button>
                `;
                cartItemsContainer.appendChild(div);

                // Calcular el total
                total += producto.precio * producto.cantidad;
            });
            totalContainer.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
        }
    }

    // Eliminar producto del carrito
    function eliminarDelCarrito(idProducto) {
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idProducto);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        mostrarCarrito();
    }

    // Evento para finalizar compra (solo muestra alerta por ahora)
    document.getElementById("checkoutBtn").addEventListener("click", () => {
        if (productosEnCarrito.length > 0) {
            alert("Compra realizada con éxito.");
            localStorage.removeItem("productos-en-carrito"); // Limpiar el carrito
            mostrarCarrito();
        } else {
            alert("El carrito está vacío.");
        }
    });

    mostrarCarrito();
});
