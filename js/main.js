/**
 * Main application JavaScript for index.html (Client List View)
 */

let currentView = 'list';
let allClients = [];

/**
 * Initialize the application
 */
function init() {
    // Initialize sample data if needed
    initializeSampleData();
    
    // Load clients
    allClients = getClients();
    
    // Render UI
    renderClients(allClients);
    updateStats();
    
    // Setup search with debounce
    setupSearch();
}

/**
 * Initialize sample data if storage is empty
 */
function initializeSampleData() {
    const clients = getClients();
    if (clients.length === 0) {
        // Call the storage function to initialize sample data
        if (typeof initializeSampleDataIfNeeded === 'function') {
            initializeSampleDataIfNeeded();
        }
    }
}

/**
 * Render clients based on current view
 * @param {Array} filteredClients - Optional filtered client list
 */
function renderClients(filteredClients = allClients) {
    if (currentView === 'list') {
        renderTableView(filteredClients);
    } else {
        renderGridView(filteredClients);
    }
}

/**
 * Render table view
 * @param {Array} clientsToRender - Clients to render
 */
function renderTableView(clientsToRender) {
    const tbody = document.getElementById('clientTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (clientsToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-light);">No clients found</td></tr>';
        return;
    }

    clientsToRender.forEach(client => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = () => navigateToView(client.id);
        
        row.innerHTML = `
            <td>${escapeHtml(client.name)}</td>
            <td>${escapeHtml(client.email)}</td>
            <td>${escapeHtml(client.phone)}</td>
            <td><span class="badge ${getBadgeColor(client.fitnessGoal)}">${escapeHtml(client.fitnessGoal)}</span></td>
            <td>${formatDate(client.membershipStart)}</td>
            <td onclick="event.stopPropagation();">
                <button class="btn-action btn-edit" onclick="navigateToEdit('${client.id}')">Edit</button>
                <button class="btn-action btn-delete" onclick="deleteClientHandler('${client.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Render grid view
 * @param {Array} clientsToRender - Clients to render
 */
function renderGridView(clientsToRender) {
    const gridView = document.getElementById('gridView');
    if (!gridView) return;
    
    gridView.innerHTML = '';

    if (clientsToRender.length === 0) {
        gridView.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-light); grid-column: 1 / -1;">No clients found</div>';
        return;
    }

    clientsToRender.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.style.cursor = 'pointer';
        card.onclick = () => navigateToView(client.id);
        
        card.innerHTML = `
            <div class="card-header">
                <div class="client-info">
                    <div class="client-avatar">${escapeHtml(client.name.charAt(0))}</div>
                    <div class="client-name-age">
                        <h3>${escapeHtml(client.name)}</h3>
                        <span class="age-tag">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Age ${escapeHtml(client.age)}
                        </span>
                    </div>
                </div>
                <div class="card-actions" onclick="event.stopPropagation();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onclick="navigateToEdit('${client.id}')">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onclick="deleteClientHandler('${client.id}')">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </div>
            </div>
            <div class="card-body">
                <div class="card-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>${escapeHtml(client.email)}</span>
                </div>
                <div class="card-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>${escapeHtml(client.phone)}</span>
                </div>
                <div class="card-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                    <span>${escapeHtml(client.fitnessGoal)}</span>
                </div>
                <div class="card-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Started ${formatDate(client.membershipStart)}</span>
                </div>
            </div>
        `;
        gridView.appendChild(card);
    });
}

/**
 * Get badge color based on goal
 * @param {string} goal - Fitness goal
 * @returns {string} - Badge CSS class
 */
function getBadgeColor(goal) {
    const colors = {
        'Weight Loss': 'badge-blue',
        'Muscle Gain': 'badge-green',
        'General Fitness': 'badge-purple',
        'Endurance': 'badge-orange'
    };
    return colors[goal] || 'badge-blue';
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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
 * Switch between grid and list view
 * @param {string} view - View type ('grid' or 'list')
 */
function switchView(view) {
    currentView = view;
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridView = document.getElementById('gridView');
    const tableView = document.getElementById('tableView');

    if (view === 'grid') {
        if (gridViewBtn) gridViewBtn.classList.add('active');
        if (listViewBtn) listViewBtn.classList.remove('active');
        if (gridView) gridView.classList.remove('hidden');
        if (tableView) tableView.classList.add('hidden');
    } else {
        if (listViewBtn) listViewBtn.classList.add('active');
        if (gridViewBtn) gridViewBtn.classList.remove('active');
        if (tableView) tableView.classList.remove('hidden');
        if (gridView) gridView.classList.add('hidden');
    }

    renderClients();
}

/**
 * Setup search with debounce
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchClients(e.target.value);
        }, 300); // 300ms debounce
    });
}

/**
 * Search clients by name (case-insensitive substring)
 * @param {string} searchTerm - Search term
 */
function searchClients(searchTerm = '') {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
        renderClients(allClients);
        return;
    }
    
    const filtered = allClients.filter(client => 
        client.name.toLowerCase().includes(term)
    );
    
    renderClients(filtered);
}

/**
 * Navigate to view client page
 * @param {string} id - Client ID
 */
function navigateToView(id) {
    window.location.href = `view-client.html?id=${id}`;
}

/**
 * Navigate to edit client page
 * @param {string} id - Client ID
 */
function navigateToEdit(id) {
    window.location.href = `add-client.html?id=${id}`;
}

/**
 * Delete client handler with confirmation
 * @param {string} id - Client ID
 */
function deleteClientHandler(id) {
    if (!confirm('Are you sure you want to delete this client?')) {
        return;
    }
    
    const success = deleteClient(id);
    if (success) {
        showToast('Client deleted successfully!', 'success');
        allClients = getClients();
        renderClients(allClients);
        updateStats();
    } else {
        showToast('Error deleting client', 'error');
    }
}

/**
 * Update statistics
 */
function updateStats() {
    const totalClientsEl = document.getElementById('totalClients');
    const newClientsEl = document.getElementById('newClients');
    const weightLossEl = document.getElementById('weightLossCount');
    const muscleGainEl = document.getElementById('muscleGainCount');

    if (totalClientsEl) {
        totalClientsEl.textContent = allClients.length;
    }

    // Calculate new clients this month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const newThisMonth = allClients.filter(client => {
        if (!client.membershipStart) return false;
        const startDate = new Date(client.membershipStart);
        return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
    }).length;
    
    if (newClientsEl) {
        newClientsEl.textContent = newThisMonth;
    }

    // Count goals
    const weightLoss = allClients.filter(c => c.fitnessGoal === 'Weight Loss').length;
    const muscleGain = allClients.filter(c => c.fitnessGoal === 'Muscle Gain').length;
    
    if (weightLossEl) {
        weightLossEl.textContent = weightLoss;
    }
    if (muscleGainEl) {
        muscleGainEl.textContent = muscleGain;
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success' or 'error'
 */
function showToast(message, type = 'success') {
    // Simple toast implementation
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

