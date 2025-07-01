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