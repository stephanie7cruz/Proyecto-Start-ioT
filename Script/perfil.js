document.addEventListener('DOMContentLoaded', async function() {
    const sidebarLinks = document.querySelectorAll('#sidebarMenu .nav-link');
    const contentArea = document.getElementById('contentArea');
    
    // Se asume que en localStorage está almacenado el token en la clave "usuario"
    const token = localStorage.getItem("usuario");
    if (!token) {
      contentArea.innerHTML = `<div class="alert alert-warning">No se encontró token. Por favor, inicia sesión.</div>`;
      return;
    }
    
    // Función para decodificar el token y obtener el payload
    function decodeToken(token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        return JSON.parse(payloadJson);
      } catch(e) {
        console.error("Error decodificando token:", e);
        return null;
      }
    }
    
    const payload = decodeToken(token);
    if (!payload) {
      contentArea.innerHTML = `<div class="alert alert-danger">Token inválido.</div>`;
      return;
    }
    
    // Se asume que el correo del usuario se encuentra en el campo "sub" del token
    const correo = payload.sub;
    if (!correo) {
      contentArea.innerHTML = `<div class="alert alert-warning">No se encontró el correo en el token.</div>`;
      return;
    }
    
    // Función para obtener la lista de usuarios y filtrar por correo
    async function fetchUserDataByCorreo(correo) {
      const url = "http://localhost:8080/usuarios/traer";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Error al obtener la lista de usuarios");
      }
      const usuarios = await response.json();
      // Filtrar el usuario cuyo correo coincida
      return usuarios.find(user => user.correo === correo);
    }
    
    let usuario;
    try {
      usuario = await fetchUserDataByCorreo(correo);
      if (!usuario) {
        throw new Error("Usuario no encontrado.");
      }
    } catch (error) {
      contentArea.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
      return;
    }
    
    // Función para formatear fechas
    function formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    }
    
    // Función para generar el listado de pedidos
    function generarListadoPedidos(pedidos) {
      let listado = '';
      pedidos.forEach(pedido => {
        listado += `
          <div class="card mb-2">
            <div class="card-body">
              <h5 class="card-title">Pedido #${pedido.id_Pedido || pedido.id || 'N/A'}</h5>
              <p class="card-text"><strong>Estado:</strong> ${pedido.estado || 'Desconocido'}</p>
              <p class="card-text"><strong>Fecha:</strong> ${formatDate(pedido.fechaPedido)}</p>
            </div>
          </div>
        `;
      });
      return listado;
    }
    
    // Configurar evento click para cada enlace del sidebar
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        let contentHTML = '';
        
        switch(section) {
          case 'usuario':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Perfil de Usuario</h2>
                  <p class="card-text"><strong>ID:</strong> ${usuario.id_Usuario}</p>
                  <p class="card-text"><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}</p>
                  <p class="card-text"><strong>Correo:</strong> ${usuario.correo}</p>
                </div>
              </div>`;
            break;
            
          case 'datosGenerales':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Datos Generales</h2>
                  <p class="card-text"><strong>Teléfono:</strong> ${usuario.telefono || 'No registrado'}</p>
                  <p class="card-text"><strong>Dirección:</strong> ${usuario.direccion || 'No registrada'}</p>
                  <p class="card-text"><strong>Fecha de Registro:</strong> ${formatDate(usuario.fechaRegistro)}</p>
                </div>
              </div>`;
            break;
            
          case 'pedidos':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Pedidos</h2>
                  ${(usuario.pedidos && usuario.pedidos.length) ? generarListadoPedidos(usuario.pedidos) : '<p class="card-text">No tienes pedidos recientes.</p>'}
                </div>
              </div>`;
            break;
            
          case 'carrito':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Carrito</h2>
                  <p class="card-text">Estos son los productos que tienes actualmente en tu carrito de compras.</p>
                </div>
              </div>`;
            break;
            
          case 'favoritos':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Favoritos</h2>
                  <p class="card-text">Aquí están tus productos favoritos guardados.</p>
                </div>
              </div>`;
            break;
            
          case 'kits':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Kits</h2>
                  <p class="card-text">Consulta los kits que has adquirido o creado.</p>
                </div>
              </div>`;
            break;
            
          case 'suscripciones':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Suscripciones</h2>
                  <p class="card-text">Administra tus suscripciones activas aquí.</p>
                </div>
              </div>`;
            break;
            
          case 'pagosRastreo':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Pagos Plataforma de Rastreo</h2>
                  <p class="card-text">Realiza pagos relacionados con la plataforma de rastreo.</p>
                </div>
              </div>`;
            break;
            
          case 'pagosCarrito':
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Pago de Carrito</h2>
                  <p class="card-text">Completa el pago de los artículos en tu carrito.</p>
                </div>
              </div>`;
            break;
            
          default:
            contentHTML = `
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h2 class="card-title text-primary">Bienvenido a tu Perfil</h2>
                  <p class="card-text">Selecciona una opción en el menú para ver más detalles.</p>
                </div>
              </div>`;
        }
        
        // Aplicar efecto fade al actualizar el contenido
        contentArea.classList.add('fade');
        contentArea.innerHTML = contentHTML;
        setTimeout(() => contentArea.classList.remove('fade'), 300);
      });
    });
  });
  