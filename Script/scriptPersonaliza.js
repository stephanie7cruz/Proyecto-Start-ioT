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


//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Función principal para pintar productos (GPS y accesorios) en el banner.
 * Permite mantener la selección por activo, cerrar colapsos al cambiar y actualizar la factura.
 * @param {Array} productosFiltrados - Lista de productos filtrados según el activo.
 * @param {Array} coordenadas - Arreglo de objetos con propiedades top y left para posicionar cada card.
 */
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

  // Cerrar todos los collapse cards existentes al cambiar de activo.
  document.querySelectorAll('.collapse-card').forEach(card => card.remove());

  const productosContainer = document.getElementById('productosContainer');
  productosContainer.innerHTML = ''; // Limpiar contenedor

  // Determinar el activo actual (usando window.currentActivo o extrayéndolo del primer producto)
  const activo = window.currentActivo || (productosFiltrados[0] && productosFiltrados[0].activo.split(',')[0].trim()) || 'Activo';

  // Inicializar objeto global para guardar selecciones por activo (si aún no existe)
  if (!window.seleccionesPorActivo) {
    window.seleccionesPorActivo = {};
  }
  // Recuperar la selección previamente guardada para este activo (si existe)
  let seleccionGuardada = window.seleccionesPorActivo[activo] || [];

  // Reiniciar la selección actual (global) y cargar la selección guardada
  window.productosSeleccionados = seleccionGuardada.slice();

  // Filtrar productos por categoría
  const gpsProductos = productosFiltrados.filter(p => p.categoria === 'GPS');
  const accesorios = productosFiltrados.filter(p => p.categoria === 'ACCESORIO');

  // Si no hay productos GPS, mostrar un mensaje y salir
  if (!gpsProductos.length) {
    productosContainer.innerHTML = '<p>No hay productos GPS disponibles.</p>';
    return;
  }

  // Variable para llevar el índice del GPS mostrado (se muestra solo uno a la vez)
  let gpsIndex = 0;

  /**
   * Función interna para mostrar el GPS actual y los accesorios compatibles.
   * Se guarda la selección actual antes de re-renderizar.
   */
  function mostrarGPS() {
    // Guardar la selección actual para este activo
    window.seleccionesPorActivo[activo] = window.productosSeleccionados.slice();

    productosContainer.innerHTML = '';

    // Mostrar el GPS actual en la primera posición (coordenada 0)
    const gpsProducto = gpsProductos[gpsIndex];
    const gpsElement = crearProductoElement(gpsProducto, coordenadas[0] || { top: '10%', left: '10%' }, true, activo);
    productosContainer.appendChild(gpsElement);

    // Filtrar accesorios compatibles: solo se muestran si el GPS actual está incluido en el campo "Compatible"
    const accesoriosCompatibles = accesorios.filter(accesorio => {
      if (!accesorio.Compatible || accesorio.Compatible.trim().toLowerCase() === 'no compatible') {
        return false;
      }
      // Convertir la cadena en un arreglo y eliminar espacios
      const compatibles = accesorio.Compatible.split(',').map(item => item.trim());
      return compatibles.includes(gpsProducto.id);
    });

    // Solo pintar accesorios si hay al menos uno compatible
    if (accesoriosCompatibles.length > 0) {
      accesoriosCompatibles.forEach((accesorio, idx) => {
        const coord = coordenadas[idx + 1] || { top: '50%', left: '50%' };
        const accesorioElement = crearProductoElement(accesorio, coord, false, activo);
        productosContainer.appendChild(accesorioElement);
      });
    }
  }

  /**
   * Función para crear la card de un producto (GPS o accesorio).
   * Si el producto ya estaba seleccionado previamente, se restauran sus estilos.
   * @param {Object} producto - Datos del producto.
   * @param {Object} coordenada - Objeto con propiedades top y left para posicionar la card.
   * @param {Boolean} esGPS - true si es GPS; false si es accesorio.
   * @param {String} activo - Activo actual (para mantener la selección).
   * @returns {HTMLElement} La card del producto.
   */
  function crearProductoElement(producto, coordenada, esGPS, activo) {
    const productoElement = document.createElement('div');
    productoElement.className = 'producto-card';
    productoElement.style.position = 'absolute';
    productoElement.style.top = coordenada.top;
    productoElement.style.left = coordenada.left;
    productoElement.style.width = '180px';
    productoElement.style.height = '220px';
    productoElement.style.backgroundColor = 'white';
    productoElement.style.border = '1px solid #ccc';
    productoElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    productoElement.style.cursor = 'pointer';
    productoElement.style.transition = 'transform 0.3s, box-shadow 0.3s, background-color 0.3s';
    productoElement.style.padding = '10px';
    productoElement.style.overflow = 'hidden';

    productoElement.innerHTML = `
      <div class="card-content">
        <img src="${producto.img}" alt="${producto.name}" class="producto-img" style="width:100%; height:100px; object-fit:cover; margin-bottom:5px;">
        <p class="producto-nombre" style="margin:5px 0; font-size:16px; text-align:center;">${producto.name}</p>
        <div class="producto-actions" style="text-align:center;">
          ${ esGPS ? '<i class="fas fa-exchange-alt cambiar-gps" title="Cambiar GPS" style="cursor:pointer; margin-right:5px;"></i>' : '' }
          <i class="fas fa-chevron-down collapse-btn" title="Ver Descripción" style="cursor:pointer;"></i>
        </div>
      </div>
    `;

    // Si el producto ya estaba seleccionado en una sesión anterior para este activo, se marca
    if (seleccionGuardada.some(p => p.id === producto.id)) {
      productoElement.classList.add('seleccionado');
      productoElement.style.backgroundColor = 'green';
      productoElement.style.opacity = '1';
      if (!window.productosSeleccionados.some(p => p.id === producto.id)) {
        window.productosSeleccionados.push(producto);
      }
    } else {
      productoElement.style.opacity = '0.8';
    }

    // Efectos de hover
    productoElement.addEventListener('mouseenter', () => {
      productoElement.style.transform = 'scale(1.05)';
      productoElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    });
    productoElement.addEventListener('mouseleave', () => {
      productoElement.style.transform = 'scale(1)';
      productoElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });

    // Evento para mostrar/ocultar la descripción (collapse)
    const collapseBtn = productoElement.querySelector('.collapse-btn');
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCollapse(producto, esGPS, productoElement);
      collapseBtn.classList.toggle('fa-chevron-down');
      collapseBtn.classList.toggle('fa-chevron-up');
    });

    // Si el producto es GPS, agregar el botón para cambiar de GPS
    if (esGPS) {
      const cambiarBtn = productoElement.querySelector('.cambiar-gps');
      cambiarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        gpsIndex = (gpsIndex + 1) % gpsProductos.length;
        // Guardar la selección actual antes de cambiar
        window.seleccionesPorActivo[activo] = window.productosSeleccionados.slice();
        mostrarGPS();
      });
    }

    // Evento para seleccionar/deseleccionar la card (cada selección representa un kit)
    productoElement.addEventListener('click', () => {
      if (productoElement.classList.contains('seleccionado')) {
        productoElement.classList.remove('seleccionado');
        productoElement.style.backgroundColor = 'white';
        productoElement.style.opacity = '0.8';
        window.productosSeleccionados = window.productosSeleccionados.filter(p => p.id !== producto.id);
        if (window.seleccionesPorActivo[activo]) {
          window.seleccionesPorActivo[activo] = window.seleccionesPorActivo[activo].filter(p => p.id !== producto.id);
        }
      } else {
        productoElement.classList.add('seleccionado');
        productoElement.style.backgroundColor = 'green';
        productoElement.style.opacity = '1';
        window.productosSeleccionados.push(producto);
        if (!window.seleccionesPorActivo[activo]) {
          window.seleccionesPorActivo[activo] = [];
        }
        window.seleccionesPorActivo[activo].push(producto);
      }
    });

    return productoElement;
  }

  /**
   * Función para crear o eliminar la card de descripción (collapse) de un producto.
   * Se posiciona a la izquierda para GPS o a la derecha para accesorios.
   * @param {Object} producto - Datos del producto.
   * @param {Boolean} esGPS - true si el producto es GPS; false si es accesorio.
   * @param {HTMLElement} productElement - La card sobre la que se hizo clic.
   */
  function toggleCollapse(producto, esGPS, productElement) {
    const descId = 'collapse-' + producto.id;
    let descCard = document.getElementById(descId);
    if (descCard) {
      // Si la card ya está visible, se elimina
      descCard.remove();
    } else {
      // Se crea la card de descripción con detalles del producto
      descCard = document.createElement('div');
      descCard.id = descId;
      descCard.className = 'collapse-card card';
      descCard.innerHTML = `
        <div class="card-body">
          <h5 class="card-title" style="font-size:16px;">${producto.name}</h5>
          <p class="card-text" style="font-size:14px;">${producto.description}</p>
          <p class="card-text"><small class="text-muted">${producto.especificaciones || ''}</small></p>
        </div>
      `;
      // Posicionar la card de descripción fuera de la card principal
      const rect = productElement.getBoundingClientRect();
      if (esGPS) {
        descCard.style.left = (rect.left - 220) + 'px';
      } else {
        descCard.style.left = (rect.right + 20) + 'px';
      }
      descCard.style.top = rect.top + 'px';
      descCard.style.position = 'absolute';
      descCard.style.width = '220px';
      descCard.style.zIndex = '1000';
      descCard.style.backgroundColor = '#fff';
      descCard.style.border = '1px solid #ccc';
      descCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      descCard.style.padding = '10px';

      // Botón para cerrar la descripción
      const closeBtn = document.createElement('button');
      closeBtn.className = 'btn btn-sm btn-secondary';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '5px';
      closeBtn.style.right = '5px';
      closeBtn.textContent = 'X';
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        descCard.remove();
        const collapseIcon = productElement.querySelector('.collapse-btn');
        if (collapseIcon) {
          collapseIcon.classList.remove('fa-chevron-up');
          collapseIcon.classList.add('fa-chevron-down');
        }
      });
      descCard.appendChild(closeBtn);

      document.body.appendChild(descCard);
    }
  }

  // Evento para el botón "ADD": muestra alert, agrega los kits a la lista global (factura)
  // y actualiza el contenido del modal con la factura en formato de tabla.
  document.getElementById('addProductos').addEventListener('click', () => {
    if (window.productosSeleccionados.length === 0) {
      alert('No hay productos seleccionados.');
      return;
    }
    // Determinar el activo actual y obtener su nombre
    const activo = window.currentActivo || (productosFiltrados[0] && productosFiltrados[0].activo.split(',')[0].trim()) || 'Activo';
    const kitCount = parseInt(document.getElementById('contador').textContent, 10) || 1;
    const productosNombres = window.productosSeleccionados.map(p => p.name).join(', ');
    alert(`${kitCount} kit(s) para ${activo} contiene: ${productosNombres}`);
    
    // Agregar la selección actual a la lista de kits (factura), guardando también el nombre del activo
    if (!window.listaDeKits) {
      window.listaDeKits = [];
    }
    window.listaDeKits = window.listaDeKits.concat(window.productosSeleccionados.map(item => ({ ...item, activo })));
    
    // Actualizar el contenido del modal (factura) mediante generateFacturaHTML
    const facturaElement = document.getElementById('factura');
    if (facturaElement) {
      facturaElement.innerHTML = generateFacturaHTML(window.listaDeKits);
    }
    
    // Luego de "Add": limpiar la selección, cerrar colapsos y re-renderizar el activo
    window.productosSeleccionados = [];
    window.seleccionesPorActivo[activo] = [];
    document.querySelectorAll('.collapse-card').forEach(card => card.remove());
    mostrarGPS();
  });

  // Mostrar inicialmente el GPS actual y sus accesorios compatibles
  mostrarGPS();
}

