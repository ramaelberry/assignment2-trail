/**
 * Client-side validation functions
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone number format (exact spec: /^\+?\d{7,15}$/)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    // Exact regex from spec: allows optional +, then 7-15 digits
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(phone.trim());
}

/**
 * Validates age (must be greater than 0 and reasonable)
 * @param {number} age - Age to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidAge(age) {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
}

/**
 * Validates that a field is not empty
 * @param {string} value - Value to check
 * @returns {boolean} - True if not empty, false otherwise
 */
function isNotEmpty(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
}

/**
 * Validates date (must not be in the future)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    return date instanceof Date && !isNaN(date) && date <= today;
}

/**
 * Shows error message for a form field
 * @param {string} fieldId - ID of the field
 * @param {string} message - Error message to display
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clears error message for a form field
 * @param {string} fieldId - ID of the field
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Validates the entire client form
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
function validateClientForm() {
    const errors = {};
    let isValid = true;

    // Get form values
    const fullName = document.getElementById('fullName')?.value.trim() || '';
    const age = document.getElementById('age')?.value || '';
    const gender = document.getElementById('gender')?.value || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const fitnessGoal = document.getElementById('fitnessGoal')?.value || '';
    const startDate = document.getElementById('startDate')?.value || '';

    // Validate Full Name
    if (!isNotEmpty(fullName)) {
        errors.fullName = 'Full name is required';
        isValid = false;
    } else if (fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
        isValid = false;
    } else if (fullName.length > 100) {
        errors.fullName = 'Full name must be less than 100 characters';
        isValid = false;
    }

    // Validate Age
    if (!isNotEmpty(age)) {
        errors.age = 'Age is required';
        isValid = false;
    } else if (!isValidAge(age)) {
        errors.age = 'Age must be greater than 0 and less than or equal to 120';
        isValid = false;
    }

    // Validate Gender
    if (!isNotEmpty(gender)) {
        errors.gender = 'Gender is required';
        isValid = false;
    }

    // Validate Email
    if (!isNotEmpty(email)) {
        errors.email = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Validate Phone (exact spec: /^\+?\d{7,15}$/)
    if (!isNotEmpty(phone)) {
        errors.phone = 'Phone number is required';
        isValid = false;
    } else if (!isValidPhone(phone)) {
        errors.phone = 'Please enter a valid phone number (7-15 digits, optional + prefix)';
        isValid = false;
    }

    // Validate Fitness Goal
    if (!isNotEmpty(fitnessGoal)) {
        errors.fitnessGoal = 'Fitness goal is required';
        isValid = false;
    }

    // Validate Start Date
    if (!isNotEmpty(startDate)) {
        errors.startDate = 'Start date is required';
        isValid = false;
    } else if (!isValidDate(startDate)) {
        errors.startDate = 'Start date cannot be in the future';
        isValid = false;
    }

    return { isValid, errors };
}

/**
 * Validates a single field in real-time
 * @param {string} fieldId - ID of the field to validate
 */
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const value = field.value.trim();
    let error = '';

    switch (fieldId) {
        case 'fullName':
            if (!isNotEmpty(value)) {
                error = 'Full name is required';
            } else if (value.length < 2) {
                error = 'Full name must be at least 2 characters';
            } else if (value.length > 100) {
                error = 'Full name must be less than 100 characters';
            }
            break;

        case 'age':
            if (!isNotEmpty(value)) {
                error = 'Age is required';
            } else if (!isValidAge(value)) {
                error = 'Age must be greater than 0 and less than or equal to 120';
            }
            break;

        case 'gender':
            if (!isNotEmpty(value)) {
                error = 'Gender is required';
            }
            break;

        case 'email':
            if (!isNotEmpty(value)) {
                error = 'Email is required';
            } else if (!isValidEmail(value)) {
                error = 'Please enter a valid email address';
            }
            break;

        case 'phone':
            if (!isNotEmpty(value)) {
                error = 'Phone number is required';
            } else if (!isValidPhone(value)) {
                error = 'Please enter a valid phone number (7-15 digits, optional + prefix)';
            }
            break;

        case 'fitnessGoal':
            if (!isNotEmpty(value)) {
                error = 'Fitness goal is required';
            }
            break;

        case 'startDate':
            if (!isNotEmpty(value)) {
                error = 'Start date is required';
            } else if (!isValidDate(value)) {
                error = 'Start date cannot be in the future';
            }
            break;
    }

    if (error) {
        showFieldError(fieldId, error);
    } else {
        clearFieldError(fieldId);
    }
}

