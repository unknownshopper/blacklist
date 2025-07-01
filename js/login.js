import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

// login.js modificado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay credenciales en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const password = urlParams.get('password');

    // Credenciales válidas (solo para desarrollo)
    const validCredentials = {
        username: 'admin',
        password: 'admin123456'
    };

    // Si hay credenciales en la URL, validarlas
    if (username && password) {
        if (username === validCredentials.username && password === validCredentials.password) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userRole', 'admin');
            window.location.href = 'consul.html';
            return;
        } else {
            alert('Credenciales incorrectas');
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
    
    // Redirigir con credenciales en la URL
    window.location.href = `index.html?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
}