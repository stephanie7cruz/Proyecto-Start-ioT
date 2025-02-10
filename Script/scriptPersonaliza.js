document.addEventListener("DOMContentLoaded", function () {
    // Botones y lógica de selección
    const nombrePaquete = document.getElementById('nombrePaquete');
    const contadorElement = document.getElementById('contador');
    const incrementar = document.getElementById('incrementar');
    const decrementar = document.getElementById('decrementar');
    const addButton = document.getElementById('addButton');
    const botones = document.querySelectorAll("#vehiculoSelector button");
    const mensaje = document.getElementById("mensaje");
    let productos = [];
    let productosSeleccionados = [];
    let contador = 2;

    const imagenesVehiculo = {
        "Carro": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739058629/4_vdsf8b.png",
        "Moto": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739058633/5_njn7g8.png",
        "Camion": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739058631/6_krdneg.png",
        "Carga": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739058630/7_adr5tm.png",
        "Flotas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739058633/8_nqdl03.png",
        "Personas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739058630/9_fugogy.png",
        "Mascotas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739058629/10_ihmhgy.png"
    };
// Función para mostrar mensajes emergentes
function showMessage(msg) {
    let alertBox = document.getElementById("custom-alertaMensaje");
    alertBox.textContent = msg;
    alertBox.style.display = "block";
    setTimeout(() => { alertBox.style.display = "none"; }, 3000);
}

    function actualizarImagenVehiculo(tipoVehiculo) {
        const imagenVehiculo = document.querySelector('.main-image');

        if (imagenesVehiculo[tipoVehiculo]) {
            imagenVehiculo.src = imagenesVehiculo[tipoVehiculo];
            imagenVehiculo.alt = tipoVehiculo;
        } else {
            console.warn("No hay imagen asignada para este tipo de vehículo:", tipoVehiculo);
        }

        // Marcar el botón seleccionado
        const botones = document.querySelectorAll('#vehiculoSelector .btn');
        botones.forEach(boton => {
            boton.classList.remove('active', 'btn-dark');
            boton.classList.add('btn-outline-dark');
        });

        const botonSeleccionado = document.querySelector(`#vehiculoSelector .btn[data-vehiculo="${tipoVehiculo}"]`);
        if (botonSeleccionado) {
            botonSeleccionado.classList.remove('btn-outline-dark');
            botonSeleccionado.classList.add('active', 'btn-dark');
        }
    }

    // Cargar productos desde el JSON
    fetch('../Template/data.json')
        .then(response => response.json())
        .then(data => {
            productos = data.item;
        })
        .catch(error => console.error("Error al cargar los productos:", error));

    // Función para filtrar productos por activo
    function filtrarProductosPorActivo(activo) {
        return productos.filter(producto => producto.activo.includes(activo));
    }

// Función para pintar productos en el banner
function pintarProductos(productosFiltrados, coordenadas) {
    const productosContainer = document.getElementById('productosContainer');
    productosContainer.innerHTML = ''; // Limpiar contenedor

    productosFiltrados.forEach((producto, index) => {
        const productoElement = document.createElement('div');
        productoElement.className = 'position-absolute border p-2 bg-white shadow-sm rounded'; 
        productoElement.style.top = coordenadas[index].top;
        productoElement.style.left = coordenadas[index].left;
        productoElement.style.cursor = 'pointer';
        productoElement.style.opacity = '0.8'; 
        productoElement.style.zIndex = '10'; // Asegura que las tarjetas estén por encima del banner

        productoElement.innerHTML = `
            <div class="text-center">
                <img src="${producto.img}" alt="${producto.name}" style="width: 80px; height: 80px; object-fit: cover;">
                <p class="mt-2 mb-1">${producto.name}</p>
                <i class="fas fa-chevron-down desplegar-icono" style="cursor: pointer;"></i>
                <button class="btn btn-primary mt-2 btn-alert">Click Me</button>
            </div>
            <div class="collapse mt-2" id="descripcion-${producto.id}">
                <p class="text-center">${producto.description}</p>
            </div>
        `;

        // Evento para el botón de alerta
        productoElement.querySelector('.btn-alert').addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el clic en el botón seleccione la tarjeta
         
            showMessage(`Producto seleccionado: ${producto.name}`);
        });

        // Evento de clic para seleccionar/deseleccionar productos
        productoElement.addEventListener('click', (event) => {
            if (!event.target.classList.contains('desplegar-icono')) {
                if (productoElement.classList.contains('seleccionado')) {
                    productoElement.classList.remove('seleccionado');
                    productoElement.style.opacity = '0.8';
                    productosSeleccionados = productosSeleccionados.filter(p => p.id !== producto.id);
                } else {
                    productoElement.classList.add('seleccionado');
                    productoElement.style.opacity = '1';
                    productosSeleccionados.push(producto);
                }
            }
        });

        // Evento para el ícono de despliegue
        productoElement.querySelector('.desplegar-icono').addEventListener('click', (e) => {
            e.stopPropagation();
            const descripcion = document.getElementById(`descripcion-${producto.id}`);
            descripcion.classList.toggle('show');
            e.target.classList.toggle('fa-chevron-down');
            e.target.classList.toggle('fa-chevron-up');
        });

        productosContainer.appendChild(productoElement);
    });
}


    botones.forEach(boton => {
        boton.addEventListener('click', function () {
            let tipoVehiculo = this.getAttribute("data-vehiculo");

            // Actualiza el kit según el tipo de vehículo
            switch (tipoVehiculo) {
                case "Carro":
                    mensaje.textContent = "Has seleccionado un Carro. 🚗";
                    actualizarImagenVehiculo(tipoVehiculo);
                    const productosCarro = filtrarProductosPorActivo("Carro");
                    pintarProductos(productosCarro, [
                        { top: '10%', left: '10%' },
                        { top: '30%', left: '50%' }
                    ]);
                    nombrePaquete.textContent = "PAQUETE GPS (CARRO)";
                    break;

                case "Moto":
                    mensaje.textContent = "Has seleccionado una Moto. 🏍️";
                    actualizarImagenVehiculo(tipoVehiculo);
                    const productosMoto = filtrarProductosPorActivo("Moto");
                    pintarProductos(productosMoto, [
                        { top: '10%', left: '20%' },
                        { top: '40%', left: '70%' }
                    ]);
                    nombrePaquete.textContent = "PAQUETE GPS (MOTO)";
                    break;

                case "Camion":
                    mensaje.textContent = "Has seleccionado un Camión. 🚚";
                    actualizarImagenVehiculo(tipoVehiculo);
                    const productosCamion = filtrarProductosPorActivo("Camion");
                    pintarProductos(productosCamion, [
                        { top: '15%', left: '30%' },
                        { top: '50%', left: '60%' }
                    ]);
                    nombrePaquete.textContent = "PAQUETE GPS (CAMION)";
                    break;

                case "Personas":
                    mensaje.textContent = "Has seleccionado Personas. 👨‍👩‍👦";
                    actualizarImagenVehiculo(tipoVehiculo);
                    const productosPersonas = filtrarProductosPorActivo("Personas");
                    pintarProductos(productosPersonas, [
                        { top: '20%', left: '60%' },
                        { top: '50%', left: '10%' }
                    ]);
                    nombrePaquete.textContent = "PAQUETE GPS (PERSONAS)";
                    break;

                case "Carga":
                    mensaje.textContent = "Has seleccionado Carga. 📦";
                    actualizarImagenVehiculo(tipoVehiculo);
                    const productosCarga = filtrarProductosPorActivo("Carga");
                    pintarProductos(productosCarga, [
                        { top: '25%', left: '40%' },
                        { top: '60%', left: '20%' }
                    ]);
                    nombrePaquete.textContent = "PAQUETE GPS (CARGA)";
                    break;

                case "Flotas":
                    mensaje.textContent = "Has seleccionado Flotas. 🚚";
                    actualizarImagenVehiculo(tipoVehiculo);
                    const productosFlotas = filtrarProductosPorActivo("Flotas");
                    pintarProductos(productosFlotas, [
                        { top: '10%', left: '50%' },
                        { top: '70%', left: '30%' }
                    ]);
                    nombrePaquete.textContent = "PAQUETE GPS (FLOTAS)";
                    break;

                case "Mascotas":
                    mensaje.textContent = "Has seleccionado Mascotas. 🐶🐱";
                    actualizarImagenVehiculo(tipoVehiculo);
                    const productosMascotas = filtrarProductosPorActivo("Mascotas");
                    pintarProductos(productosMascotas, [
                        { top: '30%', left: '70%' },
                        { top: '60%', left: '40%' }
                    ]);
                    nombrePaquete.textContent = "PAQUETE GPS (MASCOTAS)";
                    break;

                default:
                    mensaje.textContent = "Selecciona una opción.";
            }
        });
    });

    // Lógica para incrementar y decrementar el contador
    incrementar.addEventListener('click', () => {
        contador++;
        contadorElement.textContent = contador;
    });

    decrementar.addEventListener('click', () => {
        if (contador > 1) {
            contador--;
            contadorElement.textContent = contador;
        }
    });

    // Lógica para agregar productos al localStorage
    addButton.addEventListener('click', () => {
        localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
        
        showMessage('Productos agregados al carrito');
    });
});