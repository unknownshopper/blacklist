import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
    const captureForm = document.querySelector('.capture-form');

    captureForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, 'records'), {
                fullName: captureForm.fullname.value,
                rfc: captureForm.rfc.value.toUpperCase(),
                company: captureForm.company.value,
                terminationDate: captureForm.termination_date.value,
                terminationReason: captureForm.termination_reason.value,
                createdAt: serverTimestamp(),
                createdBy: sessionStorage.getItem('userRole')
            });

            alert('Registro guardado exitosamente');
            captureForm.reset();
        } catch (error) {
            console.error('Error al guardar el registro:', error);
            alert('Error al guardar el registro');
        }
    });

    // RFC Validation
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