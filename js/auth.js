function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');

    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    // For pages that only admin should access
    if (window.location.pathname.includes('captur.html') && userRole !== 'admin') {
        window.location.href = 'consul.html';
    }
}

// Run auth check when page loads
checkAuth();