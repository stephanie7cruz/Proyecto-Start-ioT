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
            <a href="#" class="btn btn-black w-100 mr-1" onclick='addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})'>Agregar</a>
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
let cartItemList = []; // Lista para almacenar los productos del carrito
const cartCountElement = document.getElementById("cart-count");

// Función para agregar al carrito
function addToCart(product) {
    if (!product) {
        console.error("El producto no es válido:", product);
        return;
    }
    cartItemCount++; // Incrementa el contador
    cartCountElement.textContent = cartItemCount; // Actualiza el contador en el nav

    // Agrega el producto al carrito
    cartItemList.push(product);

    // Guarda en localStorage
    localStorage.setItem("cartItemCount", cartItemCount.toString());
    localStorage.setItem("cartItemList", JSON.stringify(cartItemList));

    console.log("Producto agregado al carrito:", product);
    console.log("Lista de productos en el carrito:", cartItemList);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedCartCount = localStorage.getItem("cartItemCount");
    if (savedCartCount) {
        cartItemCount = parseInt(savedCartCount, 10); // Recuperar el valor guardado
        cartCountElement.textContent = cartItemCount; // Mostrar el contador en el nav
    }

    const savedCartItemList = localStorage.getItem("cartItemList");
    if (savedCartItemList) {
        cartItemList = JSON.parse(savedCartItemList);
        console.log("Lista recuperada del carrito:", cartItemList);
    }
});

//Abrir y cerrar el popup:
document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.querySelector(".cart-icon");
    const cartPopup = document.getElementById("cart-popup");
    const closePopup = document.getElementById("close-popup");
    const cartItemsContainer = document.getElementById("cart-items-container");

    // Mostrar el popup al hacer clic en el ícono del carrito
    cartIcon.addEventListener("click", () => {
        cartItemsContainer.innerHTML = ""; // Limpiar contenido previo

        if (cartItemList.length > 0) {
            cartItemList.forEach(item => {
                cartItemsContainer.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px;">
                        <p>${item.name} - ${item.precio}</p>
                    </div>
                `;
            });
        } else {
            cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
        }

        cartPopup.classList.remove("hidden");
    });

    // Cerrar el popup
    closePopup.addEventListener("click", () => {
        cartPopup.classList.add("hidden");
    });
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
