const API_URL = "http://localhost:3000/api/alumnos";
const form = document.getElementById("alumnoForm");
const tabla = document.querySelector("#tablaAlumnos tbody");
const btnAgregar = document.getElementById("btnAgregar");
const btnCancelar = document.getElementById("btnCancelar");


let editingId = null;

document.addEventListener("DOMContentLoaded", obtenerAlumnos);

// Manejar envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const edad = document.getElementById("edad").value.trim();
  const curso = document.getElementById("curso").value.trim();

  if (!nombre || !edad) {
    alert("Por favor ingresa nombre y edad.");
    return;
  }

  try {
    if (editingId) {
      // Modo actualización
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, edad, curso })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje || "Alumno actualizado correctamente");
        resetForm();
        obtenerAlumnos();
      } else {
        alert("Error al actualizar: " + (data.error || JSON.stringify(data)));
      }
    } else {
      // Modo inserción (POST)
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, edad, curso })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje || "Alumno agregado correctamente");
        form.reset();
        obtenerAlumnos();
      } else {
        alert("Error: " + (data.error || JSON.stringify(data)));
      }
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
});

// Botón cancelar (solo visible en modo edición)
btnCancelar.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm();
});

// Función para obtener lista de alumnos (GET)
async function obtenerAlumnos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.error("Error en respuesta:", res.status, res.statusText);
      tabla.innerHTML = "<tr><td colspan='5'>Error en la respuesta del servidor.</td></tr>";
      return;
    }

    const alumnos = await res.json();
    tabla.innerHTML = "";

    if (!Array.isArray(alumnos) || alumnos.length === 0) {
      tabla.innerHTML = "<tr><td colspan='5'>No hay alumnos registrados.</td></tr>";
      return;
    }

    alumnos.forEach(a => {
      const fila = `
        <tr>
          <td>${a.id ?? ''}</td>
          <td>${a.nombre ?? ''}</td>
          <td>${a.edad ?? ''}</td>
          <td>${a.curso ?? ''}</td>
          <td>
            <button class="btn btn-sm btn-secondary me-2" onclick="startEdit(${a.id}, ${JSON.stringify(a.nombre)}, ${JSON.stringify(a.edad)}, ${JSON.stringify(a.curso)})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteAlumno(${a.id})">Eliminar</button>
          </td>
        </tr>`;
      tabla.insertAdjacentHTML("beforeend", fila);
    });
  } catch (err) {
    console.error(err);
    tabla.innerHTML = "<tr><td colspan='5'>Error al cargar los alumnos.</td></tr>";
  }
}

// Inicia el modo edición: rellena el formulario y cambia botones
function startEdit(id, nombre, edad, curso) {
  editingId = id;
  document.getElementById("nombre").value = nombre ?? '';
  document.getElementById("edad").value = edad ?? '';
  document.getElementById("curso").value = curso ?? '';

  btnAgregar.textContent = "Actualizar";
  btnAgregar.classList.remove("btn-primary");
  btnAgregar.classList.add("btn-success");
  btnCancelar.style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Resetear el formulario a modo insertar
function resetForm() {
  editingId = null;
  form.reset();
  btnAgregar.textContent = "Agregar";
  btnAgregar.classList.remove("btn-success");
  btnAgregar.classList.add("btn-primary");
  btnCancelar.style.display = "none";
}

// Función para eliminar alumno por id
async function deleteAlumno(id) {
  if (!confirm("¿Seguro que quieres eliminar este alumno?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.mensaje || "Alumno eliminado");
      if (editingId && Number(editingId) === Number(id)) resetForm();
      obtenerAlumnos(); // recarga la tabla
    } else {
      alert("Error al eliminar: " + (data.error || JSON.stringify(data)));
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión al eliminar el alumno");
  }
}

window.deleteAlumno = deleteAlumno;
window.startEdit = startEdit;
