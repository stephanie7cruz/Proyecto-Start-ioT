
document.addEventListener("DOMContentLoaded", function () {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    // const totalContainer = document.getElementById('total');
    // const checkoutContainer = document.getElementById('checkoutContainer');
    const botonContinuarContainer = document.getElementById("botonContinuarContainer");



    function formatearPrecio(precio) {
        return precio.toFixed(2).padStart(10, ' '); // Rellena con espacios para alinear
    }


    function mostrarCarrito() {
        cartItemsContainer.innerHTML = '';

        if (productosEnCarrito.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">No hay productos en el carrito.</p>';
            actualizarDetallesCarrito(0);
        } else {
            let subtotal = 0;

            productosEnCarrito.forEach(producto => {
                const precioFormateado = formatearPrecio(producto.precio);
                const productoHTML = `
                    <div class="cart-item">
                    <div class="cart-item-producto">
                    <div class="cart-item-cantidad">${producto.cantidad}</div>
                        <img src="${producto.img}" alt="${producto.nombre}" class="cart-item-img">
                        <span class="cart-item-nombre" title="${producto.nombre}">
                            ${producto.nombre}
                        </span>
                    </div>
                     
                    <div class="cart-item-precio">$${precioFormateado}</div>
                    <div class="cart-item-acciones">
                        
                    </div>
                </div>
            `;
                cartItemsContainer.innerHTML += productoHTML;
                // total += producto.precio * producto.cantidad;
                subtotal += producto.precio * producto.cantidad;
            });

            // totalContainer.innerHTML = `<h4>Total a pagar: $${total.toFixed(2)}</h4>`;
            actualizarDetallesCarrito(subtotal);
            //     <button class="boton" onclick="eliminarDelCarrito('${producto.id_producto}')">
            //     <i class="fas fa-trash-alt"></i>
            // </button>

        }
    }
    // Función para generar un ID de pedido único (UUID simple)
    function generarOrderId() {
        return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Función asincrónica para generar el hash SHA-256
    async function generateHash(cadena) {
        const encodedText = new TextEncoder().encode(cadena);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Función para actualizar los detalles del carrito
    async function actualizarDetallesCarrito(subtotal) {
        const envio = 0; // Envío gratis
        const descuentos = 0; // Sin descuentos por el momento
        const total = subtotal + envio - descuentos;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('envio').textContent = 'Gratis';
        document.getElementById('descuentos').textContent = `$${descuentos.toFixed(2)}`;
        document.getElementById('total-a-pagar').textContent = `$${total.toFixed(2)}`;

        const boldScript = document.querySelector('script[data-bold-button]');
        if (boldScript) {
            // Convertir el monto a centavos y asegurarse de que sea un número entero
            const amountInCents = Math.round(total);
            boldScript.setAttribute('data-amount', amountInCents.toString());

            // Generar un nuevo ID de pedido
            const orderId = generarOrderId();
            boldScript.setAttribute('data-order-id', orderId);

            // Valores necesarios para el hash de integridad
            const currency = 'COP'; // Divisa de la transacción
            const secretKey = 'xC51qQgSC-8U5NcNceFPkw'; // Llave secreta

            // Concatenar la cadena según las instrucciones del proveedor
            const cadenaConcatenada = `${orderId}${amountInCents}${currency}${secretKey}`;

            try {
                // Generar el hash SHA-256
                const signature = await generateHash(cadenaConcatenada);
                boldScript.setAttribute('data-integrity-signature', signature);
                console.log('Firma digital configurada: ', signature);
            } catch (error) {
                console.error('Error al generar la firma digital: ', error);
            }

            console.log('Monto configurado en centavos: ', amountInCents);
            console.log('ID de Pedido configurado: ', orderId);
        }
    }


    function verificarUsuarioLogueado() {
        const usuarioLogueado = localStorage.getItem("usuario");

        if (usuarioLogueado) {
            // Mostrar botón de "Continuar" si el usuario está logueado
            botonContinuarContainer.innerHTML = `
                <button type="button" class="btn btn-primary" onclick="validateForm(1)">Continuar</button>
            `;
        } else {
            // Mostrar mensaje y botón de "Iniciar sesión" si no hay usuario logueado
            botonContinuarContainer.innerHTML = `
                <div class="mensaje-login-container">
                    <span class="mensaje-login">Debes iniciar sesión para completar la compra.</span>
                    <button id="loginBtn" class="btn btn-secondary">Iniciar sesión</button>
                </div>
            `;

            // Asegúrate de agregar el evento después de renderizar el botón
            const loginBtn = document.getElementById("loginBtn");
            if (loginBtn) {
                loginBtn.addEventListener("click", () => {
                    event.preventDefault();
                    const modalLogin = new bootstrap.Modal(document.getElementById("modalInicioSesion1"));
                    modalLogin.show();
                });
            }
        }
    }

    // Llama las funciones en el orden correcto
    mostrarCarrito();
    verificarUsuarioLogueado();
});

function showSection(sectionNumber) {
    const currentForm = document.getElementById(`form${sectionNumber - 1}`);

    if (sectionNumber === 1 || (currentForm && currentForm.checkValidity())) {
        document.querySelectorAll('.content').forEach(sec => sec.classList.remove('active'));
        document.getElementById(`section${sectionNumber}`).classList.add('active');
    } else {
        markInvalidFields(currentForm);
    }
}

function validateForm(sectionNumber) {
    const form = document.getElementById(`form${sectionNumber}`);
    if (form.checkValidity()) {
        showSection(sectionNumber + 1);
        enableSection(sectionNumber + 1);
    } else {
        markInvalidFields(form);
    }
}

function markInvalidFields(form) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
    });
}

document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        if (input.checkValidity()) {
            if (input.classList.contains('is-invalid')) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        }
    });
});

function enableSection(sectionNumber) {
    const section = document.querySelector(`.section:nth-child(${sectionNumber})`);
    if (section) section.classList.remove('disabled');
}



// Ejemplo de datos guardados en el localStorage
// Puedes configurarlo en tu sistema de login o pruebas
// localStorage.setItem('user', JSON.stringify({
//     nombre: 'Juan Pérez',
//     email: 'juan.perez@correo.com',
//     telefono: '3001234567'
// }));

// Cargar automáticamente los datos del usuario al iniciar la sección 1
window.onload = function () {
    const userData = JSON.parse(localStorage.getItem('usuario'));
    if (userData) {
        document.getElementById('nombre').value = userData.nombre || '';
        document.getElementById('email').value = userData.correo || '';
        document.getElementById('telefono').value = userData.telefono || '';
    }
};

function showSection(sectionNumber) {
    const currentForm = document.getElementById(`form${sectionNumber - 1}`);

    if (sectionNumber === 1 || (currentForm && currentForm.checkValidity())) {
        document.querySelectorAll('.content').forEach(sec => sec.classList.remove('active'));
        document.getElementById(`section${sectionNumber}`).classList.add('active');
    } else {
        markInvalidFields(currentForm);
    }
}

function validateForm(sectionNumber) {
    const form = document.getElementById(`form${sectionNumber}`);
    if (form.checkValidity()) {
        showSection(sectionNumber + 1);
        enableSection(sectionNumber + 1);
    } else {
        markInvalidFields(form);
    }
}

function markInvalidFields(form) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
    });
}

document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        if (input.checkValidity()) {
            if (input.classList.contains('is-invalid')) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        }
    });
});

function enableSection(sectionNumber) {
    const section = document.querySelector(`.section:nth-child(${sectionNumber})`);
    if (section) section.classList.remove('disabled');
}
