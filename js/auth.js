import { auth } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';

export async function handleLogout() {
    try {
        await signOut(auth);
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
    }
}

// Add logout button event listener
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});