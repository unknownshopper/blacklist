import { db } from './firebase-config.js';
import { collection, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    const recordsList = document.getElementById('recordsList');
    
    async function loadRecords() {
        try {
            const querySnapshot = await getDocs(collection(db, 'records'));
            recordsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data.fullName}</td>
                    <td>${data.rfc}</td>
                    <td>${data.company}</td>
                    <td>${new Date(data.terminationDate).toLocaleDateString()}</td>
                    <td>${data.terminationReason}</td>
                    <td>
                        <button onclick="deleteRecord('${doc.id}')" class="delete-btn">Eliminar</button>
                    </td>
                `;
                recordsList.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading records:', error);
            alert('Error al cargar los registros');
        }
    }

    // Delete record function
    window.deleteRecord = async (docId) => {
        if (confirm('¿Está seguro de eliminar este registro?')) {
            try {
                await deleteDoc(doc(db, 'records', docId));
                await loadRecords(); // Reload the list
                alert('Registro eliminado exitosamente');
            } catch (error) {
                console.error('Error deleting record:', error);
                alert('Error al eliminar el registro');
            }
        }
    };

    // Load records when page loads
    await loadRecords();
});