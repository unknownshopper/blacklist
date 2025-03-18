// Cargar datos guardados al iniciar
let perfiles = JSON.parse(localStorage.getItem('perfiles')) || [];

// Mostrar registros existentes al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarRegistros();
});

// Manejar el formulario de captura
if (document.getElementById('capturaForm')) {
    document.getElementById('capturaForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const anoDespido = document.getElementById('anoDespido').value;
        const motivo = document.getElementById('motivo').value.trim();

        try {
            // Buscar si la persona ya existe
            const querySnapshot = await db.collection('perfiles')
                .where('nombreCompleto', '==', nombreCompleto)
                .get();

            let perfilRef;
            if (querySnapshot.empty) {
                // Crear nuevo perfil
                perfilRef = await db.collection('perfiles').add({
                    nombreCompleto: nombreCompleto,
                    historial: [{
                        empresa: empresa,
                        anoDespido: anoDespido,
                        motivo: motivo
                    }]
                });
            } else {
                // Actualizar perfil existente
                perfilRef = querySnapshot.docs[0].ref;
                await perfilRef.update({
                    historial: firebase.firestore.FieldValue.arrayUnion({
                        empresa: empresa,
                        anoDespido: anoDespido,
                        motivo: motivo
                    })
                });
            }

            document.getElementById('mensaje').innerHTML = 
                '<p style="color: green; font-weight: bold;">¡Captura Exitosa!</p>';
            this.reset();
        } catch (error) {
            console.error("Error: ", error);
            document.getElementById('mensaje').innerHTML = 
                '<p style="color: red; font-weight: bold;">Error al guardar el registro</p>';
        }
    });
}

// Search functionality
if (document.getElementById('searchButton')) {
    document.getElementById('searchButton').addEventListener('click', async function() {
        const nombreInput = document.getElementById('nombre').value.trim();
        const resultadoDiv = document.getElementById('resultado');
        
        if (!nombreInput) {
            resultadoDiv.innerHTML = '<p>Por favor ingrese un nombre para buscar.</p>';
            return;
        }

        try {
            const querySnapshot = await db.collection('perfiles')
                .where('nombreCompleto', '>=', nombreInput)
                .where('nombreCompleto', '<=', nombreInput + '\uf8ff')
                .get();

            if (!querySnapshot.empty) {
                const persona = querySnapshot.docs[0].data();
                resultadoDiv.innerHTML = `
                    <h2>¡Alerta! Persona encontrada</h2>
                    <p><strong>Nombre:</strong> ${persona.nombreCompleto}</p>
                    <h3>Historial:</h3>
                    ${persona.historial.map(h => `
                        <div class="history-entry">
                            <p><strong>Empresa:</strong> ${h.empresa}</p>
                            <p><strong>Año de Despido:</strong> ${h.anoDespido}</p>
                            <p><strong>Motivo:</strong> ${h.motivo}</p>
                        </div>
                    `).join('')}
                `;
            } else {
                resultadoDiv.innerHTML = '<p>Persona no encontrada en la lista negra.</p>';
            }
        } catch (error) {
            console.error("Error: ", error);
            resultadoDiv.innerHTML = '<p>Error al realizar la búsqueda</p>';
        }
    });
}

// Función para mostrar lista completa (solo admin)
async function mostrarListaCompleta() {
    const resultadoDiv = document.getElementById('resultado');
    
    try {
        const querySnapshot = await db.collection('perfiles').get();
        
        if (querySnapshot.empty) {
            resultadoDiv.innerHTML = '<p>No hay registros en la base de datos.</p>';
            return;
        }

        resultadoDiv.innerHTML = `
            <h2>Lista Completa de Registros</h2>
            ${querySnapshot.docs.map(doc => {
                const persona = doc.data();
                return `
                    <div class="person-record">
                        <h3>${persona.nombreCompleto}</h3>
                        <div class="history-entries">
                            ${persona.historial.map(h => `
                                <div class="history-entry">
                                    <p><strong>Empresa:</strong> ${h.empresa}</p>
                                    <p><strong>Año de Despido:</strong> ${h.anoDespido}</p>
                                    <p><strong>Motivo:</strong> ${h.motivo}</p>
                                </div>
                            `).join('')}
                        </div>
                        <hr>
                    </div>
                `;
            }).join('')}
        `;
    } catch (error) {
        console.error("Error: ", error);
        resultadoDiv.innerHTML = '<p>Error al cargar la lista completa</p>';
    }
}

function mostrarRegistros() {
    const registrosDiv = document.getElementById('registrosGuardados');
    if (!registrosDiv) return;

    registrosDiv.innerHTML = '';

    perfiles.forEach(perfil => {
        const perfilDiv = document.createElement('div');
        perfilDiv.innerHTML = `
            <h3>${perfil.nombreCompleto}</h3>
            ${perfil.historial.map(h => `
                <div style="margin-left: 20px; margin-bottom: 10px;">
                    <p><strong>Empresa:</strong> ${h.empresa}</p>
                    <p><strong>Año de Despido:</strong> ${h.anoDespido}</p>
                    <p><strong>Motivo:</strong> ${h.motivo}</p>
                </div>
            `).join('')}
            <hr>
        `;
        registrosDiv.appendChild(perfilDiv);
    });
}

// Add event listener for the view all button
if (document.getElementById('viewAllButton')) {
    document.getElementById('viewAllButton').addEventListener('click', mostrarListaCompleta);
}

// Define users and their permissions
const users = {
    'admin': { password: 'admin123', role: 'admin', permissions: ['search', 'capture', 'viewAll'] },
    'consultor': { password: 'cons123', role: 'consultor', permissions: ['search'] },
    'capturista': { password: 'cap123', role: 'capturista', permissions: ['search', 'capture'] }
};

// Login functionality
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = users[username];
        if (user && user.password === password) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userPermissions', JSON.stringify(user.permissions));
            
            // Redirect based on role
            if (user.role === 'capturista') {
                window.location.href = './captura.html';
            } else {
                window.location.href = './search.html';
            }
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });
}

// Update checkLoginStatus
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!isLoggedIn) {
        window.location.href = './login.html';
        return;
    }

    // Check specific page permissions
    if (currentPage === 'captura.html' && !userPermissions.includes('capture')) {
        window.location.href = './search.html';
    }
}

// Update logout
if (document.getElementById('logoutButton')) {
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userPermissions');
        window.location.href = './index.html';
    });
}