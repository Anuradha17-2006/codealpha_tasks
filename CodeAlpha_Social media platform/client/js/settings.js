// Settings page functionality

document.addEventListener('DOMContentLoaded', async () => {
    const auth = checkAuth();
    
    if (!auth.isAuthenticated) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    // Load settings
    await loadSettings();
    
    // Setup event listeners
    setupEventListeners();
});

async function loadSettings() {
    try {
        const user = checkAuth().user;
        document.getElementById('settingsEmail').textContent = user.email;
        
        // Load preferences from user
        const preferences = user.preferences || {};
        document.getElementById('emailNotifications').checked = preferences.emailNotifications !== false;
        document.getElementById('pushNotifications').checked = preferences.pushNotifications !== false;
        document.getElementById('showOnlineStatus').checked = preferences.showOnlineStatus !== false;
        document.getElementById('messagePreference').value = preferences.privateMessages || 'all';
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });
    
    // Save button
    document.getElementById('saveSettingsBtn')?.addEventListener('click', saveSettings);
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        logout();
    });
    
    // Theme selector
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            localStorage.setItem('theme', e.target.value);
        });
    });
}

function switchTab(e) {
    const tabName = e.target.dataset.tab;
    
    // Hide all sections
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${tabName}-tab`).classList.add('active');
    e.target.classList.add('active');
}

async function saveSettings() {
    try {
        const preferences = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            pushNotifications: document.getElementById('pushNotifications').checked,
            showOnlineStatus: document.getElementById('showOnlineStatus').checked,
            privateMessages: document.getElementById('messagePreference').value
        };
        
        // Save preferences
        localStorage.setItem('preferences', JSON.stringify(preferences));
        
        UIHelper.showToast('Settings saved successfully!', 'success');
    } catch (error) {
        UIHelper.showToast('Failed to save settings', 'error');
    }
}
