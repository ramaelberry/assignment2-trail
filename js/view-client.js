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
 */
function loadExercises() {
    const container = document.getElementById('exercisesList');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Fetching exercises from Wger API...</div>';
    
    // Check cache first
    if (window.cachedExercises && window.cachedExercises.length > 0) {
        console.log('Using cached exercises');
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
 * Display exercises on the page with proper styling
 * @param {Array} exercises - Array of exercise objects from Wger API
 * @param {HTMLElement} container - Container element
 */
function displayExercises(exercises, container) {
    // Clear container
    container.innerHTML = '';
    
    // Validate exercises array
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light);">Could not load exercises. Please add exercises manually.</p>';
        return;
    }
    
    console.log('Displaying exercises:', exercises);
    
    // Create exercise cards with proper styling
    exercises.forEach((exercise, index) => {
        // Extract exercise name from the API response
        let exerciseName = 'Unnamed Exercise';
        
        if (typeof exercise === 'string') {
            exerciseName = exercise;
        } else if (exercise && typeof exercise === 'object') {
            // Wger API returns exercises with 'name' property
            exerciseName = exercise.name || 
                          exercise.name_en || 
                          exercise.title || 
                          `Exercise ${index + 1}`;
        }
        
        // Create exercise card
        const card = document.createElement('div');
        card.style.cssText = `
            padding: 1rem 1.25rem;
            margin-bottom: 0.75rem;
            background: var(--bg-light-blue);
            border-left: 4px solid var(--primary-blue);
            border-radius: 8px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        `;
        
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="
                    background: var(--primary-blue);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                ">
                    ${index + 1}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-dark); font-size: 1rem;">
                        ${escapeHtml(exerciseName)}
                    </div>
                    ${exercise.description ? `
                        <div style="color: var(--text-light); font-size: 0.85rem; margin-top: 0.25rem;">
                            ${escapeHtml(stripHtmlTags(exercise.description)).substring(0, 100)}...
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateX(5px)';
            card.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateX(0)';
            card.style.boxShadow = 'none';
        });
        
        container.appendChild(card);
    });
    
    // Add success message
    const successMsg = document.createElement('p');
    successMsg.style.cssText = `
        margin-top: 1rem;
        padding: 0.75rem;
        background: var(--bg-light-green);
        color: var(--primary-green);
        border-radius: 8px;
        font-size: 0.9rem;
        text-align: center;
    `;
    successMsg.innerHTML = '✓ Exercises loaded successfully from Wger API';
    container.appendChild(successMsg);
}

/**
 * Strip HTML tags from string (for descriptions)
 * @param {string} html - HTML string
 * @returns {string} - Plain text
 */
function stripHtmlTags(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

/**
 * Show fallback exercises when API fails
 * @param {HTMLElement} container - Container element
 */
function showFallbackExercises(container) {
    const fallbackExercises = [
        { name: 'Push-ups', description: 'Upper body bodyweight exercise' },
        { name: 'Squats', description: 'Lower body compound exercise' },
        { name: 'Plank', description: 'Core stability exercise' },
        { name: 'Lunges', description: 'Lower body unilateral exercise' },
        { name: 'Pull-ups', description: 'Upper body pulling exercise' }
    ];
    
    container.innerHTML = '<p style="color: var(--text-light); margin-bottom: 1rem; padding: 0.75rem; background: #FEF9C3; border-radius: 8px;">⚠ Could not load exercises from API. Showing fallback exercises:</p>';
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
