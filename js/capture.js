import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    const captureForm = document.querySelector('.capture-form');
    
    captureForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = {
                fullName: captureForm.fullname.value,
                rfc: captureForm.rfc.value.toUpperCase(),
                company: captureForm.company.value,
                terminationDate: captureForm.termination_date.value,
                terminationReason: captureForm.termination_reason.value,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: sessionStorage.getItem('username')
            };

            await db.collection('records').add(formData);
            alert('Registro guardado exitosamente');
            captureForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el registro');
        }
    });

    // Validación de RFC
    const rfcInput = captureForm.querySelector('[name="rfc"]');
    rfcInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });

    rfcInput.addEventListener('blur', (e) => {
        const rfcPattern = /^[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]$/;
        if (!rfcPattern.test(e.target.value)) {
            e.target.setCustomValidity('RFC inválido');
        } else {
            e.target.setCustomValidity('');
        }
    });
});