/**
 * Express Server for Fitness CRM
 * Provides server-side validation and API endpoints
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// In-memory storage (in production, use a database)
let clients = [];

/**
 * Validation helper functions
 */
const validators = {
    /**
     * Validates email format
     */
    isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },

    /**
     * Validates phone number
     */
    isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') return false;
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    },

    /**
     * Validates age
     */
    isValidAge(age) {
        const ageNum = parseInt(age);
        return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
    },

    /**
     * Validates that a field is not empty
     */
    isNotEmpty(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    /**
     * Validates date (must not be in the future)
     */
    isValidDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return date instanceof Date && !isNaN(date) && date <= today;
    }
};

/**
 * Server-side validation for client data
 * @param {Object} data - Client data to validate
 * @param {Array} existingClients - Existing clients (for duplicate checks)
 * @param {number} excludeId - Client ID to exclude from duplicate check (for updates)
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
function validateClientData(data, existingClients = [], excludeId = null) {
    const errors = {};
    let isValid = true;

    // Validate Full Name
    if (!validators.isNotEmpty(data.name)) {
        errors.fullName = 'Full name is required';
        isValid = false;
    } else if (data.name.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
        isValid = false;
    } else if (data.name.trim().length > 100) {
        errors.fullName = 'Full name must be less than 100 characters';
        isValid = false;
    }

    // Validate Age
    if (!validators.isNotEmpty(data.age)) {
        errors.age = 'Age is required';
        isValid = false;
    } else if (!validators.isValidAge(data.age)) {
        errors.age = 'Age must be greater than 0 and less than or equal to 120';
        isValid = false;
    }

    // Validate Gender
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validators.isNotEmpty(data.gender)) {
        errors.gender = 'Gender is required';
        isValid = false;
    } else if (!validGenders.includes(data.gender)) {
        errors.gender = 'Invalid gender selection';
        isValid = false;
    }

    // Validate Email
    if (!validators.isNotEmpty(data.email)) {
        errors.email = 'Email is required';
        isValid = false;
    } else if (!validators.isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    } else {
        // Check for duplicate email
        const duplicate = existingClients.find(c => 
            c.email.toLowerCase() === data.email.toLowerCase().trim() && 
            (!excludeId || c.id !== excludeId)
        );
        if (duplicate) {
            errors.email = 'This email is already registered';
            isValid = false;
        }
    }

    // Validate Phone
    if (!validators.isNotEmpty(data.phone)) {
        errors.phone = 'Phone number is required';
        isValid = false;
    } else if (!validators.isValidPhone(data.phone)) {
        errors.phone = 'Please enter a valid phone number (10-15 digits)';
        isValid = false;
    }

    // Validate Fitness Goal
    const validGoals = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Endurance'];
    if (!validators.isNotEmpty(data.goal)) {
        errors.fitnessGoal = 'Fitness goal is required';
        isValid = false;
    } else if (!validGoals.includes(data.goal)) {
        errors.fitnessGoal = 'Invalid fitness goal selection';
        isValid = false;
    }

    // Validate Start Date
    if (!validators.isNotEmpty(data.startDate)) {
        errors.startDate = 'Start date is required';
        isValid = false;
    } else if (!validators.isValidDate(data.startDate)) {
        errors.startDate = 'Start date cannot be in the future';
        isValid = false;
    }

    return { isValid, errors };
}

/**
 * API Routes
 */

// Validate client data endpoint
app.post('/api/validate-client', (req, res) => {
    try {
        const validation = validateClientData(req.body, clients, req.body.id || null);
        res.json(validation);
    } catch (error) {
        res.status(500).json({ 
            isValid: false, 
            errors: { general: 'Server error during validation' } 
        });
    }
});

// Get all clients
app.get('/api/clients', (req, res) => {
    res.json(clients);
});

// Get single client by ID
app.get('/api/clients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const client = clients.find(c => c.id === id);
    if (!client) {
        return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
});

// Create new client
app.post('/api/clients', (req, res) => {
    const validation = validateClientData(req.body, clients);
    
    if (!validation.isValid) {
        return res.status(400).json(validation);
    }

    const newClient = {
        id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        name: req.body.name.trim(),
        age: parseInt(req.body.age),
        gender: req.body.gender,
        email: req.body.email.trim().toLowerCase(),
        phone: req.body.phone.trim(),
        goal: req.body.goal,
        startDate: req.body.startDate
    };

    clients.push(newClient);
    res.status(201).json(newClient);
});

// Update existing client
app.put('/api/clients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = clients.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Client not found' });
    }

    const validation = validateClientData(req.body, clients, id);
    
    if (!validation.isValid) {
        return res.status(400).json(validation);
    }

    clients[index] = {
        ...clients[index],
        name: req.body.name.trim(),
        age: parseInt(req.body.age),
        gender: req.body.gender,
        email: req.body.email.trim().toLowerCase(),
        phone: req.body.phone.trim(),
        goal: req.body.goal,
        startDate: req.body.startDate
    };

    res.json(clients[index]);
});

// Delete client
app.delete('/api/clients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = clients.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Client not found' });
    }

    clients.splice(index, 1);
    res.status(204).send();
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Fitness CRM Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;

