document.addEventListener('DOMContentLoaded', function() {
    const captureForm = document.querySelector('.capture-form');

    captureForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            fullName: captureForm.fullname.value,
            rfc: captureForm.rfc.value,
            company: captureForm.company.value,
            terminationDate: captureForm.termination_date.value,
            terminationReason: captureForm.termination_reason.value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: sessionStorage.getItem('userRole')
        };

        try {
            await db.collection('records').add(formData);
            alert('Registro guardado exitosamente');
            captureForm.reset();
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error al guardar el registro');
        }
    });

    // RFC format validation
    const rfcInput = captureForm.rfc;
    rfcInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    rfcInput.addEventListener('blur', function() {
        const rfcPattern = /^[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]$/;
        if (!rfcPattern.test(this.value)) {
            this.setCustomValidity('RFC inválido');
        } else {
            this.setCustomValidity('');
        }
    });
});