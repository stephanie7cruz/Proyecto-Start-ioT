
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

    // Construir el objeto de datos para enviar al backend
    let datos = {
        correo: correo,
        contrasena: clave
    };

    // Realizar la petición POST al endpoint de login
    fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la autenticación");
        }
        return response.json();
    })
    .then(usuario => {
        // Guardar el usuario autenticado en sesión (por ejemplo, en localStorage)
        localStorage.setItem("usuario", JSON.stringify(usuario));
        showMessage("¡Inicio de sesión exitoso!");
        // Cerrar el modal de inicio de sesión
        var modal = bootstrap.Modal.getInstance(document.getElementById("modalInicioSesion1"));
        modal.hide();
    })
    .catch(error => {
        document.getElementById("errorInicio").textContent = "Correo o contraseña incorrectos.";
        console.error("Error al iniciar sesión:", error);
    });
}


// Verificar si un usuario existe
function usuarioExiste(correo) {
    return localStorage.getItem(correo) !== null;
}

// Función para registrar usuario
async function registrarUsuario() {
    let nombre = document.getElementById("nombreCompleto").value.trim();
    let telefono = document.getElementById("telefonoLogin").value.trim();
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

    showMessage("¡Registro exitoso!");
    console.log("Usuario registrado correctamente");
     // Enviar datos al backend con fetch
     let fechaRegistro = new Date().toISOString(); // Convertir fecha a formato compatible
    let usuario = {
        id_Usuario: null,  // Si la BD genera el ID, puedes enviar null
        nombre,
        apellido: "",  // Si no hay campo para apellido, envía vacío
        contrasena: clave,
        correo,
        telefono,
        direccion:" ",
        fechaRegistro,
        pedidos: [],  // Lista vacía para cumplir con el backend
        activos: []   // Lista vacía para cumplir con el backend
    };

     try {
         let response = await fetch("http://localhost:8080/usuarios/crear", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(usuario)
         });
 
         if (!response.ok) {
             throw new Error("Error al registrar usuario");
         }
 
         let mensaje = await response.text();
         showMessage(mensaje);
         console.log("Usuario registrado correctamente en la BD");
     } catch (error) {
         console.error("Error:", error);
         showMessage("Hubo un problema al registrar el usuario.");
     }
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


       // Validaciones  en tiempo real

       document.addEventListener("DOMContentLoaded", function () {
        setTimeout(() => {
            console.log("⚡ DOM completamente cargado, agregando eventos...");
    
            function agregarEvento(id, evento, callback) {
                let elemento = document.getElementById(id);
                if (elemento) {
                    elemento.addEventListener(evento, callback);
                } else {
                    console.warn(`⚠ El elemento con ID '${id}' no existe en el DOM.`);
                }
            }
    
            agregarEvento("correoRegistro", "blur", function () {
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
    
            agregarEvento("telefonoLogin", "blur", function () {
                let telefono = this.value.trim();
                let errorMensaje = document.getElementById("errorRegistroTelefono");
    
                if (telefono.length !== 10 || !/^\d+$/.test(telefono)) {
                    errorMensaje.textContent = "Ingresa un número de celular válido (10 dígitos).";
                    errorMensaje.style.color = "red";
                } else {
                    errorMensaje.textContent = "";
                }
            });
    
            agregarEvento("claveRegistro2", "input", function () {
                let clave = this.value.trim();
                let errorMensaje = document.getElementById("errorRegistroContra");
    
                let claveRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    
                if (!claveRegex.test(clave)) {
                    errorMensaje.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula y un número.";
                    errorMensaje.style.color = "red";
                } else {
                    errorMensaje.textContent = "";
                }
            });
    
            agregarEvento("nombreCompleto", "input", function () {
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
    
        }, 100); // Espera 100ms para asegurarse de que el DOM está cargado
    });
    
    
    



