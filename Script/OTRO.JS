function crearProductoElement(producto, coordenada, esGPS, activo) {
  // Contenedor principal de la card
  const productoElement = document.createElement('div');
  productoElement.className = 'producto-card';
  Object.assign(productoElement.style, {
    position: 'absolute',
    top: coordenada.top,
    left: coordenada.left,
    width: '180px',
    minHeight: '220px', // Se permite crecer si se muestra descripción
    backgroundColor: 'white',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
    padding: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  });

  // Contenedor de la imagen y el nombre
  const cardContent = document.createElement('div');
  cardContent.className = 'card-content';
  Object.assign(cardContent.style, {
    flex: '1',
    display: 'flex',
    flexDirection: 'column'
  });

  // Contenedor de la imagen
  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'producto-img-wrapper';
  Object.assign(imgWrapper.style, {
    width: '100%',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f1f1',
    borderRadius: '4px',
    marginBottom: '5px'
  });

  // Imagen
  const img = document.createElement('img');
  img.src = producto.img;
  img.alt = producto.name;
  img.className = 'producto-img';
  Object.assign(img.style, {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  });

  imgWrapper.appendChild(img);

  // Nombre del producto
  const nombre = document.createElement('p');
  nombre.className = 'producto-nombre';
  Object.assign(nombre.style, {
    margin: '5px 0',
    fontSize: '16px',
    textAlign: 'center'
  });
  nombre.textContent = producto.name;

  // Contenedor para acciones (GPS/Accesorio + botón collapse)
  const productoActions = document.createElement('div');
  productoActions.className = 'producto-actions';
  productoActions.style.textAlign = 'center';

  // Botón para cambiar GPS (si aplica)
  if (esGPS) {
    const cambiarBtn = document.createElement('i');
    cambiarBtn.className = 'fas fa-satellite-dish cambiar-gps';
    cambiarBtn.title = 'Cambiar GPS';
    Object.assign(cambiarBtn.style, {
      cursor: 'pointer',
      marginRight: '5px'
    });
    cambiarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      gpsIndex = (gpsIndex + 1) % gpsProductos.length; // Asegúrate de tener gpsIndex y gpsProductos
      almacenado[activo] = window.productosSeleccionados.slice();
      localStorage.setItem('seleccionesPorActivo', JSON.stringify(almacenado));
      mostrarGPS(); // Asegúrate de tener esta función en tu scope
    });
    productoActions.appendChild(cambiarBtn);
  } else {
    const accesorioIcono = document.createElement('i');
    accesorioIcono.className = 'fas fa-plug';
    accesorioIcono.title = 'Accesorio';
    accesorioIcono.style.marginRight = '5px';
    productoActions.appendChild(accesorioIcono);
  }

  // Botón de collapse
  const collapseBtn = document.createElement('i');
  collapseBtn.className = 'fas fa-chevron-down collapse-btn';
  collapseBtn.title = 'Ver Descripción';
  collapseBtn.style.cursor = 'pointer';
  productoActions.appendChild(collapseBtn);

  // Agregar imagen, nombre y acciones al contenedor principal
  cardContent.appendChild(imgWrapper);
  cardContent.appendChild(nombre);
  cardContent.appendChild(productoActions);
  productoElement.appendChild(cardContent);

  // Contenedor de descripción (inicialmente oculto)
  const descCard = document.createElement('div');
  descCard.className = 'collapse-card';
  Object.assign(descCard.style, {
    display: 'none',
    marginTop: '10px',
    padding: '10px',
    borderTop: '1px solid #ccc',
    fontSize: '14px',
    color: '#555'
  });
  descCard.innerHTML = `
    <h5 style="font-size:16px; margin:0 0 5px;">${producto.name}</h5>
    <p style="margin:0 0 5px;">${producto.description}</p>
    <p style="margin:0;"><small>${producto.especificaciones || ''}</small></p>
  `;
  productoElement.appendChild(descCard);

  // Evento collapse: muestra/oculta descripción
  collapseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = descCard.style.display === 'none';
    descCard.style.display = isHidden ? 'block' : 'none';
    collapseBtn.classList.toggle('fa-chevron-down', !isHidden);
    collapseBtn.classList.toggle('fa-chevron-up', isHidden);
  });

  // Efectos de hover
  productoElement.addEventListener('mouseenter', () => {
    productoElement.style.transform = 'scale(1.05)';
    productoElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  });
  productoElement.addEventListener('mouseleave', () => {
    productoElement.style.transform = 'scale(1)';
    productoElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  });

  // Evento para seleccionar/deseleccionar
  productoElement.addEventListener('click', () => {
    if (productoElement.classList.contains('seleccionado')) {
      // Deseleccionar
      productoElement.classList.remove('seleccionado');
      const checkIcon = productoElement.querySelector('.selected-icon');
      if (checkIcon) checkIcon.remove();

      window.productosSeleccionados = window.productosSeleccionados.filter(p => p.id !== producto.id);
      if (window.seleccionesPorActivo[activo]) {
        window.seleccionesPorActivo[activo] = window.seleccionesPorActivo[activo].filter(p => p.id !== producto.id);
      }
    } else {
      // Seleccionar
      productoElement.classList.add('seleccionado');
      let checkIcon = document.createElement('i');
      checkIcon.className = 'fas fa-award selected-icon';
      checkIcon.title = 'Seleccionado';
      // Ajustes de posición y estilo
      Object.assign(checkIcon.style, {
        position: 'absolute',
        top: '10px',
        right: '10px',
        color: '#d4af37',
        fontSize: '35px'
      });
      productoElement.appendChild(checkIcon);

      // Actualizar selección global
      window.productosSeleccionados.push(producto);
      if (!window.seleccionesPorActivo[activo]) {
        window.seleccionesPorActivo[activo] = [];
      }
      window.seleccionesPorActivo[activo].push(producto);
    }
    // Guardar en localStorage
    localStorage.setItem('seleccionesPorActivo', JSON.stringify(window.seleccionesPorActivo));
  });

  return productoElement;
}
