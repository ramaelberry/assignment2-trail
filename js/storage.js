/**
 * localStorage helper functions for FitCRM
 * Uses 'fitcrm_clients' as the storage key
 */

const STORAGE_KEY = 'fitcrm_clients';

/**
 * Get all clients from localStorage
 * @returns {Array} Array of client objects
 */
function getClients() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }
        const clients = JSON.parse(stored);
        return Array.isArray(clients) ? clients : [];
    } catch (e) {
        console.error('Error loading clients from storage:', e);
        return [];
    }
}

/**
 * Save clients array to localStorage
 * @param {Array} clients - Array of client objects
 */
function saveClients(clients) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch (e) {
        console.error('Error saving clients to storage:', e);
        throw new Error('Failed to save clients');
    }
}

/**
 * Get a single client by ID
 * @param {string} id - Client ID
 * @returns {Object|null} Client object or null if not found
 */
function getClientById(id) {
    const clients = getClients();
    return clients.find(c => c.id === id) || null;
}

/**
 * Add a new client to storage
 * @param {Object} clientObj - Client object to add
 * @returns {Object} The added client with generated ID
 */
function addClient(clientObj) {
    const clients = getClients();
    
    // Generate unique ID if not provided
    if (!clientObj.id) {
        clientObj.id = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Initialize training history if not present
    if (!clientObj.trainingHistory) {
        clientObj.trainingHistory = [];
    }
    
    // Initialize next session exercises if not present
    if (!clientObj.nextSessionExercises) {
        clientObj.nextSessionExercises = [];
    }
    
    clients.push(clientObj);
    saveClients(clients);
    return clientObj;
}

/**
 * Update an existing client
 * @param {string} id - Client ID
 * @param {Object} updatedObj - Updated client data
 * @returns {Object|null} Updated client object or null if not found
 */
function updateClient(id, updatedObj) {
    const clients = getClients();
    const index = clients.findIndex(c => c.id === id);
    
    if (index === -1) {
        return null;
    }
    
    // Preserve existing training history and exercises if not provided
    if (!updatedObj.trainingHistory) {
        updatedObj.trainingHistory = clients[index].trainingHistory || [];
    }
    if (!updatedObj.nextSessionExercises) {
        updatedObj.nextSessionExercises = clients[index].nextSessionExercises || [];
    }
    
    clients[index] = { ...clients[index], ...updatedObj };
    saveClients(clients);
    return clients[index];
}

/**
 * Delete a client by ID
 * @param {string} id - Client ID
 * @returns {boolean} True if deleted, false if not found
 */
function deleteClient(id) {
    const clients = getClients();
    const index = clients.findIndex(c => c.id === id);
    
    if (index === -1) {
        return false;
    }
    
    clients.splice(index, 1);
    saveClients(clients);
    return true;
}

/**
 * Initialize with sample data (for first-time setup)
 * This function is called from main.js
 */
function initializeSampleDataIfNeeded() {
    const existingClients = getClients();
    if (existingClients.length > 0) {
        return; // Don't overwrite existing data
    }
    
    const sampleClients = [
        {
            id: 'client-1',
            name: "John Smith",
            email: "john.smith@email.com",
            phone: "+15551234567",
            age: 28,
            gender: "Male",
            fitnessGoal: "Weight Loss",
            membershipStart: "2024-12-15",
            trainingHistory: [
                { date: "2025-10-01", notes: "Leg day - squat focus" },
                { date: "2025-10-08", notes: "Upper body - push" }
            ],
            nextSessionExercises: []
        },
        {
            id: 'client-2',
            name: "Sarah Johnson",
            email: "sarah.j@email.com",
            phone: "+15552345678",
            age: 32,
            gender: "Female",
            fitnessGoal: "Weight Loss",
            membershipStart: "2025-02-01",
            trainingHistory: [],
            nextSessionExercises: []
        },
        {
            id: 'client-3',
            name: "Mike Davis",
            email: "mike.davis@email.com",
            phone: "+15553456789",
            age: 25,
            gender: "Male",
            fitnessGoal: "General Fitness",
            membershipStart: "2025-01-20",
            trainingHistory: [],
            nextSessionExercises: []
        }
    ];
    
    saveClients(sampleClients);
}

