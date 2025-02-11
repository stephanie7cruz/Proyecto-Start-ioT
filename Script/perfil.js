document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('#sidebarMenu .nav-link');
    const contentArea = document.getElementById('contentArea'); // Get the main content area
    //const contentTitle = document.getElementById('contentTitle'); //No estan en el html
    //const contentText = document.getElementById('contentText');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const section = this.getAttribute('data-section'); // Use data-section attribute

            let contentHTML = ''; // Initialize an empty string to store the HTML content

            switch(section) {
                case 'usuario':
                    contentHTML = '<h2>Usuario</h2><p>Aquí puedes gestionar la información de tu perfil de usuario.</p>';
                    break;
                case 'datosGenerales':
                    contentHTML = '<h2>Datos Generales</h2><p>Aquí puedes ver y editar tus datos generales como nombre, dirección y más.</p>';
                    break;
                case 'carrito':
                    contentHTML = '<h2>Carrito</h2><p>Estos son los productos que tienes actualmente en tu carrito de compras.</p>';
                    break;
                case 'favoritos':
                    contentHTML = '<h2>Favoritos</h2><p>Aquí están tus productos favoritos guardados.</p>';
                    break;
                case 'kits':
                    contentHTML = '<h2>Kits</h2><p>Consulta los kits que has adquirido o creado.</p>';
                    break;
                case 'suscripciones':
                    contentHTML = '<h2>Suscripciones</h2><p>Administra tus suscripciones activas aquí.</p>';
                    break;
                case 'pedidos':
                    contentHTML = '<h2>Pedidos</h2><p>Revisa el estado de tus pedidos recientes.</p>';
                    break;
                case 'pagosRastreo':
                    contentHTML = '<h2>Pagos Plataforma de Rastreo</h2><p>Realiza pagos relacionados con la plataforma de rastreo.</p>';
                    break;
                case 'pagosCarrito':
                    contentHTML = '<h2>Pago de Carrito</h2><p>Completa el pago de los artículos en tu carrito.</p>';
                    break;
                default:
                    contentHTML = '<h2>Bienvenido a tu Perfil</h2><p>Selecciona una opción en el menú para ver más detalles.</p>';
            }
            contentArea.innerHTML = contentHTML; // Update the content area
        });
    });

    // Mobile sidebar toggle functionality (if needed - based on your description)
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const overlay = document.querySelector('.overlay');

    if (sidebarToggle && sidebarMenu && overlay) {
        sidebarToggle.addEventListener('click', function() {
            sidebarMenu.classList.toggle('show');
            overlay.classList.toggle('show');
        });

        overlay.addEventListener('click', function() {
            sidebarMenu.classList.remove('show');
            this.classList.remove('show');
        });
    }
});
