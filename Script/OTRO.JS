document.getElementById('addProductos').addEventListener('click', () => {
  if (window.productosSeleccionados.length === 0) {
    alert('No hay productos seleccionados para este activo.');
    return;
  }
  // Determinar el activo actual usando window.currentActivo (ya se reinició en el switch)
  const activo = window.currentActivo ? window.currentActivo : 'Activo';

  // Obtener la cantidad del contador
  const kitCount = parseInt(document.getElementById('contador').textContent, 10) || 1;

  // Recuperar o inicializar la lista de kits (arreglo) en localStorage
  let listaDeKits = JSON.parse(localStorage.getItem('listaDeKits')) || [];
  
  // Crear un nuevo kit con sus datos, sin modificar kits anteriores
  const newKit = {
    activo: activo,
    productos: window.productosSeleccionados.slice(), // copia de la selección actual
    cantidad: kitCount,
    gps: window.productosSeleccionados.filter(p => p.categoria === 'GPS').length,
    accesorios: window.productosSeleccionados.filter(p => p.categoria === 'ACCESORIO').length,
    plan: { id: window.planSeleccionado, precio: window.precioPlan },
    id: Date.now() // Nuevo id único
  };

  // Agregar el nuevo kit al arreglo
  listaDeKits.push(newKit);
  localStorage.setItem('listaDeKits', JSON.stringify(listaDeKits));

  alert(`${kitCount} producto(s) para ${activo} añadidos.`);

  // Actualizar la factura y resumen (asume que generateFacturaHTML, updateCollapseKit, updateFacturaSummary existen)
  const facturaElement = document.getElementById('factura');
  if (facturaElement) {
    facturaElement.innerHTML = generateFacturaHTML(listaDeKits);
  }
  updateCollapseKit(listaDeKits);
  updateFacturaSummary(listaDeKits);

  // Limpiar la selección actual y reiniciar el contador y variables de selección para el activo
  window.productosSeleccionados = [];
  if (window.seleccionesPorActivo[activo]) {
    window.seleccionesPorActivo[activo] = [];
  }
  document.querySelectorAll('.collapse-card').forEach(card => card.remove());
  pintarProductos(window.productosFiltrados, []); 
  document.getElementById('contador').textContent = '0';
  contador = 0;
});
