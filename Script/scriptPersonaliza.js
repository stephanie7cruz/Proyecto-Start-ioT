
document.addEventListener("DOMContentLoaded", function () {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    let botones = document.querySelectorAll("#vehiculoSelector button"); 
    let imagenVehiculo = document.getElementById("imagenVehiculo");
    let productosIzquierda = document.getElementById("productosIzquierda");
    let colDerecha = document.getElementById("colDerecha");
    let productosDerecha = document.getElementById("productosDerecha");
    const imagenesVehiculo = {
        "Carro": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738314240/carro_goxcpe.jpg",
        "Moto": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738314231/moto_icizme.jpg",
        "Camion": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738314237/camion_lzu2p4.avif",
        "Carga": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738314241/container_wghjn3.jpg",
        "Flotas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738314242/flota_fgo88j.jpg",
        "Personas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738314232/personas_f7eq9s.jpg",
        "Mascotas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738314244/mascotas_zm13mf.jpg"
    };
    function actualizarImagenVehiculo(tipoVehiculo) {
        const imagenVehiculo = document.querySelector('.main-image');

        if (imagenesVehiculo[tipoVehiculo]) {
            imagenVehiculo.src = imagenesVehiculo[tipoVehiculo];
            imagenVehiculo.alt = tipoVehiculo;
        } else {
            console.warn("No hay imagen asignada para este tipo de vehículo:", tipoVehiculo);
        }
    }

    botones.forEach(boton => {
        boton.addEventListener('click', function () {
            // Remueve clases de todos los botones
            botones.forEach(btn => {
                btn.classList.remove('active', 'btn-dark');
                btn.classList.add('btn-outline-dark');
            });

            // Agrega clases al botón clickeado
            this.classList.add('active', 'btn-dark');
            this.classList.remove('btn-outline-dark');

            // Obtiene el tipo de vehículo desde el atributo data-vehiculo
            let tipoVehiculo = this.getAttribute("data-vehiculo");

            actualizarImagenVehiculo(tipoVehiculo);

             // Filtra productos según el atributo "activo"
             let productosFiltrados = productosEnCarrito.filter(producto => producto.activo === tipoVehiculo);
             // Limpia la interfaz antes de agregar nuevos productos
             productosIzquierda.innerHTML = "";
             productosDerecha.innerHTML = "";

            


            // Switch para manejar acciones según el vehículo seleccionado
            switch (tipoVehiculo) {
                case "Carro":
                    mensaje.textContent = "Has seleccionado un Carro. 🚗";
                                  
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
                    break;
                case "Moto":
                    mensaje.textContent = "Has seleccionado una Moto. 🏍️";
                    break;
                case "Camion":
                    mensaje.textContent = "Has seleccionado un Camión. 🚚";
                    break;
                case "Personas":
                    mensaje.textContent = "Has seleccionado Personas. 👨‍👩‍👦";
                    break;
                case "Carga":
                    mensaje.textContent = "Has seleccionado Mascotas. 🐶🐱";
                    break;
                 case "Flotas":
                    mensaje.textContent = "Has seleccionado Mascotas. 🐶🐱";
                    break;
                 case "Mascotas":
                    mensaje.textContent = "Has seleccionado Mascotas. 🐶🐱";
                    break;

                default:
                    mensaje.textContent = "Selecciona una opción.";
            }
        });
    });
});


