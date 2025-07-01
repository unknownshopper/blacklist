import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const captureForm = document.querySelector('.capture-form');
    const auth = getAuth();
const user = auth.currentUser;
    
    captureForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = {
                fullName: captureForm.fullname.value,
                rfc: captureForm.rfc.value.toUpperCase(),
                company: captureForm.company.value,
                terminationDate: captureForm.termination_date.value,
                terminationReason: captureForm.termination_reason.value,
                createdAt: serverTimestamp(),
                createdBy: sessionStorage.getItem('userRole'),
                createdByUid: user ? user.uid : null,
                createdByEmail: user ? user.email : null
            };

            await addDoc(collection(db, 'records'), formData);
            alert('Registro guardado exitosamente');
            captureForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el registro: ' + error.message);
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