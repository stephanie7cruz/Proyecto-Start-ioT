function toggleDescription() {
    var checkBox = document.getElementById('agregarDescripcion');
    var descriptionBox = document.getElementById('descriptionBox');

    if (checkBox.checked) {
        descriptionBox.style.display = 'block';  // Muestra el cuadro de texto
    } else {
        descriptionBox.style.display = 'none';   // Oculta el cuadro de texto
    }
}

//Implementa una función de JavaScript que valide los tipos de entrada y la corrección cuando se presiona el botón Enviar (submit) 

document.getElementById("miFormulario").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario si hay errores
  
    let validar = true;
  
    // Validar nombre
    const name = document.getElementById("name").value.trim();
    const errorName = document.getElementById("error-name");
    if (!name || name.length < 4) {
      errorName.textContent = "El nombre debe tener al menos 4 caracteres.";
      validar = false;
    } else {
      errorName.textContent = "";
    }
  
    // Validar correo electrónico
    const email = document.getElementById("email").value.trim();
    const errorEmail = document.getElementById("error-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errorEmail.textContent = "Ingresa un correo electrónico válido.";
      validar = false;
    } else {
      errorEmail.textContent = "";
    }
  
    // Validar número de teléfono
    const telefono = document.getElementById("telefono").value.trim();
    const errorTelefono = document.getElementById("error-telefono");
    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefono || !telefonoRegex.test(telefono)) {
      errorTelefono.textContent = "El número de teléfono debe tener 10 dígitos.";
      validar = false;
    } else {
      errorTelefono.textContent = "";
    }
  
    // Validar selección de tipo cliente
    const options = document.getElementById("options").value;
    const errorOptions = document.getElementById("error-options");
    if (!options) {
      errorOptions.textContent = "Selecciona una opción válida.";
      validar = false;
    } else {
      errorOptions.textContent = "";
    }
  
    // Validar checkboxes
    const checkboxes = document.querySelectorAll('input[name="interes"]');
    const errorInteres = document.getElementById("error-interes");
    const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
  
    if (!isChecked) {
      errorInteres.textContent = "Selecciona una funcionalidad de interés.";
      validar = false;
    } else {
      errorInteres.textContent = "";
    }
  
    // Si todos los campos son válidos, envía el formulario
    if (validar) {
      this.submit(); // Envía el formulario...
    }
  });
  