// auth.js
import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

// Verificar estado de autenticación
onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (user) {
        // Usuario autenticado
        sessionStorage.setItem('isLoggedIn', 'true');
        
        // Si estamos en la página de login, redirigir a consul.html
        if (currentPage === 'index.html' || currentPage === '') {
            window.location.href = 'consul.html';
        }
    } else {
        // Usuario no autenticado
        sessionStorage.removeItem('isLoggedIn');
        
        // Si no estamos en la página de login, redirigir a index.html
        if (currentPage !== 'index.html' && currentPage !== '') {
            window.location.href = 'index.html';
        }
    }
});

// Función para manejar el cierre de sesión
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión: ' + error.message);
        }
    });
}

// Función para manejar el inicio de sesión
function setupLoginForm() {
    const loginForm = document.querySelector('.login-form');
    
    if (!loginForm) {
        console.log('No se encontró el formulario de login en esta página');
        return;
    }
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = loginForm.elements['username'];
        const passwordInput = loginForm.elements['password'];
        
        if (!emailInput || !passwordInput) {
            console.error('No se encontraron los campos de usuario/contraseña');
            return;
        }
        
        const username = emailInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            alert('Por favor ingresa usuario y contraseña');
            return;
        }

        const email = username.includes('@') ? username : `${username}@blacklist.app`;

        try {
            console.log('Intentando iniciar sesión con:', { email });
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error de autenticación:', error);
            let errorMessage = 'Error al iniciar sesión';
            
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'El correo electrónico no es válido';
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Usuario o contraseña incorrectos';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Demasiados intentos fallidos. Por favor, inténtalo más tarde.';
            } else {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        }
    });
}

// Inicializar solo lo necesario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Configurar el formulario solo en la página de login
    if (currentPage === 'index.html' || currentPage === '') {
        setupLoginForm();
    }
    
    // Configurar el botón de logout si existe
    setupLogout();
});