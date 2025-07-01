import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

// login.js modificado
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si hay credenciales en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const password = urlParams.get('password');

    // Si hay credenciales en la URL, intentar autenticar
    if (username && password) {
        try {
            // Determinar si el usuario está usando correo electrónico o nombre de usuario
            const email = username.includes('@') ? username : `${username}@blacklist.app`;
            
            // Intentar autenticar con Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Si la autenticación es exitosa, guardar en sessionStorage
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userRole', 'admin');
            
            // Redirigir a la página de consultas
            window.location.href = 'consul.html';
            return;
            
        } catch (error) {
            console.error('Error de autenticación:', error);
            alert('Error al iniciar sesión: ' + (error.message || 'Credenciales incorrectas'));
            // Limpiar la URL para evitar bucles
            window.history.replaceState({}, document.title, "/" + "index.html");
            return;
        }
    }

    // Comportamiento normal de redirección
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage !== 'index.html' && !isLoggedIn) {
        window.location.href = 'index.html';
    } else if (currentPage === 'index.html' && isLoggedIn) {
        window.location.href = 'consul.html';
    }
});

// Función para manejar el inicio de sesión desde el formulario
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Por favor ingresa usuario y contraseña');
        return;
    }
    
    // Redirigir con credenciales en la URL
    window.location.href = `index.html?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
}

// Asegurarse de que la función handleLogin esté disponible globalmente
window.handleLogin = handleLogin;