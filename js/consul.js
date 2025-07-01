import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userRole = sessionStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
        alert('Acceso denegado. Solo los administradores pueden ver los registros.');
        return;
    }

    const recordsList = document.getElementById('recordsList');
    
    try {
        // Ordenar por RFC y fecha de creación
        const q = query(
            collection(db, 'records'),
            orderBy('rfc'),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const recordsByRfc = {};

        // Agrupar registros por RFC
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const rfc = data.rfc;
            
            if (!recordsByRfc[rfc]) {
                recordsByRfc[rfc] = {
                    fullName: data.fullName,
                    records: []
                };
            }
            
            recordsByRfc[rfc].records.push({
                ...data,
                id: doc.id
            });
        });

        // Mostrar resultados agrupados
        for (const [rfc, data] of Object.entries(recordsByRfc)) {
            const row = document.createElement('tr');
            const recordCount = data.records.length;
            
            row.innerHTML = `
                <td>${data.fullName}</td>
                <td>${rfc}</td>
                <td>${recordCount} registro(s)</td>
                <td>
                    <button class="toggle-history" data-rfc="${rfc}">Ver historial</button>
                </td>
            `;
            
            recordsList.appendChild(row);
            
            // Crear fila de detalles oculta
            const detailRow = document.createElement('tr');
            detailRow.className = 'history-detail';
            detailRow.id = `detail-${rfc}`;
            detailRow.style.display = 'none';
            
            let detailContent = `
                <td colspan="4">
                    <div class="history-container">
                        <h4>Historial de ${data.fullName} (${rfc})</h4>
                        <table class="history-table">
                            <thead>
                                <tr>
                                    <th>Empresa</th>
                                    <th>Fecha de despido</th>
                                    <th>Motivo</th>
                                    <th>Fecha de registro</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            // Ordenar registros por fecha (más reciente primero)
            data.records.sort((a, b) => {
                const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : 0;
                const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : 0;
                return dateB - dateA;
            });
            
            data.records.forEach(record => {
                const date = record.createdAt?.toDate();
                const formattedDate = date ? date.toLocaleDateString() : 'N/A';
                const terminationDate = record.terminationDate || 'N/A';
                
                detailContent += `
                    <tr>
                        <td>${record.company}</td>
                        <td>${terminationDate}</td>
                        <td>${record.terminationReason}</td>
                        <td>${formattedDate}</td>
                    </tr>
                `;
            });
            
            detailContent += `
                            </tbody>
                        </table>
                    </div>
                </td>
            `;
            
            detailRow.innerHTML = detailContent;
            recordsList.appendChild(detailRow);
        }

        // Agregar manejadores de eventos para los botones de historial
        document.querySelectorAll('.toggle-history').forEach(button => {
            button.addEventListener('click', (e) => {
                const rfc = e.target.getAttribute('data-rfc');
                const detailRow = document.getElementById(`detail-${rfc}`);
                
                if (detailRow.style.display === 'none') {
                    detailRow.style.display = 'table-row';
                    e.target.textContent = 'Ocultar historial';
                } else {
                    detailRow.style.display = 'none';
                    e.target.textContent = 'Ver historial';
                }
            });
        });

    } catch (error) {
        console.error('Error al obtener los registros:', error);
        alert('Error al obtener los registros: ' + error.message);
    }
});