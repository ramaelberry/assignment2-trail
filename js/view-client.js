/**
 * View Client Page JavaScript
 */

let currentClient = null;

/**
 * Initialize the view client page
 */
function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');
    
    if (!clientId) {
        showError('No client ID provided');
        return;
    }
    
    loadClient(clientId);
}

/**
 * Load client data
 * @param {string} id - Client ID
 */
function loadClient(id) {
    const client = getClientById(id);
    
    if (!client) {
        showError('Client not found');
        return;
    }
    
    currentClient = client;
    renderClientDetails(client);
    renderTrainingHistory(client.trainingHistory || []);
    loadExercises();
}

/**
 * Render client details
 * @param {Object} client - Client object
 */
function renderClientDetails(client) {
    const container = document.getElementById('clientDetails');
    if (!container) return;
    
    container.innerHTML = `
        <h2 style="margin-bottom: 1.5rem;">${escapeHtml(client.name)}</h2>
        <div class="detail-row">
            <div class="detail-label">Name:</div>
            <div class="detail-value">${escapeHtml(client.name)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Email:</div>
            <div class="detail-value">${escapeHtml(client.email)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Phone:</div>
            <div class="detail-value">${escapeHtml(client.phone)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Fitness Goal:</div>
            <div class="detail-value">${escapeHtml(client.fitnessGoal)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Membership Start Date:</div>
            <div class="detail-value">${formatDate(client.membershipStart)}</div>
        </div>
    `;
}

/**
 * Render training history
 * @param {Array} history - Training history array
 */
function renderTrainingHistory(history) {
    const container = document.getElementById('trainingHistoryList');
    if (!container) return;
    
    if (!history || history.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light);">No training history recorded yet.</p>';
        return;
    }
    
    container.innerHTML = history.map(session => `
        <div class="history-item">
            <div class="history-date">${formatDate(session.date)}</div>
            <div class="history-notes">${escapeHtml(session.notes || 'No notes')}</div>
        </div>
    `).join('');
}

/**
 * Load exercises from API
 * Follows the assignment steps exactly
 */
function loadExercises() {
    const container = document.getElementById('exercisesList');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Fetching exercises from API...</div>';
    
    // Check cache first
    if (window.cachedExercises && window.cachedExercises.length > 0) {
        displayExercises(window.cachedExercises, container);
        return;
    }
    
    // Fetch from API
    fetchExercisesFromAPI()
        .then(fiveExercises => {
            console.log('Fetched exercises:', fiveExercises);
            if (fiveExercises && fiveExercises.length > 0) {
                displayExercises(fiveExercises, container);
                
                // Optional: Save to client object in localStorage
                if (currentClient) {
                    const updatedClient = updateClient(currentClient.id, {
                        nextSessionExercises: fiveExercises
                    });
                    if (updatedClient) {
                        currentClient = updatedClient;
                    }
                }
            } else {
                // API failed - show error message with fallback
                console.warn('API returned no exercises, showing fallback');
                showFallbackExercises(container);
            }
        })
        .catch(err => {
            console.error('Error loading exercises:', err);
            showFallbackExercises(container);
        });
}

/**
 * Display exercises on the page
 * @param {Array} exercises - Array of exercise objects
 * @param {HTMLElement} container - Container element
 */
function displayExercises(exercises, container) {
    // Clear container
    container.innerHTML = '';
    
    // Validate exercises array
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
        container.innerHTML = '<li>Could not load exercises. Please add exercises manually.</li>';
        return;
    }
    
    // Create a list
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
    
    exercises.forEach((ex, index) => {
        // Handle different possible structures from API
        // Wger API structure: exercises have 'name' property, but might be nested
        let exerciseName = 'Unnamed Exercise';
        
        if (typeof ex === 'string') {
            exerciseName = ex;
        } else if (ex && typeof ex === 'object') {
            exerciseName = ex.name || ex.name_en || ex.name_de || ex.title || `Exercise ${index + 1}`;
        }
        
        const li = document.createElement('li');
        li.textContent = exerciseName;
        li.style.padding = '0.75rem';
        li.style.marginBottom = '0.5rem';
        li.style.background = 'var(--bg-light-blue)';
        li.style.borderRadius = '8px';
        li.style.borderLeft = '3px solid var(--primary-blue)';
        li.style.color = 'var(--text-dark)';
        li.style.fontWeight = '500';
        ul.appendChild(li);
    });
    
    container.appendChild(ul);
}

/**
 * Show fallback exercises when API fails
 * @param {HTMLElement} container - Container element
 */
function showFallbackExercises(container) {
    const fallbackExercises = [
        { name: 'Push-ups' },
        { name: 'Squats' },
        { name: 'Plank' },
        { name: 'Lunges' },
        { name: 'Pull-ups' }
    ];
    
    container.innerHTML = '<p style="color: var(--text-light); margin-bottom: 1rem;">Could not load exercises from API. Showing fallback exercises:</p>';
    displayExercises(fallbackExercises, container);
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    const container = document.getElementById('clientDetails');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                ${escapeHtml(message)}
            </div>
        `;
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
