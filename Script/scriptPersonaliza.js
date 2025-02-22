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
  let contador = 0;

  const imagenesVehiculo = {
      "Carro": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739264947/5_la63bl.png",
      "Moto": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739264943/6_lsntlw.png",
      "Camion": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739264944/7_slutxo.png",
      "Carga": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739264944/8_o2prh9.png",
      "Flotas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739264946/9_mem2mw.png",
      "Personas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739264945/10_ues1f7.png",
      "Mascotas": "https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739264945/11_mfqnih.png"
  };
  //-------------------------------------------------------------------------------------------

   /********************************************
     * FUNCIÓN: actualizarImagenVehiculo (Step 1)
     * Actualiza la imagen principal y marca el botón seleccionado.
     ********************************************/
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
   /********************************************
     * CARGA DE PRODUCTOS (Step 1)
     ********************************************/
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
// Función para pintar productos según el activo actual y coordenadas de posición
function pintarProductos(productosFiltrados, coordenadas) {
  // Guardar globalmente para su uso en otros eventos
  window.productosFiltrados = productosFiltrados;
  // Cerrar todos los collapse cards existentes
  document.querySelectorAll('.collapse-card').forEach(card => card.remove());
  const productosContainer = document.getElementById('productosContainer');
  productosContainer.innerHTML = ''; // Limpiar contenedor
  // Determinar el activo actual: usa window.currentActivo o extrae del primer producto
  const activo = window.currentActivo || 
                 (window.productosFiltrados[0] && window.productosFiltrados[0].activo.split(',')[0].trim()) || 
                 'Activo';

  // Asegurar que exista el objeto global para guardar selecciones por activo
  if (!window.seleccionesPorActivo) {
    window.seleccionesPorActivo = {};
  }

  // Recuperar la selección guardada en localStorage para este activo
  let almacenado = JSON.parse(localStorage.getItem('seleccionesPorActivo')) || {};
  if (!almacenado[activo]) {
    almacenado[activo] = [];
  }
  // Actualizar la selección global con la que ya estaba guardada
  window.productosSeleccionados = almacenado[activo].slice();

  // Filtrar productos en dos categorías: GPS y ACCESORIO
  const gpsProductos = productosFiltrados.filter(p => p.categoria === 'GPS');
  const accesorios = productosFiltrados.filter(p => p.categoria === 'ACCESORIO');

  if (!gpsProductos.length) {
    productosContainer.innerHTML = '<p>No hay productos GPS disponibles.</p>';
    return;
  }

  // Índice para el GPS mostrado (se muestra uno a la vez)
  let gpsIndex = 0;

  // Función interna para renderizar el GPS actual y sus accesorios compatibles
  function mostrarGPS() {
    // Guardar la selección actual para este activo en localStorage
    almacenado[activo] = window.productosSeleccionados.slice();
    localStorage.setItem('seleccionesPorActivo', JSON.stringify(almacenado));

    productosContainer.innerHTML = '';

    // Mostrar el GPS actual en la primera posición (coordenada 0)
    const gpsProducto = gpsProductos[gpsIndex];
    const gpsElement = crearProductoElement(gpsProducto, coordenadas[0] || { top: '10%', left: '10%' }, true, activo);
    productosContainer.appendChild(gpsElement);

    // Filtrar accesorios compatibles según el campo "Compatible"
    const accesoriosCompatibles = accesorios.filter(accesorio => {
      if (!accesorio.Compatible || accesorio.Compatible.trim().toLowerCase() === 'no compatible') {
        return false;
      }
      const compatibles = accesorio.Compatible.split(',').map(item => item.trim());
      return compatibles.includes(gpsProducto.id);
    });

    // Mostrar accesorios compatibles, si existen
    if (accesoriosCompatibles.length > 0) {
      accesoriosCompatibles.forEach((accesorio, idx) => {
        const coord = coordenadas[idx + 1] || { top: '50%', left: '50%' };
        const accesorioElement = crearProductoElement(accesorio, coord, false, activo);
        productosContainer.appendChild(accesorioElement);
      });
    }
  }

  /**
   * Función para crear la card de un producto.
   * Restaura el estado si ya estaba seleccionado.
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
        <div class="producto-img-wrapper" style="width:100%; height:120px; display:flex; align-items:center; justify-content:center; background:#f1f1f1; border-radius:4px; margin-bottom:5px;">
          <img src="${producto.img}" alt="${producto.name}" class="producto-img" style="max-width:100%; max-height:100%; object-fit:contain;">
        </div>
        <p class="producto-nombre" style="margin:5px 0; font-size:16px; text-align:center;">${producto.name}</p>
        <div class="producto-actions" style="text-align:center;">
          ${ esGPS ? '<i class="fas fa-sync-alt cambiar-gps" title="Cambiar GPS" style="cursor:pointer; margin-right:5px;"></i>' : '' }
          <i class="fas fa-chevron-down collapse-btn" title="Ver Descripción" style="cursor:pointer;"></i>
        </div>
      </div>
    `;

    // Efectos de hover para animación
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

    // Para GPS: botón para cambiar el GPS
    if (esGPS) {
      const cambiarBtn = productoElement.querySelector('.cambiar-gps');
      cambiarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        gpsIndex = (gpsIndex + 1) % gpsProductos.length;
        almacenado[activo] = window.productosSeleccionados.slice();
        localStorage.setItem('seleccionesPorActivo', JSON.stringify(almacenado));
        mostrarGPS();
      });
    }

    // Evento para seleccionar/deseleccionar la card
    productoElement.addEventListener('click', () => {
      if (productoElement.classList.contains('seleccionado')) {
        // Deseleccionar
        productoElement.classList.remove('seleccionado');
        productoElement.style.background = '';
        const checkIcon = productoElement.querySelector('.selected-icon');
        if (checkIcon) {
          checkIcon.remove();
        }
        productoElement.classList.remove('jump-animation');
        window.productosSeleccionados = window.productosSeleccionados.filter(p => p.id !== producto.id);
        if (window.seleccionesPorActivo[activo]) {
          window.seleccionesPorActivo[activo] = window.seleccionesPorActivo[activo].filter(p => p.id !== producto.id);
        }
      } else {
        // Seleccionar: agregar clases y animación, y cambiar el fondo
        productoElement.classList.add('seleccionado');
        productoElement.classList.add('jump-animation');
        productoElement.style.background = 'linear-gradient(135deg, #284170, #943c7a)';
        let checkIcon = productoElement.querySelector('.selected-icon');
        if (!checkIcon) {
          checkIcon = document.createElement('i');
          checkIcon.className = 'fas fa-award selected-icon';
          checkIcon.style.position = 'absolute';
          checkIcon.style.top = '10px';
          checkIcon.style.right = '10px';
          checkIcon.style.color = '#d4af37'; // Dorado
          checkIcon.style.fontSize = '35px';
          productoElement.appendChild(checkIcon);
        }
        window.productosSeleccionados.push(producto);
        if (!window.seleccionesPorActivo[activo]) {
          window.seleccionesPorActivo[activo] = [];
        }
        window.seleccionesPorActivo[activo].push(producto);
      }
      // Actualizar localStorage para este activo
      almacenado[activo] = window.productosSeleccionados.slice();
      localStorage.setItem('seleccionesPorActivo', JSON.stringify(almacenado));
    });

    return productoElement;
  }

  // Función para crear o eliminar la card de descripción (collapse) del producto
  function toggleCollapse(producto, esGPS, productElement) {
    const descId = 'collapse-' + producto.id;
    let descCard = document.getElementById(descId);
    if (descCard) {
      descCard.remove();
    } else {
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
      const rect = productElement.getBoundingClientRect();
      if (esGPS) {
        descCard.style.left = (rect.left - 270) + 'px';
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
      document.body.appendChild(descCard);
    }
  }

  // Mostrar inicialmente el GPS y accesorios compatibles
  mostrarGPS();
}
function calcularYMostrarTotalCompra() {
  let totalCompra = 0;
  const listaDeKits = JSON.parse(localStorage.getItem('listaDeKits')) || [];

  listaDeKits.forEach(kit => {
      totalCompra += kit.PrecioTotal;
  });

  // Formatear como COP
  const formattedTotal = totalCompra.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
  });

  // Mostrar en el elemento con id "totalKits"
  const totalKitsElement = document.getElementById('totalKits');
  if (totalKitsElement) {
      totalKitsElement.textContent = formattedTotal;
  }

  // Mostrar en el elemento con id "totalCompra"
  const totalCompraElement = document.getElementById('totalCompra');
  if (totalCompraElement) {
      totalCompraElement.innerText = formattedTotal; // Use innerText instead of textContent
  }
}

function actualizarInformacionDeCompra() {
  const listaDeKits = JSON.parse(localStorage.getItem('listaDeKits')) || [];

  // Actualizar activos seleccionados
  const botonesActivos = document.querySelectorAll('#activosSeleccionados button');
  const activosEnKits = [...new Set(listaDeKits.map(kit => kit.activo))];

  botonesActivos.forEach(boton => {
      const activo = boton.textContent;

      if (activosEnKits.includes(activo)) {
          boton.classList.remove('btn-outline-dark');
          boton.classList.add('btn-dark');
      } else {
          boton.classList.remove('btn-dark');
          boton.classList.add('btn-outline-dark');
      }
  });

  // Calcular totales para mostrar en el resumen de compra
  let totalGPS = 0;
  let totalAccesorios = 0;
  let totalDispositivos = 0; // Incluye GPS y accesorios
  let totalLicenciasTrackeadas = 0;

  listaDeKits.forEach(kit => {
      totalGPS += kit.gps * kit.cantidad_Kits; // Suma de GPS por cada kit multiplicado por cantidad de kits
      totalAccesorios += kit.accesorios * kit.cantidad_Kits; // Suma de accesorios por cada kit multiplicado por cantidad de kits

      // Dispositivos totales incluyen tanto GPS como accesorios, pero aquí solo contamos los dispositivos trackeados (GPS)
      totalDispositivos += (kit.gps + kit.accesorios) * kit.cantidad_Kits;

      // Licencias trackeadas son equivalentes a los dispositivos GPS, ya que cada uno requiere una licencia para ser rastreado.
      totalLicenciasTrackeadas += (kit.totalLicencias) * kit.cantidad_Kits;
      
});

// Mostrar información en el resumen de compra
document.getElementById('gpsUnits').textContent = `${totalGPS} unidades`;
document.getElementById('accesoriosUnits').textContent = `${totalAccesorios} unidades`;
document.getElementById('dispositivosCount').textContent = `${totalDispositivos} unidades`;
document.getElementById('licenciasCount').textContent = `${totalLicenciasTrackeadas} Licencias track`;

}

document.getElementById('deleteProductos').addEventListener('click', function() {
  // Determinar el activo actual
  const activoActual = window.currentActivo ? window.currentActivo : 'Activo';

  // Obtener la lista de kits desde localStorage
  let listaDeKits = JSON.parse(localStorage.getItem('listaDeKits')) || [];

  // Filtrar la lista para mantener solo los kits de otros activos
  const kitsAEliminar = listaDeKits.filter(kit => kit.activo === activoActual);

 if(kitsAEliminar.length === 0){
  return alert(`No hay kits para eliminar en el activo actual ${activoActual}`);
 }

  // Confirmación antes de eliminar
  if (confirm(`¿Eliminar todos los kits de ${activoActual}?`)) {
      // Filtrar la lista para excluir los kits del activo actual
      listaDeKits = listaDeKits.filter(kit => kit.activo !== activoActual);

      // Guardar la lista actualizada en localStorage
      localStorage.setItem('listaDeKits', JSON.stringify(listaDeKits));

      // Recalcular y mostrar el total de la compra
      calcularYMostrarTotalCompra();

      // Opcional: Mostrar mensaje de éxito
      alert(`¡Todos los kits de ${activoActual} han sido eliminados!`);
  } else {
      // Si el usuario cancela
      alert("Eliminación cancelada.");
  }
});


const PLANES = {
  start: 15000,
  starter: 20000,
  enterprise: 30000
};
let isRealTimeEnabled = false;


function definirPlan(gpsCount, vehiculo) {
    if (gpsCount < 3 && (vehiculo === 'Carro' || vehiculo === 'Moto')) {
        return 'start';
    } else if (gpsCount >= 4 && gpsCount <= 6 && (vehiculo === 'Camion' || vehiculo === 'Carga')) {
        return 'starter';
    } else if (gpsCount > 6 || vehiculo === 'Flotas') {
        return 'enterprise';
    } else {
        return 'start'; // Plan por defecto
    }
}


function calcularPrecioTotal(productos, cantidadKits) {
  return productos.reduce((total, producto) => total + producto.precio * cantidadKits, 0);
}

window.toggleRealTime = function (checkbox) {
  isRealTimeEnabled = checkbox.checked;
};



// Evento para el botón "ADD Productos"
document.getElementById('addProductos').addEventListener('click', () => {
  if (window.productosSeleccionados.length === 0) {
    alert('No hay productos seleccionados para este activo.');
    return;
  }
  // Determinar el activo actual utilizando window.productosFiltrados
    const activo = window.currentActivo ? window.currentActivo : 'Activo';


  // Obtener la cantidad del contador
  const kitCount = parseInt(document.getElementById('contador').textContent, 10) || 1;
  const cantidadGPS = window.productosSeleccionados.filter(p => p.categoria === 'GPS').length;
  const planSeleccionado = definirPlan(cantidadGPS, activo);

  let costoPlanPorKit = isRealTimeEnabled ? PLANES[planSeleccionado] * cantidadGPS : 0;
  let costoTotalPlan = costoPlanPorKit * kitCount;

  let precioTotalProductos = calcularPrecioTotal(window.productosSeleccionados, kitCount);
  let precioTotalFinal = precioTotalProductos + costoTotalPlan;

  // Recuperar o inicializar la estructura en localStorage llamada "listaDeKits" como un arreglo
  let listaDeKits = JSON.parse(localStorage.getItem('listaDeKits')) || [];
  
  // Crear un nuevo kit (no actualizar el existente)
  const newKit = {
    activo: activo,
    productos: window.productosSeleccionados.slice(), // copia de la selección actual
    cantidad_Kits: kitCount,
    gps: window.productosSeleccionados.filter(p => p.categoria === 'GPS').length,
    accesorios: window.productosSeleccionados.filter(p => p.categoria === 'ACCESORIO').length,
    id: Date.now(), // Nuevo id único para este kit
    plan: definirPlan(window.productosSeleccionados.filter(p => p.categoria === 'GPS').length, window.currentActivo ? window.currentActivo : 'Activo'),
    totalLicencias: kitCount,
    detallesPlan: "alertas personalizadas",
    Suscripcion:"indefinido",
    PrecioTotal: precioTotalFinal
  };

  listaDeKits.push(newKit);
  localStorage.setItem('listaDeKits', JSON.stringify(listaDeKits));
  calcularYMostrarTotalCompra();
  actualizarInformacionDeCompra()


const popup = document.createElement('div');
popup.style.position = 'fixed';
popup.style.top = '50%';
popup.style.left = '50%';
popup.style.transform = 'translate(-50%, -50%)';
popup.style.background = '#fff'; // Fondo blanco
popup.style.color = '#333'; // Texto oscuro para contraste
popup.style.padding = '30px 40px';
popup.style.borderRadius = '8px';
popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
popup.style.zIndex = '9999';
popup.style.fontSize = '1.3rem';
popup.style.textAlign = 'center';
popup.style.opacity = '1';
popup.style.transition = 'opacity 0.5s ease';

popup.innerHTML = `
  <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745; display:block; margin-bottom: 15px;"></i>
  <strong>¡Excelente elección!</strong><br>
  Has agregado un nuevo kit. ¡Prepárate para vivir una experiencia única!
`;

document.body.appendChild(popup);

setTimeout(() => {
  popup.style.opacity = '0';
  setTimeout(() => {
    popup.remove();
  }, 500);
}, 3000);

  // Actualizar el contenido del modal factura y resumen (suponiendo que estas funciones existen)
  const facturaElement = document.getElementById('factura');
  if (facturaElement) {
    facturaElement.innerHTML = generateFacturaHTML(listaDeKits);
  }
  updateCollapseKit(listaDeKits);
  updateFacturaSummary(listaDeKits);

   // Limpiar la selección actual para este activo y reiniciar el contador
  window.productosSeleccionados = [];
  if (window.seleccionesPorActivo[activo]) {
    window.seleccionesPorActivo[activo] = [];
  }
  document.querySelectorAll('.collapse-card').forEach(card => card.remove());
  // Re-pintar los productos (manteniendo las coordenadas, ajusta según corresponda)
  pintarProductos(window.productosFiltrados, []);
  // Reiniciar visualmente el contador y la variable interna
  document.getElementById('contador').textContent = '0';
  contador = 0;
  
  // Lógica para incrementar y decrementar el contador
 incrementar = document.getElementById('incrementar');
 decrementar = document.getElementById('decrementar');
 contadorElement = document.getElementById('contador');
 contador = parseInt(contadorElement.textContent, 10) || 0;

incrementar.addEventListener('click', () => {
  contador++;
  contadorElement.textContent = contador;
});

decrementar.addEventListener('click', () => {
  if (contador > 0) {
    contador--;
    contadorElement.textContent = contador;
  }
});
});

/*  HAhora vamos al step2*/

// Funciones auxiliares (defínelas globalmente en tu proyecto)
function formatPrice(value) {
  return Number(value).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
}

function getActiveIcon(activo) {
  switch(activo.toLowerCase()) {
    case "carro": return "fas fa-car";
    case "moto": return "fas fa-motorcycle";
    case "carga": return "fas fa-truck";
    default: return "fas fa-box";
  }
}

actualizarInformacionDeCompra()
calcularYMostrarTotalCompra();





function generateFacturaHTML() {
  // Recuperar o inicializar la lista de kits desde localStorage
  let listaDeKits = JSON.parse(localStorage.getItem('listaDeKits')) || [];
  let html = '';

  // Agregar estilos CSS personalizados (puedes mover este bloque a tu archivo de estilos)
  html += `
  <style>
    /* Estilos globales para las cards de kit */
    .kit-card {
      border: none;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s ease;
      background-color: #fff;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .kit-card:hover {
      transform: translateY(-5px);
    }
    .kit-card-header {
      background: linear-gradient(135deg, #284170, #943c7a);
      color: #fff;
      padding: 1rem;
      text-align: center;
    }
    .kit-header-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .kit-header-controls h4 {
      margin: 0;
      font-size: 1.5rem;
      color: #fff;
    }
    .kit-info {
      margin-top: 0.5rem;
      text-align: center;
      color: #fff;
      font-size: 0.9rem;
    }
    .kit-info span {
      margin-right: 1rem;
    }
    .collapse-header {
      background: #f8f9fa;
      border-radius: 4px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: background 0.3s ease;
      font-weight: bold;
      font-size: 1rem;
      color: #333;
    }
    .collapse-header:hover {
      background: #e9ecef;
    }
    .product-item {
      position: relative;
      background-size: cover;
      background-position: center;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
      min-height: 100px;
      transition: transform 0.3s ease;
      cursor: pointer;
    }
    .product-item:hover {
      transform: scale(1.02);
    }
    .product-overlay {
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 0.5rem;
      position: absolute;
      bottom: 0;
      width: 100%;
      font-size: 0.9rem;
    }
    .subscription-section {
      border-top: 1px solid #ddd;
      padding-top: 1rem;
      margin-top: 1rem;
    }
    .subscription-btn {
      transition: background 0.3s ease, color 0.3s ease;
    }
    .subscription-btn:hover, .subscription-btn.active {
      background: #284170;
      color: #fff;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background-color: #f8f9fa;
    }
    .remove-kit-footer {
      color: #6c757d;
      cursor: pointer;
    }
    .remove-kit-footer:hover {
      color: #dc3545;
    }
    /* Transiciones para el modal de producto */
    .tracking-modal-enter {
      opacity: 0;
      transform: scale(0.9);
    }
    .tracking-modal-enter-active {
      opacity: 1;
      transform: scale(1);
      transition: all 0.3s ease;
    }
    .tracking-modal-exit {
      opacity: 1;
      transform: scale(1);
    }
    .tracking-modal-exit-active {
      opacity: 0;
      transform: scale(0.9);
      transition: all 0.3s ease;
    }
  </style>
  `;

  // Título principal con más estilo
  html += `
  <div class="text-center my-4">
    <h3 style="font-family: 'Helvetica Neue', sans-serif; font-weight: bold;">Descubre Tus Kits Personalizados</h3>
    <p class="text-muted" style="font-size: 1rem;">Explora y ajusta cada detalle de tus kits, creados especialmente para ti.</p>
  </div>
  `;

  // Iterar sobre cada kit en la lista
  listaDeKits.forEach(kit => {
    // Filtrar productos por categoría
    const gpsProducts = kit.productos.filter(p => p.categoria && p.categoria.toUpperCase() === "GPS");
    const accesoriosProducts = kit.productos.filter(p => p.categoria && p.categoria.toUpperCase() === "ACCESORIO");

    // Preparar el contenido para 'detallesPlan'
    let detallesPlanContent = '';
    if (Array.isArray(kit.detallesPlan)) {
      detallesPlanContent = kit.detallesPlan.length > 0
        ? kit.detallesPlan.map(detail => `<li class="list-group-item">${detail}</li>`).join('')
        : `<li class="list-group-item">No hay detalles del plan.</li>`;
    } else {
      detallesPlanContent = kit.detallesPlan && kit.detallesPlan.trim() !== ''
        ? `<li class="list-group-item">${kit.detallesPlan}</li>`
        : `<li class="list-group-item">No hay detalles del plan.</li>`;
    }

    html += `
      <div class="card kit-card shadow-sm">
        <div class="card-header kit-card-header">
          <div class="kit-header-controls">
            <button class="btn btn-outline-light btn-sm decrement-kit" data-kit-id="${kit.id}">
              <i class="fas fa-minus"></i>
            </button>
            <h4>
              <i class="${getActiveIcon(kit.activo)}"></i> Kit para ${kit.activo}
            </h4>
            <button class="btn btn-outline-light btn-sm increment-kit" data-kit-id="${kit.id}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="kit-info">
            <span><i class="fas fa-layer-group"></i> Kits: ${kit.cantidad_Kits}</span>
            <span><i class="fas fa-satellite-dish"></i> GPS: ${kit.gps}</span>
            <span><i class="fas fa-plug"></i> Accesorios: ${kit.accesorios}</span>
            <span><i class="fas fa-key"></i> Licencias: ${kit.totalLicenses || kit.totalLicencias || 0}</span>
            <span><i class="fas fa-bell"></i> Suscripciones: ${kit.Suscripcion || 0}</span>
            <span><i class="fas fa-file-alt"></i> Plan: ${kit.plan || "N/A"}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- Columna: Productos GPS -->
            <div class="col-md-4 mb-3">
              <div class="collapse-header" data-bs-toggle="collapse" data-bs-target="#collapseGps${kit.id}" aria-expanded="false" aria-controls="collapseGps${kit.id}">
                <i class="fas fa-chevron-down"></i> Productos GPS
              </div>
              <div class="collapse" id="collapseGps${kit.id}">
                <div class="list-group">
                  ${gpsProducts.length > 0 ? gpsProducts.map(p => `
                    <div class="list-group-item product-item" style="background-image: url('${p.img}');" onclick='showProductPreview(${JSON.stringify(p)})'>
                      <div class="product-overlay">
                        <strong>${p.name}</strong><br>
                        <small>${formatPrice(p.precio)}</small>
                      </div>
                    </div>
                  `).join('') : '<div class="list-group-item">No hay productos GPS.</div>'}
                </div>
              </div>
            </div>
            <!-- Columna: Accesorios -->
            <div class="col-md-4 mb-3">
              <div class="collapse-header" data-bs-toggle="collapse" data-bs-target="#collapseAcc${kit.id}" aria-expanded="false" aria-controls="collapseAcc${kit.id}">
                <i class="fas fa-chevron-down"></i> Accesorios
              </div>
              <div class="collapse" id="collapseAcc${kit.id}">
                <div class="list-group">
                  ${accesoriosProducts.length > 0 ? accesoriosProducts.map(p => `
                    <div class="list-group-item product-item" style="background-image: url('${p.img}');" onclick='showProductPreview(${JSON.stringify(p)})'>
                      <div class="product-overlay">
                        <strong>${p.name}</strong><br>
                        <small>${formatPrice(p.precio)}</small>
                      </div>
                    </div>
                  `).join('') : '<div class="list-group-item">No hay accesorios.</div>'}
                </div>
              </div>
            </div>
            <!-- Columna: Detalles del Plan -->
            <div class="col-md-4 mb-3">
              <div class="collapse-header" data-bs-toggle="collapse" data-bs-target="#collapsePlan${kit.id}" aria-expanded="false" aria-controls="collapsePlan${kit.id}">
                <i class="fas fa-chevron-down"></i> Detalles del Plan
              </div>
              <div class="collapse" id="collapsePlan${kit.id}">
                <ul class="list-group">
                  ${detallesPlanContent}
                </ul>
              </div>
            </div>
          </div>
          <!-- Sección de Suscripción -->
          <div class="subscription-section">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="btn-group d-flex" role="group">
                  <button class="btn btn-outline-dark flex-grow-1 subscription-btn" data-kit-id="${kit.id}" data-value="Demo">
                    <i class="fas fa-play"></i> Demo
                  </button>
                  <button class="btn btn-outline-dark flex-grow-1 subscription-btn" data-kit-id="${kit.id}" data-value="3 Meses">
                    <i class="fas fa-calendar-alt"></i> 3 Meses
                  </button>
                  <button class="btn btn-outline-dark flex-grow-1 subscription-btn" data-kit-id="${kit.id}" data-value="1 Año">
                    <i class="fas fa-calendar-alt"></i> 1 Año
                  </button>
                  <button class="btn btn-outline-dark flex-grow-1 subscription-btn" data-kit-id="${kit.id}" data-value="Indefinido">
                    <i class="fas fa-infinity"></i> Indefinido
                  </button>
                </div>
              </div>
              <div class="col-md-4 text-end">
                <h5 class="kit-total">Total: ${formatPrice(kit.Total || 0)}</h5>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-outline-secondary btn-sm remove-kit-footer" data-kit-id="${kit.id}">
            <i class="fas fa-trash-alt"></i> Eliminar
          </button>
          <span>ID del Kit: ${kit.id}</span>
        </div>
      </div>
    `;
  });

  return html;
}



//-----------------------------------------------------------------------------------------------------------------------------

botones.forEach(boton => {
  boton.addEventListener('click', function () {
      let tipoVehiculo = this.getAttribute("data-vehiculo");
      
      // Actualiza el activo global y reinicia las selecciones y contador para el nuevo activo
      window.currentActivo = tipoVehiculo;
      window.productosSeleccionados = [];
      // Reinicia o crea la entrada para este activo en seleccionesPorActivo
      if (!window.seleccionesPorActivo) {
          window.seleccionesPorActivo = {};
      }
      window.seleccionesPorActivo[tipoVehiculo] = [];
      document.getElementById('contador').textContent = '1';
      contador = 1;
      
      // Actualiza el kit según el tipo de vehículo
      switch (tipoVehiculo) {
          case "Carro":
            mensaje.innerHTML = "¡<i class='fas fa-car'></i> Protege a tu familia y tu inversión!<br>Diseña el sistema de seguridad perfecto para tu carro: ubica, rastrea y controla en <strong>tiempo real</strong> prevenir es mejor que lamentar.";
            actualizarImagenVehiculo(tipoVehiculo);
            const productosCarro = filtrarProductosPorActivo("Carro");
            pintarProductos(productosCarro, [
                { top: '50%', left: '3%' },
                { top: '50%', left: '80%' },
                { top: '3%', left: '80%' },
                { top: '0%', left: '1%' },
            ]);
            nombrePaquete.innerHTML = "<i class='fas fa-plus-circle'></i> AÑADE TU KIT GPS PARA CARRO";
            autoSelectPlan()
            break;

          case "Moto":
            mensaje.innerHTML = "¡<i class='fas fa-motorcycle'></i> Toma el control total de tu moto!<br>Activa un GPS preciso que te permite apagarla remotamente y gestionar cada trayecto.";
            actualizarImagenVehiculo(tipoVehiculo);
            const productosMoto = filtrarProductosPorActivo("Moto");
            pintarProductos(productosMoto, [
                { top: '2%', left: '13%' },
                { top: '49%', left: '6%' },
            ]);
            nombrePaquete.innerHTML = "<i class='fas fa-plus-circle'></i> AÑADE TU KIT GPS PARA MOTO";
            autoSelectPlan()
            break;

          case "Camion":
            mensaje.innerHTML = "¡<i class='fas fa-truck'></i> Optimiza la gestión de tu camión!<br>Ubica y rastrea cada ruta en <strong>tiempo real</strong> para mejorar la logística y la seguridad de tus activos.";
            actualizarImagenVehiculo(tipoVehiculo);
            const productosCamion = filtrarProductosPorActivo("Camion");
            pintarProductos(productosCamion, [
                { top: '50%', left: '2%' },
                { top: '50%', left: '20%' },
                { top: '50%', left: '80%' },
                { top: '50%', left: '50%' },
                { top: '0%', left: '80%' },
                { top: '0%', left: '1%' }
            ]);
            nombrePaquete.innerHTML = "<i class='fas fa-plus-circle'></i> AÑADE TU KIT GPS PARA CAMIÓN";
            autoSelectPlan()
            break;

          case "Personas":
            mensaje.innerHTML = "¡<i class='fas fa-users'></i> Protege a tu equipo!<br>Activa el botón de pánico y gestiona la seguridad de tus colaboradores con rastreo en <strong>tiempo real</strong>.";
            actualizarImagenVehiculo(tipoVehiculo);
            const productosPersonas = filtrarProductosPorActivo("Personas");
            pintarProductos(productosPersonas, [
                { top: '25%', left: '80%' },
            ]);
            nombrePaquete.innerHTML = "<i class='fas fa-plus-circle'></i> AÑADE TU KIT GPS PARA PERSONAS";
            autoSelectPlan()
            break;

          case "Carga":
            mensaje.innerHTML = "¡<i class='fas fa-box'></i> Maximiza la eficiencia de tus envíos!<br>Controla y gestiona cada carga con un rastreo satelital preciso y en <strong>tiempo real</strong>.";
            actualizarImagenVehiculo(tipoVehiculo);
            const productosCarga = filtrarProductosPorActivo("Carga");
            pintarProductos(productosCarga, [
                { top: '1%', left: '80%' },
                { top: '50%', left: '40%' },
                { top: '50%', left: '20%' },
                { top: '50%', left: '0%' },
                { top: '0%', left: '1%' },
                { top: '60%', left: '20%' }
            ]);
            nombrePaquete.innerHTML = "<i class='fas fa-plus-circle'></i> AÑADE TU KIT GPS PARA CARGA";
            autoSelectPlan()
            break;

          case "Flotas":
            mensaje.innerHTML = "¡<i class='fas fa-truck-moving'></i> Gestiona tu flota con precisión!<br>Ubica y controla todos tus vehículos en <strong>tiempo real</strong> para optimizar la seguridad y recuperación.";
            actualizarImagenVehiculo(tipoVehiculo);
            const productosFlotas = filtrarProductosPorActivo("Flotas");
            pintarProductos(productosFlotas, [
                { top: '5%', left: '75%' },
                { top: '50%', left: '5%' },
                { top: '0%', left: '20%' },
                { top: '50%', left: '80%' },
                { top: '1%', left: '5%' },
                { top: '50%', left: '20%' }
            ]);
            nombrePaquete.innerHTML = "<i class='fas fa-plus-circle'></i> AÑADE TU KIT GPS PARA FLOTAS";
            autoSelectPlan()
            break;

          case "Mascotas":
            mensaje.innerHTML = "¡<i class='fas fa-paw'></i> Cuida a tus peludos!<br>Rastrea a tus mascotas en <strong>tiempo real</strong> y asegúrate de que nunca se alejen de tu lado.";
            actualizarImagenVehiculo(tipoVehiculo);
            const productosMascotas = filtrarProductosPorActivo("Mascotas");
            pintarProductos(productosMascotas, [
                { top: '1%', left: '80%' },
            ]);
            nombrePaquete.innerHTML = "<i class='fas fa-plus-circle'></i> AÑADE TU KIT GPS PARA MASCOTAS";
            autoSelectPlan()
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

  // Actualiza el contenido del modal (factura) al hacer clic en el botón Preview
document.getElementById('PREVIEW').addEventListener('click', () => {
const facturaElement = document.getElementById('factura');
// Se asume que generateFacturaHTML es la función que genera el HTML de la factura
facturaElement.innerHTML = generateFacturaHTML(window.listaDeKits);
});
/**
 * Actualiza el resumen de la compra en el panel de detalles.
 * Se actualizan:
 * - El total de la compra.
 * - La cantidad de dispositivos (kits que no son "licencia").
 * - La cantidad de licencias (kits cuyo nombre incluya "licencia").
 * @param {Array} lista - Arreglo de productos (kits) agregados a la factura.
 */
function updateFacturaSummary(lista) {
  let total = 0;
  let dispositivosCount = 0;
  let licenciasCount = 0;
  const grouped = {};

  // Agrupar kits por id para tener la cantidad por cada uno
  lista.forEach(item => {
    if (!grouped[item.id]) {
      grouped[item.id] = { ...item, quantity: 1 };
    } else {
      grouped[item.id].quantity++;
    }
  });

  // Calcular total y separar dispositivos vs licencias
  for (const id in grouped) {
    const kit = grouped[id];
    const subtotal = kit.precio * kit.quantity;
    total += subtotal;
    if (kit.name.toLowerCase().includes("licencia")) {
      licenciasCount += kit.quantity;
    } else {
      dispositivosCount += kit.quantity;
    }
  }

  // Actualizar Total de Compra
  const totalCompraEl = document.getElementById("totalCompra");
  if (totalCompraEl) {
    totalCompraEl.textContent = `$${total.toFixed(2)} COP`;
  }

  // Actualizar cantidad de Dispositivos
  const dispositivosCountEl = document.getElementById("dispositivosCount");
  if (dispositivosCountEl) {
    dispositivosCountEl.textContent = `${dispositivosCount} unidades`;
  }

  // Actualizar cantidad de Licencias
  const licenciasCountEl = document.getElementById("licenciasCount");
  if (licenciasCountEl) {
    licenciasCountEl.textContent = `${licenciasCount} Licencias track`;
  }
}
/**
 * Actualiza el contenido del bloque collapseKit (detalles del kit).
 * Se actualizan los totales de unidades de GPS y Accesorios.
 * @param {Array} lista - Arreglo de productos (kits) agregados a la factura.
 */
function updateCollapseKit(lista) {
  const grouped = {};
  lista.forEach(item => {
    if (!grouped[item.id]) {
      grouped[item.id] = { ...item, quantity: 1 };
    } else {
      grouped[item.id].quantity++;
    }
  });
  
  let gpsCount = 0;
  let accesoriosCount = 0;
  
  Object.values(grouped).forEach(kit => {
    const kitName = kit.name.toLowerCase();
    if (kitName.includes("gps")) {
      gpsCount += kit.quantity;
    }
    if (kitName.includes("accesorio")) {
      accesoriosCount += kit.quantity;
    }
  });
  
  // Actualizar los elementos del collapse
  const gpsSpan = document.getElementById("gpsUnits");
  if (gpsSpan) {
    gpsSpan.textContent = gpsCount + " unidades";
  }
  const accesoriosSpan = document.getElementById("accesoriosUnits");
  if (accesoriosSpan) {
    accesoriosSpan.textContent = accesoriosCount + " unidades";
  }
  
  // (Opcional) Puedes actualizar otros mensajes si lo requieres:
  const supportMessage = document.getElementById("supportMessage");
  if (supportMessage) {
    supportMessage.textContent = "Incluye instalación profesional y soporte técnico.";
  }
}



});