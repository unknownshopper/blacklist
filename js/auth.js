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
        
        // Verificar si es administrador (esto es un ejemplo, deberías tener una forma de verificar el rol del usuario)
        // Por ahora, asumiremos que cualquier usuario autenticado es admin
        sessionStorage.setItem('userRole', 'admin');
        
        // Si estamos en la página de login, redirigir a consul.html
        if (currentPage === 'index.html' || currentPage === '') {
            window.location.href = 'consul.html';
        }
    } else {
        // Usuario no autenticado
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userRole');
        
        // Si no estamos en la página de login, redirigir a index.html
        if (currentPage !== 'index.html' && currentPage !== '') {
            window.location.href = 'index.html';
        }
    }
});

// Función para manejar el cierre de sesión
export function setupLogout() {
    console.log('Configurando el botón de cierre de sesión...');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!logoutBtn) {
        console.error('Error: No se encontró el botón de cierre de sesión');
        return;
    }
    
    console.log('Botón de cierre de sesión encontrado');
    
    // Remover cualquier event listener previo para evitar duplicados
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
    
    newLogoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Iniciando proceso de cierre de sesión...');
        
        try {
            // Cerrar sesión en Firebase
            console.log('Cerrando sesión en Firebase...');
            await signOut(auth);
            
            // Limpiar el sessionStorage
            console.log('Limpiando datos de sesión...');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userRole');
            
            console.log('Redirigiendo a la página de inicio...');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión: ' + (error.message || 'Error desconocido'));
        }
    });
    
    console.log('Event listener de cierre de sesión configurado correctamente');
}

// Función para manejar el inicio de sesión
export async function handleLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Asignar rol de admin (en un caso real, esto vendría de tu base de datos)
        sessionStorage.setItem('userRole', 'admin');
        return { success: true };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

// Inicializar solo lo necesario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Configurar el formulario solo en la página de login
    if (currentPage === 'index.html' || currentPage === '') {
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

            const loginResult = await handleLogin(email, password);
            
            if (loginResult.success) {
                console.log('Sesión iniciada exitosamente');
                window.location.href = 'consul.html';
            } else {
                alert(loginResult.error);
            }
        });
    }
    
    // Configurar el botón de logout si existe
    setupLogout();
});