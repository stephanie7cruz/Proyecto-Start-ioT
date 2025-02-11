
// Función para mostrar mensajes emergentes
function showMessage(msg) {
    let alertBox = document.getElementById("custom-alertaMensaje");
    alertBox.textContent = msg;
    alertBox.style.display = "block";
    setTimeout(() => { alertBox.style.display = "none"; }, 3000);
}
//ojito
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
    }
}


// Función de Iniciar Sesión
function iniciarSesion() {
    let correo = document.getElementById("correoInicio").value.trim();
    let clave = document.getElementById("claveInicio").value.trim();
    let usuario = JSON.parse(localStorage.getItem(correo));
    
    if (usuario && atob(usuario.clave) === clave) {
        showMessage("¡Inicio de sesión exitoso!");
        var modal = bootstrap.Modal.getInstance(document.getElementById("modalInicioSesion1"));
        modal.hide();

        
    } else {
        document.getElementById("errorInicio").textContent = "Correo o contraseña incorrectos.";
    }
}

// Verificar si un usuario existe
function usuarioExiste(correo) {
    return localStorage.getItem(correo) !== null;
}

// Función para registrar usuario
function registrarUsuario() {
    let nombre = document.getElementById("nombreCompleto").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let correo = document.getElementById("correoRegistro").value.trim();
    let clave = document.getElementById("claveRegistro2").value.trim();
    
    let errorMensajes = {
        nombre: document.getElementById("errorRegistro"),
        telefono: document.getElementById("errorRegistroTelefono"),
        correo: document.getElementById("errorRegistroCorreo"),
        clave: document.getElementById("errorRegistroContra")
    };

    let nombreRegex = /^[a-zA-Z\s]+$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    for (let error in errorMensajes) errorMensajes[error].textContent = "";

    if (!nombreRegex.test(nombre) || nombre.length < 4) {
        errorMensajes.nombre.textContent = "Nombre inválido.";
        return;
    }
    if (!/^\d{10}$/.test(telefono)) {
        errorMensajes.telefono.textContent = "Teléfono inválido.";
        return;
    }
    if (!emailRegex.test(correo) || usuarioExiste(correo)) {
        errorMensajes.correo.textContent = "Correo inválido o ya registrado.";
        return;
    }
    if (clave.length < 6) {
        errorMensajes.clave.textContent = "Contraseña mínima de 6 caracteres.";
        console.log("Error: Contraseña demasiado corta");
        return;
    }

    localStorage.setItem(correo, JSON.stringify({ nombre, telefono, clave: btoa(clave) }));
    showMessage("¡Registro exitoso!");
    console.log("Usuario registrado correctamente");
}

// Recuperar contraseña
function recuperarClave() {
    let correo = document.getElementById("correoRecuperacion").value.trim();
    let errorCorreo = document.getElementById("errorRecuperar");

    // Limpiar mensaje anterior
    errorCorreo.textContent = "";

    if (usuarioExiste(correo)) {
        showMessage("Correo enviado. !Se ha enviado las instrucciones al correo!");
    } else {
        errorCorreo.textContent = "Correo no registrado.";
    }
}
 // Validar correo en tiempo real
 document.getElementById("correoInicio").addEventListener("blur", function() {
    let correo = this.value.trim();
    let emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    let errorMensaje = document.getElementById("errorInicioCorreo");

    if (!emailRegex.test(correo)) {
        errorMensaje.textContent = "Correo inválido. Debe contener @ y un dominio válido.";
        errorMensaje.style.color = "red";
    } else {
        errorMensaje.textContent = "";
    }
});
 // Validar contraseña en tiempo real
 document.getElementById("claveInicio").addEventListener("input", function() {
    let clave = this.value.trim();
    let errorMensaje = document.getElementById("errorInicioClave");

    let claveRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // Al menos 6 caracteres, 1 mayúscula y 1 número

    if (!claveRegex.test(clave)) {
        errorMensaje.textContent = "Debe tener al menos 6 caracteres,\nuna mayúscula y un número.";
        errorMensaje.style.color = "red";
    } else {
        errorMensaje.textContent = " ";
    }
});


    // Validar teléfono en tiempo real
    document.getElementById("telefono").addEventListener("blur", function() {
        let telefono = this.value.trim();
        let errorMensaje = document.getElementById("errorRegistroTelefono");
    
        if (telefono.length !== 10 || !/^\d+$/.test(telefono)) {
            errorMensaje.textContent = "Ingresa un número de celular válido (10 dígitos).";
            errorMensaje.style.color = "red";
        } else {
            errorMensaje.textContent = "";
        }
    });
    
    // Validar correo en tiempo real
    document.getElementById("correoRegistro").addEventListener("blur", function() {
        let correo = this.value.trim();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        let errorMensaje = document.getElementById("errorRegistroCorreo");
    
        if (!emailRegex.test(correo)) {
            errorMensaje.textContent = "Correo inválido. Debe contener @ y un dominio válido.";
            errorMensaje.style.color = "red";
        } else {
            errorMensaje.textContent = "";
        }
    });

      
    // Validar contraseña en tiempo real
    document.getElementById("claveRegistro2").addEventListener("input", function() {
        let clave = this.value.trim();
        let errorMensaje = document.getElementById("errorRegistroContra");
    
        let claveRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // Al menos 6 caracteres, 1 mayúscula y 1 número
    
        if (!claveRegex.test(clave)) {
            errorMensaje.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula y un número.";
            errorMensaje.style.color = "red";
        } else {
            errorMensaje.textContent = "";
        }
    });
    
   // Validar Nombre en tiempo real
    document.getElementById("nombreCompleto").addEventListener("input", function() {
        let nombre = this.value.trim();
        let errorMensaje = document.getElementById("errorRegistro");
    
        let nombreRegex = /^(?=[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{6,})\b[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,}\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,}\b/;
    
        if (!nombreRegex.test(nombre)) {
            errorMensaje.textContent = "Escribe el nombre completo.";
            errorMensaje.style.color = "red";
        } else {
            errorMensaje.textContent = "";
        }
    });