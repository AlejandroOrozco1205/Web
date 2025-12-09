const API = "https://editortext.onrender.com/api";

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'home.html';
  document.getElementById('logoutBtn').onclick = () => { localStorage.removeItem('token'); window.location.href='home.html'; };
  loadUsers();
});

async function loadUsers() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API}/usuarios`, { headers: { 'Authorization': token }});
    if (!res.ok) return alert('No autorizado o error al cargar usuarios.');
    const users = await res.json();
    const list = document.getElementById('userList');
    list.innerHTML = '';
    users.forEach(u => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `<span>${escapeHtml(u.nombre)} (${escapeHtml(u.correo)})</span>
                      <div><button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${u._id}')"><i class="fas fa-trash"></i> Eliminar</button></div>`;
      list.appendChild(li);
    });
  } catch {
    alert('Error al cargar usuarios.');
  }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Eliminar este usuario y sus notas?')) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API}/usuarios/${id}`, { method: 'DELETE', headers: { 'Authorization': token }});
    if (res.ok) loadUsers(); else alert('No se pudo eliminar usuario.');
  } catch {
    alert('Error al eliminar usuario.');
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replaceAll('&', '&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}
