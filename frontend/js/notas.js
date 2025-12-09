const API = "https://editortext.onrender.com/api";

let currentPage = 1;          // página actual
let totalPages = 1;           // total de páginas desde backend

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'home.html';
  document.getElementById('logoutBtn').onclick = cerrarSesion;
  document.getElementById('btnFilter').onclick = loadNotas;
  document.getElementById('btnPrev').onclick = prevPage;
  document.getElementById('btnNext').onclick = nextPage;
  loadNotas();
});

async function loadNotas() {
  const token = localStorage.getItem('token');
  const filter = document.getElementById('filterInput').value || '';
  try {
    const res = await fetch(`${API}/notas?page=${currentPage}&q=${encodeURIComponent(filter)}`, {
      headers: { 'Authorization': token }
    });
    const data = await res.json();
    totalPages = data.totalPages;
    const container = document.getElementById('notasContainer');
    container.innerHTML = '';
    const notas = data.notas || [];
    if (notas.length === 0) {
      container.innerHTML = '<div class="col-12"><div class="alert alert-light">No hay notas.</div></div>';
      return;
    }
    notas.forEach(n => {
      const excerpt = stripHtml(n.contenido || '').slice(0, 160);
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6';
      col.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 class="card-title mb-1">${escapeHtml(n.titulo)}</h5>
                <p class="text-muted mb-0 small">${escapeHtml(excerpt)}${(n.contenido && stripHtml(n.contenido).length > 160) ? '...' : ''}</p>
              </div>
              <div class="text-end">
                <button class="btn btn-sm btn-edit mb-1" onclick="editarNota('${n._id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-delete" onclick="eliminarNota('${n._id}')"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  } catch (err) {
    alert('Error al cargar las notas.');
  }
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || tmp.innerText || '';
}
function escapeHtml(text) {
  if (!text) return '';
  return text.replaceAll('&', '&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

function editarNota(id) {
  localStorage.setItem('noteId', id);
  window.location.href = 'editor.html';
}

async function eliminarNota(id) {
  if (!confirm('¿Eliminar esta nota?')) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API}/notas/${id}`, { method: 'DELETE', headers: { 'Authorization': token }});
    if (res.ok) loadNotas(); else alert('Error al eliminar la nota.');
  } catch {
    alert('Error al eliminar la nota.');
  }
}

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('noteId');
  window.location.href = 'home.html';
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        loadNotas();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadNotas();
    }
}
