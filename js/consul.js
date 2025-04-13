import { db } from './firebase-config.js';
import { collection, getDocs, query, where, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const recordsList = document.getElementById('recordsList');
    const actionsHeader = document.getElementById('actionsHeader');
    const isAdmin = sessionStorage.getItem('userRole') === 'admin';

    if (isAdmin) {
        actionsHeader.style.display = 'table-cell';
    }

    async function loadRecords(searchTerm = '') {
        try {
            let q;
            if (searchTerm) {
                q = query(collection(db, 'records'), 
                    where('fullName', '>=', searchTerm),
                    where('fullName', '<=', searchTerm + '\uf8ff')
                );
            } else if (isAdmin) {
                q = collection(db, 'records');
            } else {
                recordsList.innerHTML = '<tr><td colspan="5">Ingrese un término de búsqueda</td></tr>';
                return;
            }

            const querySnapshot = await getDocs(q);
            recordsList.innerHTML = '';
            
            if (querySnapshot.empty) {
                recordsList.innerHTML = '<tr><td colspan="5">No se encontraron registros</td></tr>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data.fullName}</td>
                    <td>${data.rfc}</td>
                    <td>${data.company}</td>
                    <td>${new Date(data.terminationDate).toLocaleDateString()}</td>
                    <td>${data.terminationReason}</td>
                    ${isAdmin ? `<td><button onclick="deleteRecord('${doc.id}')" class="delete-btn">Eliminar</button></td>` : ''}
                `;
                recordsList.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading records:', error);
            alert('Error al cargar los registros');
        }
    }

    // Delete record function (only for admin)
    if (isAdmin) {
        window.deleteRecord = async (docId) => {
            if (confirm('¿Está seguro de eliminar este registro?')) {
                try {
                    await deleteDoc(doc(db, 'records', docId));
                    await loadRecords(searchInput.value);
                    alert('Registro eliminado exitosamente');
                } catch (error) {
                    console.error('Error deleting record:', error);
                    alert('Error al eliminar el registro');
                }
            }
        };
    }

    // Search form handler
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await loadRecords(searchInput.value.trim());
    });

    // Load all records for admin on page load
    if (isAdmin) {
        await loadRecords();
    }
});