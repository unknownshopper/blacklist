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
    console.log('Buscando formulario de login...');
    const loginForm = document.querySelector('.login-form');
    
    if (!loginForm) {
        console.error('❌ No se encontró ningún formulario con la clase "login-form"');
        console.log('Elementos del DOM:', document.body.innerHTML);
        return;
    }

    console.log('✔️ Formulario encontrado:', loginForm);
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('Formulario enviado');
        
        // Obtener valores usando el método más confiable
        const emailInput = loginForm.elements['username'];
        const passwordInput = loginForm.elements['password'];
        
        console.log('Elementos del formulario:', {
            username: emailInput,
            password: passwordInput
        });
        
        if (!emailInput || !passwordInput) {
            console.error('❌ No se encontraron los campos de usuario/contraseña');
            return;
        }
        
        const username = emailInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            alert('Por favor ingresa usuario y contraseña');
            return;
        }

        // Convertir el nombre de usuario a un correo electrónico válido
        // Agregando un dominio temporal solo para Firebase
        const email = username.includes('@') ? username : `${username}@blacklist.app`;

        try {
            console.log('Intentando iniciar sesión con:', { email });
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

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    setupLogout();
    setupLoginForm();
});