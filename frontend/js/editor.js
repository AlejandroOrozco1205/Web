const API = "/api";

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'home.html';

  document.getElementById('btnSave').onclick = guardarNota;
  document.getElementById('btnCancel').onclick = () => { localStorage.removeItem('noteId'); window.location.href='notas.html'; };

  const noteId = localStorage.getItem('noteId');
  if (noteId) cargarNota(noteId);
});

async function cargarNota(id) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API}/notas/${id}`, { headers: { 'Authorization': token }});
    if (!res.ok) return alert('No se pudo cargar la nota.');
    const nota = await res.json();
    document.getElementById('tituloNota').value = nota.titulo || '';
    document.getElementById('editor').innerHTML = nota.contenido || '';
  } catch {
    alert('Error al cargar la nota.');
  }
}

async function guardarNota() {
  const token = localStorage.getItem('token');
  const titulo = document.getElementById('tituloNota').value.trim();
  const contenido = document.getElementById('editor').innerHTML.trim();
  if (!titulo || !contenido) return alert('Título y contenido obligatorios.');

  const noteId = localStorage.getItem('noteId');
  const url = noteId ? `${API}/notas/${noteId}` : `${API}/notas`;
  const method = noteId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type':'application/json', 'Authorization': token },
      body: JSON.stringify({ titulo, contenido })
    });
    if (res.ok) {
      localStorage.removeItem('noteId');
      window.location.href = 'notas.html';
    } else {
      const err = await res.json();
      alert(err.msg || 'Error al guardar la nota.');
    }
  } catch {
    alert('Error al guardar la nota.');
  }
}

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('noteId');
  window.location.href = 'home.html';
}
