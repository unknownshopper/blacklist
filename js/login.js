function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Credenciales predefinidas
    const credentials = {
        'usuario': {
            password: 'usuario123456',
            role: 'user'
        },
        'admin': {
            password: 'admin123456',
            role: 'admin'
        }
    };

    if (credentials[username] && credentials[username].password === password) {
        sessionStorage.setItem('userRole', credentials[username].role);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        window.location.href = 'consul.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

// Verificar autenticación
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage !== 'index.html' && !isLoggedIn) {
        window.location.href = 'index.html';
    } else if (currentPage === 'index.html' && isLoggedIn) {
        window.location.href = 'consul.html';
    }
});