/**
 * Función para generar el HTML de la factura (lista de kits) en forma de tabla.
 * Cada fila muestra el kit, el activo, precio unitario, cantidad, subtotal y controles para modificar.
 * @param {Array} lista - Arreglo de productos (kits) agregados a la factura.
 * @returns {String} HTML generado.
 */
function generateFacturaHTML(lista) {
  // Agrupar kits por id para calcular cantidades y subtotales
  const grouped = {};
  lista.forEach(item => {
    if (!grouped[item.id]) {
      grouped[item.id] = { ...item, quantity: 1 };
    } else {
      grouped[item.id].quantity++;
    }
  });
  let html = '<table class="table table-striped">';
  html += '<thead><tr><th>Kit</th><th>Activo</th><th>Precio Unitario</th><th>Cantidad</th><th>Subtotal</th><th>Acciones</th></tr></thead>';
  html += '<tbody>';
  let total = 0;
  for (const id in grouped) {
    const kit = grouped[id];
    const subtotal = kit.precio * kit.quantity;
    total += subtotal;
    html += `<tr data-kit-id="${kit.id}">
               <td>${kit.name}</td>
               <td>${kit.activo || ''}</td>
               <td>${kit.precio.toFixed(2)}</td>
               <td>
                 <button class="btn btn-sm btn-outline-secondary decrement">-</button>
                 <span class="mx-2 quantity">${kit.quantity}</span>
                 <button class="btn btn-sm btn-outline-secondary increment">+</button>
               </td>
               <td>${subtotal.toFixed(2)}</td>
               <td><button class="btn btn-sm btn-danger remove-kit">Eliminar</button></td>
             </tr>`;
  }
  html += '</tbody>';
  html += `<tfoot>
             <tr>
               <td colspan="4"><strong>Total</strong></td>
               <td colspan="2"><strong>${total.toFixed(2)}</strong></td>
             </tr>
           </tfoot>`;
  html += '</table>';
  return html;
}

//-----------------------------------------------------------------------------------------------------------------------------

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
                        { top: '30%', left: '50%' },
                        { top: '40%', left: '70%' },
                        
                    ]);
                    nombrePaquete.textContent = "PAQUETE GPS (CARRO)";
                    break;

                case "Moto":
                    mensaje.textContent = "Has seleccionado una Moto. 🏍️";
                    actualizarImagenVehiculo(tipoVehiculo);
                    const productosMoto = filtrarProductosPorActivo("Moto");
                    pintarProductos(productosMoto, [
                        { top: '10%', left: '20%' },
                       
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
                        { top: '00%', left: '35%' },
                        { top: '00%', left: '00%' },
                        { top: '10%', left: '00%' },
                        { top: '40%', left: '40%' },
                        { top: '50%', left: '50%' }
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

    // Actualiza el contenido del modal (factura) al hacer clic en el botón Preview
  document.getElementById('PREVIEW').addEventListener('click', () => {
  const facturaElement = document.getElementById('factura');
  // Se asume que generateFacturaHTML es la función que genera el HTML de la factura
  facturaElement.innerHTML = generateFacturaHTML(window.listaDeKits);
});


    

 });

