function toggleDescription() {
    var checkBox = document.getElementById('agregarDescripcion');
    var descriptionBox = document.getElementById('descriptionBox');

    if (checkBox.checked) {
        descriptionBox.style.display = 'block';  // Muestra el cuadro de texto
    } else {
        descriptionBox.style.display = 'none';   // Oculta el cuadro de texto
    }
}
