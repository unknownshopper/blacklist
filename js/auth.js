// auth.js
import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

// Verificar estado de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario autenticado
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userRole', 'admin'); // Ajusta según tu lógica de roles
    } else {
        // Usuario no autenticado
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userRole');
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Manejar cierre de sesión
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
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

    // Manejar inicio de sesión
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            if (!email || !password) {
                alert('Por favor ingresa correo y contraseña');
                return;
            }

            // Validar formato de correo electrónico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingresa un correo electrónico válido');
                return;
            }

            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Redirigir después de inicio de sesión exitoso
                window.location.href = 'consul.html';
            } catch (error) {
                console.error('Error de autenticación:', error);
                let errorMessage = 'Error al iniciar sesión';
                
                if (error.code === 'auth/invalid-email') {
                    errorMessage = 'El correo electrónico no es válido';
                } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = 'Correo o contraseña incorrectos';
                } else {
                    errorMessage = error.message;
                }
                
                alert(errorMessage);
            }
        });
    }
});