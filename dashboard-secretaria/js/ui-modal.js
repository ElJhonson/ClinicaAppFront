import { registrarOActualizarCita } from "./api-secretaria.js";

export function inicializarModal() {
  const modal = document.getElementById("modalRegistrarCita");
  const form = document.getElementById("formRegistrarCita");
  const btnCancelar = document.getElementById("cancelarRegistrarCita");
  const btnActualizar = document.getElementById("btnActualizarCita"); // asegúrate que exista este ID en el HTML

  // Cerrar con botón cancelar
  btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar al hacer clic fuera del modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Evento del formulario
  form.addEventListener("submit", registrarOActualizarCita);
}

/**
 * Función que se llama al abrir el modal con una cita existente
 * @param {Object} cita - Datos de la cita seleccionada
 */
export function mostrarModalCita(cita) {
  const modal = document.getElementById("modalRegistrarCita");
  const form = document.getElementById("formRegistrarCita");
  const btnActualizar = document.getElementById("btnActualizarCita");
  const btnCancelar = document.getElementById("cancelarRegistrarCita");
  const btnIrPagos = document.getElementById("btnIrPagos"); // 🔹 nuevo
  const estadoContainer = document.getElementById("estadoContainer");

  modal.style.display = "block";

  // Rellenar campos
  form.elements["idCita"].value = cita.id;
  form.elements["fecha"].value = cita.fecha;
  form.elements["hora"].value = cita.hora;
  form.elements["estado"].value = cita.estado;

  // Mostrar el selector de estado si existe
  estadoContainer.style.display = "block";

  // --- Nueva lógica ---
  if (cita.estado === "ATENDIDA" || cita.estado === "CANCELADA") {
    // Desactivar todos los campos
    Array.from(form.elements).forEach((el) => (el.disabled = true));

    // Ocultar botón de actualizar
    btnActualizar.style.display = "none";

    // Cambiar texto del botón cancelar
    btnCancelar.textContent = "Cerrar";
    btnCancelar.disabled = false;

    // 🔹 Mostrar botón de pagos
    btnIrPagos.style.display = "inline-block";

    // 🔹 Configurar evento de navegación a la pantalla de pagos
    btnIrPagos.onclick = () => {
      const idCita = cita.id;
      window.location.href = `/dashboard-secretaria/pagos.html?idCita=${idCita}`;
    };
  } else {
    // Si la cita no está atendida ni cancelada
    Array.from(form.elements).forEach((el) => (el.disabled = false));
    btnActualizar.style.display = "inline-block";
    btnCancelar.textContent = "Cancelar";

    // 🔹 Ocultar botón de pagos
    btnIrPagos.style.display = "none";
  }
}
