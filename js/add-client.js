/**
 * Add/Edit Client Page JavaScript
 * Handles both add and edit modes via query parameter
 */

let editingClientId = null;

/**
 * Initialize the add client page
 */
function init() {
    setTodayDate();
    checkEditMode();
    setupFormValidation();
    setupFormSubmission();
}

/**
 * Check if we're in edit mode from URL parameters
 */
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');
    
    if (clientId) {
        editingClientId = clientId;
        loadClientForEdit(clientId);
    }
}

/**
 * Load client data for editing
 * @param {string} id - Client ID
 */
function loadClientForEdit(id) {
    const client = getClientById(id);
    
    if (!client) {
        alert('Client not found');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('formTitle').textContent = 'Edit Client';
    document.getElementById('submitBtn').textContent = 'Update Client';
    document.getElementById('fullName').value = client.name || '';
    document.getElementById('age').value = client.age || '';
    document.getElementById('gender').value = client.gender || '';
    document.getElementById('email').value = client.email || '';
    document.getElementById('phone').value = client.phone || '';
    document.getElementById('fitnessGoal').value = client.fitnessGoal || '';
    document.getElementById('startDate').value = client.membershipStart || '';
}

/**
 * Set today's date as default for start date
 */
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const startDateField = document.getElementById('startDate');
    if (startDateField && !startDateField.value && !editingClientId) {
        startDateField.value = today;
    }
}

/**
 * Setup real-time field validation
 */
function setupFormValidation() {
    const fields = ['fullName', 'age', 'gender', 'email', 'phone', 'fitnessGoal', 'startDate'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Validate on blur
            field.addEventListener('blur', () => validateField(fieldId));
            // Clear error on input
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(fieldId);
                }
            });
        }
    });
}

/**
 * Setup form submission handler
 */
function setupFormSubmission() {
    const form = document.getElementById('clientForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear all previous errors
        clearAllErrors();

        // Client-side validation
        const validation = validateClientForm();
        
        if (!validation.isValid) {
            // Display all errors
            Object.keys(validation.errors).forEach(fieldId => {
                showFieldError(fieldId, validation.errors[fieldId]);
            });
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('fullName').value.trim(),
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            fitnessGoal: document.getElementById('fitnessGoal').value,
            membershipStart: document.getElementById('startDate').value
        };

        // Disable submit button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        try {
            // Save client
            if (editingClientId) {
                const updated = updateClient(editingClientId, formData);
                if (updated) {
                    showToast('Client updated successfully!', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showToast('Error updating client', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Update Client';
                }
            } else {
                const newClient = addClient(formData);
                if (newClient) {
                    showToast('Client added successfully!', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showToast('Error adding client', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Client';
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showToast('An error occurred. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = editingClientId ? 'Update Client' : 'Add Client';
        }
    });
}

/**
 * Clear all error messages
 */
function clearAllErrors() {
    const fields = ['fullName', 'age', 'gender', 'email', 'phone', 'fitnessGoal', 'startDate'];
    fields.forEach(fieldId => {
        clearFieldError(fieldId);
    });
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success' or 'error'
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--primary-green)' : 'var(--danger-red)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
