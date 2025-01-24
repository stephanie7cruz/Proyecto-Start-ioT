

function addItemCard(item, id) { 
    const itemHTML = '<div class="col-md-3" >\n' +  // Añadido <div class="col-md-3">
        '<div class="card w-100 h-100"  style="width: 18rem;">\n' +
        '      <i class="fas fa-heart heart-icon" onclick="toggleHeart(this)"></i>'+ 
        '    <img src="'+item.img +'" class="card-img-top" alt="image">\n' +
        '    <div class="info">' +
        '        <h5 class="card-title ">'+item.name+'</h5>\n' +
        '        <p class="card-text">'+item.precio+'</p>\n' +
        '        <p class="card-text">'+item.description+'</p>\n' +
        '        <p class="card-text">'+item.categoria+'</p>\n' +
        '  <div class="clasificacion" id="clasificacion-'+id+'"></div> <!-- Contenedor para las estrellas -->' + 
        
        '  </div>' +
        '  <a href="#" class="btn btn-black w-100 mr-1">Agregar</a>\n' +
        '</div>\n' +
        '</div>\n' +  // Cerramos la etiqueta <div class="col-md-3">
        '<br/>';

    const itemsContainer = document.getElementById("list-items");
    itemsContainer.innerHTML += itemHTML;

    // Llamar a funcion estrella para mostrar las estrellas de cada producto.
    estrella('clasificacion-' + id, item.rating); // Usamos el id dinámico y la calificación del producto
}

function toggleHeart(heartIcon) {
    heartIcon.classList.toggle('active');
}
//Funcion para agregar estrellas a la card
function estrella(containerId, rating) {
    const contenedorEstrella = document.getElementById(containerId);
    contenedorEstrella.innerHTML = ''; // Limpia cualquier contenido previo
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            contenedorEstrella.innerHTML += '<i class="fas fa-star"></i>'; //icono de Estrella llena
        } else {
            contenedorEstrella.innerHTML += '<i class="far fa-star"></i>'; // Estrella vacía
        }
    }
}


fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        data.item.forEach((product, index) => {
            addItemCard({
                name: product.name,
                img: product.img,
                precio: `$ ${product.precio.toFixed(2)}`, 
                description: product.description,
                categoria: product.categoria,
                rating: 4 // Rating por defecto si no está en el JSON
            }, index + 1);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));
