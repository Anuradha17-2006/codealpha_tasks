// Theme Toggle
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.applyTheme();
        this.setupListener();
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', this.theme);
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    setupListener() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }
}

// Smooth scroll
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Check authentication status
function checkAuth() {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    return {
        isAuthenticated: !!accessToken,
        user: user ? JSON.parse(user) : null,
        token: accessToken
    };
}

// Initialize theme manager on page load
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();

    // Setup smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    // Check auth status
    const auth = checkAuth();
    console.log('Auth Status:', auth);
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Prevent form submission on Enter in non-form contexts
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.target.form) {
        e.preventDefault();
    }
});
