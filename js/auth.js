import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(window.auth, username, password);
                const user = userCredential.user;
                sessionStorage.setItem('userRole', username === 'admin' ? 'admin' : 'user');
                sessionStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'consul.html';
            } catch (error) {
                console.error('Error:', error);
                alert('Error en el inicio de sesión');
            }
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await window.auth.signOut();
                sessionStorage.removeItem('userRole');
                sessionStorage.removeItem('isLoggedIn');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error:', error);
                alert('Error al cerrar sesión');
            }
        });
    }
});