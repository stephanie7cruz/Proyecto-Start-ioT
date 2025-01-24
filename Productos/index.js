

function addItemCard(item, id) { 
    const itemHTML = '<div class="col-md-3" >\n' +  // Añadido <div class="col-md-3">
        '<div class="card w-100" style="width: 18rem;">\n' +
        '      <i class="fas fa-heart heart-icon" onclick="toggleHeart(this)"></i>'+ 
        '    <img src="'+item.img +'" class="card-img-top" alt="image">\n' +
        '  <a href="#" class="btn btn-black w-100 mr-1">Agregar</a>\n' +
        '    <div class="info">' +
        '        <h5 class="card-title ">'+item.name+'</h5>\n' +
        '        <p class="card-text">'+item.precio+'</p>\n' +
        '        <p class="card-text">'+item.description+'</p>\n' +
        '  <div class="clasificacion" id="clasificacion-'+id+'"></div> <!-- Contenedor para las estrellas -->' + 
        '  </div>' +
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



addItemCard({
    'name':'GPS 10S',
    'img':'https://images.pexels.com/photos/3541555/pexels-photo-3541555.jpeg?auto=compress&cs=tinysrgb&w=600',
    'precio':'$ 120.000',
    'description':'Orange and Apple juice ',
    'rating': 4
}, 1);

addItemCard({
    'name':'Tayto',
    'img':'https://images.pexels.com/photos/415043/pexels-photo-415043.jpeg?auto=compress&cs=tinysrgb&w=600',
    'precio':'$ 150.000',
    'description':'Cheese & Onion Chips',
    'rating': 3
}, 2);

addItemCard({
    'name':'GPS 10S',
    'img':'https://images.pexels.com/photos/1643753/pexels-photo-1643753.jpeg?auto=compress&cs=tinysrgb&w=600',
    'precio':'$ 120.000',
    'description':'Orange and Appleand delicious',
    'rating': 5
}, 3);

addItemCard({
    'name':'Tayto',
    'img':'https://www.gs1india.org/media/Juice_pack.jpg',
    'precio':'$ 150.000',
    'description':'Cheese & Onion Chips',
    'rating': 4
}, 4);

