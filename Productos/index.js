function addItemCard(item, id) {
    const itemHTML = `
        <div class="col-md-3">
            <div class="card w-100 h-100" style="width: 18rem;">
                <i class="fas fa-heart heart-icon" onclick="toggleHeart(this)"></i>
                <img src="${item.img}" class="card-img-top" alt="image">
                <div class="info">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.precio}</p>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text">${item.categoria}</p>
                    <div class="clasificacion" id="clasificacion-${id}"></div> <!-- Contenedor para las estrellas -->
                </div>
                <a href="#" class="btn btn-black w-100 mr-1" onclick="addToCart()">Agregar</a>
            </div>
        </div>
        <br/>`;

    const itemsContainer = document.getElementById("list-items");
    itemsContainer.innerHTML += itemHTML;

    // Llamar a funcion estrella para mostrar las estrellas de cada producto.
    estrella('clasificacion-' + id, item.rating); // Usamos el id dinámico y la calificación del producto
}

function toggleHeart(heartIcon) {
    heartIcon.classList.toggle('active');
}

// Función para agregar estrellas a la card
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
let cartItemCount = 0;
// Función para agregar al carrito
function addToCart() {
    cartItemCount++; // Incrementa el contador
    const cartCountElement = document.getElementById("cart-count");
    cartCountElement.textContent = cartItemCount; // Actualiza el contador en el nav
    localStorage.setItem("cartItemCount", cartItemCount);
}
document.addEventListener("DOMContentLoaded", () => {
    const cartCountElement = document.getElementById("cart-count");
    const savedCartCount = localStorage.getItem("cartItemCount");
    if (savedCartCount) {
        cartItemCount = parseInt(savedCartCount); // Recuperar el valor guardado
        cartCountElement.textContent = cartItemCount; // Mostrar el contador en el nav
    }
});


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
