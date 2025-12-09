const API = "https://editortext.onrender.com/api";

// Registra nuevo usuario (modal register)
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, contrasena })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'editor.html';
    } else {
      alert(data.message || 'Error al registrar.');
    }
  } catch (err) {
    alert('Error al registrar.');
  }
});

// Login (modal)
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const correo = document.getElementById('loginCorreo').value;
  const contrasena = document.getElementById('loginContrasena').value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      // si quieres detectar rol desde token, podríamos decodificar; por ahora se usa correo
      window.location.href = (correo === 'admin@gmail.com') ? 'admin.html' : 'notas.html';
    } else {
      alert(data.message || 'Credenciales incorrectas.');
    }
  } catch (err) {
    alert('Error al iniciar sesión.');
  }
});
