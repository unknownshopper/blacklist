const users = {
    usuario: {
        password: 'usuario123456',
        role: 'user'
    },
    admin: {
        password: 'admin123456',
        role: 'admin'
    }
};

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        // Store user role in sessionStorage
        sessionStorage.setItem('userRole', users[username].role);
        sessionStorage.setItem('isLoggedIn', 'true');
        
        // Redirect based on role
        if (users[username].role === 'admin') {
            window.location.href = 'captur.html';
        } else {
            window.location.href = 'consul.html';
        }
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}