const API_URL = "http://localhost:8082/secretaria/psicologos";

// referencias globales del DOM
const modalEditar = document.getElementById("modalEditar");
const btnCerrarModal = document.getElementById("cerrarModal");
const formEditar = document.getElementById("formEditarPsicologo");

// Cargar psicólogos al abrir la página
document.addEventListener("DOMContentLoaded", obtenerPsicologos);

const form = document.getElementById("formPsicologo");

document.getElementById("btnSalir").addEventListener("click", () => {
  window.location.href = "../dashboard-secretaria/home-secretaria.html";
});

// Registro nuevo psicólogo
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    telefono: document.getElementById("telefono").value,
  };

  try {
    const response = await fetch(`${API_URL}/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("accessToken")
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Registrado",
        text: "Psicólogo registrado correctamente"
      });

      form.reset();
      obtenerPsicologos();
    } else {
      const text = await response.text();
      console.error("Registro falló:", text);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar el psicólogo"
      });
    }
  } catch (error) {
    console.error("Error:", error);

    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "Hubo un problema de conexión"
    });
  }
});

// Manejo del formulario de edición (PUT)
formEditar.addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("editId").value;

  const psicologoActualizado = {
    nombre: document.getElementById("editNombre").value,
    email: document.getElementById("editEmail").value,
    telefono: document.getElementById("editTelefono").value
  };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("accessToken")
      },
      body: JSON.stringify(psicologoActualizado)
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Respuesta del backend:", txt);
      throw new Error(txt || "Error al actualizar el psicólogo");
    }

    Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: "Psicólogo actualizado correctamente"
    });

    cerrarModal();
    obtenerPsicologos();
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message
    });
  }
});

// Cerrar modal al hacer click en "Cancelar"
btnCerrarModal.addEventListener("click", () => cerrarModal());

// Cerrar modal al hacer click fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modalEditar) {
    cerrarModal();
  }
});

// Cerrar modal con tecla Esc
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modalEditar.style.display === "flex" || modalEditar.style.display === "block") {
      cerrarModal();
    }
  }
});

function cerrarModal() {
  modalEditar.style.display = "none";
  formEditar.reset();
  document.getElementById("editId").value = "";
}

// Obtener y pintar psicólogos
async function obtenerPsicologos() {
  try {
    const response = await fetch(`${API_URL}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken")
      }
    });

    if (!response.ok) throw new Error("Error al obtener psicólogos");

    const psicologos = await response.json();
    const tbody = document.querySelector("#tablaPsicologos tbody");
    tbody.innerHTML = "";

    psicologos.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.email}</td>
        <td>${p.telefono}</td>
        <td>
          <button class="btnEditar" data-id="${p.id}">Editar</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Asignar eventos de edición
    document.querySelectorAll(".btnEditar").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.dataset.id;
        const psicologo = psicologos.find(p => p.id == id);

        document.getElementById("editId").value = psicologo.id;
        document.getElementById("editNombre").value = psicologo.nombre;
        document.getElementById("editEmail").value = psicologo.email;
        document.getElementById("editTelefono").value = psicologo.telefono;

        modalEditar.style.display = "flex";
      });
    });

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar los psicólogos"
    });
  }
}