/*
document.addEventListener("DOMContentLoaded", function () {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    let botones = document.querySelectorAll("#vehiculoSelector button"); 
    let mensaje = document.getElementById("mensaje");
    let cartItemsContainer = document.getElementById("cartItemsContainer");

    botones.forEach(boton => {
        boton.addEventListener('click', function () {
            let tipoVehiculo = this.getAttribute("data-vehiculo");

            // Actualiza el mensaje según el tipo de vehículo
            switch (tipoVehiculo) {
                case "Carro":
                    mensaje.textContent = "Has seleccionado un Carro. 🚗";

                    // Mostrar productos según el tipo de vehículo
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

                            // Añadir el evento de eliminar a cada botón
                            const botonEliminar = document.getElementById(`eliminar-${producto.id}`);
                            botonEliminar.addEventListener('click', function () {
                                eliminarDelCarrito(producto.id);
                            });
                        });
                    }
                    break;

                case "Moto":
                    mensaje.textContent = "Has seleccionado una Moto. 🏍️";
                    // Aquí podrías agregar la lógica para mostrar los productos de motos
                    break;

                case "Camion":
                    mensaje.textContent = "Has seleccionado un Camión. 🚚";
                    // Aquí podrías agregar la lógica para mostrar los productos de camiones
                    break;

                case "Personas":
                    mensaje.textContent = "Has seleccionado Personas. 👨‍👩‍👦";
                    // Aquí podrías agregar la lógica para mostrar productos relacionados con personas
                    break;

                case "Carga":
                    mensaje.textContent = "Has seleccionado Carga. 📦";
                    // Aquí podrías agregar la lógica para mostrar productos relacionados con carga
                    break;

                case "Flotas":
                    mensaje.textContent = "Has seleccionado Flotas. 🚚";
                    // Aquí podrías agregar la lógica para mostrar productos de flotas
                    break;

                case "Mascotas":
                    mensaje.textContent = "Has seleccionado Mascotas. 🐶🐱";
                    // Aquí podrías agregar la lógica para mostrar productos de mascotas
                    break;

                default:
                    mensaje.textContent = "Selecciona una opción.";
            }

            // Mostrar los productos según el tipo de vehículo
            const renderizarProductos = (productos) => {
                const rowContainer = document.createElement('div');
                rowContainer.classList.add('row', 'justify-content-center', 'align-items-center', 'mt-4');

                // Generar la columna de imágenes de productos
                const colIzquierda = document.createElement('div');
                colIzquierda.classList.add('col-2', 'd-flex', 'flex-column', 'align-items-center');
                productos.forEach(producto => {
                    const imgProducto = document.createElement('img');
                    imgProducto.src = producto.img;
                    imgProducto.alt = producto.name;
                    imgProducto.classList.add('product-img', 'mb-3');
                    colIzquierda.appendChild(imgProducto);
                });

                // Crear la columna para la imagen principal
                const colDerecha = document.createElement('div');
                colDerecha.classList.add('col-4', 'd-flex', 'justify-content-center');
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                const imgPrincipal = document.createElement('img');
                imgPrincipal.src = "camion.png"; // Cambiar según el tipo de vehículo
                imgPrincipal.style = "max-width: 300px; width: 200%; height: auto; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px;";
                imgPrincipal.classList.add('main-image');
                imgPrincipal.alt = tipoVehiculo;
                imageContainer.appendChild(imgPrincipal);
                colDerecha.appendChild(imageContainer);

                // Generar la columna de más imágenes de productos
                const colDerechaExtra = document.createElement('div');
                colDerechaExtra.classList.add('col-2', 'd-flex', 'flex-column', 'align-items-center');
                productos.forEach(producto => {
                    const imgProducto = document.createElement('img');
                    imgProducto.src = producto.img;
                    imgProducto.alt = producto.name;
                    imgProducto.classList.add('product-img', 'mb-3');
                    colDerechaExtra.appendChild(imgProducto);
                });

                // Añadir las columnas al contenedor de fila
                rowContainer.appendChild(colIzquierda);
                rowContainer.appendChild(colDerecha);
                rowContainer.appendChild(colDerechaExtra);

                // Agregar el contenedor al DOM
                document.getElementById('productos-container').appendChild(rowContainer);
            };

            // Aquí se seleccionan los productos de acuerdo al tipo de vehículo (simulado)
            let productosParaMostrar = [];
            if (tipoVehiculo === "Carro") {
                productosParaMostrar = productosEnCarrito.filter(producto => producto.tipo === "Carro");
            } else if (tipoVehiculo === "Moto") {
                productosParaMostrar = productosEnCarrito.filter(producto => producto.tipo === "Moto");
            } else if (tipoVehiculo === "Camion") {
                productosParaMostrar = productosEnCarrito.filter(producto => producto.tipo === "Camion");
            } else if (tipoVehiculo === "Personas") {
                productosParaMostrar = productosEnCarrito.filter(producto => producto.tipo === "Personas");
            } else if (tipoVehiculo === "Carga") {
                productosParaMostrar = productosEnCarrito.filter(producto => producto.tipo === "Carga");
            } else if (tipoVehiculo === "Flotas") {
                productosParaMostrar = productosEnCarrito.filter(producto => producto.tipo === "Flotas");
            } else if (tipoVehiculo === "Mascotas") {
                productosParaMostrar = productosEnCarrito.filter(producto => producto.tipo === "Mascotas");
            }

            renderizarProductos(productosParaMostrar);
        });
    });
});

*/

