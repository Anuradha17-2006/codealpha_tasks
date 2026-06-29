// UI Utilities
class UIHelper {
    static showToast(message, type = 'success', duration = 3000) {
        const toast = document.getElementById('toast') || document.createElement('div');
        toast.id = 'toast';
        toast.className = `toast ${type} show`;
        toast.textContent = message;

        if (!document.getElementById('toast')) {
            document.body.appendChild(toast);
        }

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    static showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    static clearError(fieldId) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    static clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(elem => {
            elem.textContent = '';
            elem.style.display = 'none';
        });
    }

    static setButtonLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = isLoading;
            if (isLoading) {
                button.classList.add('loading');
            } else {
                button.classList.remove('loading');
            }
        }
    }
}

// Validation utilities
class Validator {
    static email(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static password(password) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        return password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /[0-9]/.test(password);
    }

    static username(username) {
        // 3-30 chars, alphanumeric, hyphen, underscore
        return username.length >= 3 && 
               username.length <= 30 && 
               /^[a-zA-Z0-9_-]+$/.test(username);
    }

    static name(name) {
        return name.length >= 2 && name.length <= 50;
    }
}

// Login Form Handler
function handleLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', (e) => {
            e.preventDefault();
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePassword.textContent = isPassword ? 'Hide' : 'Show';
        });
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        UIHelper.clearAllErrors();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        if (!email) {
            UIHelper.showError('email', 'Email is required');
            return;
        }

        if (!Validator.email(email)) {
            UIHelper.showError('email', 'Invalid email address');
            return;
        }

        if (!password) {
            UIHelper.showError('password', 'Password is required');
            return;
        }

        try {
            UIHelper.setButtonLoading('loginBtn', true);

            const response = await api.login(email, password);

            if (response.success) {
                // Store user and tokens
                localStorage.setItem('user', JSON.stringify(response.data.user));
                api.setTokens(response.data.accessToken, response.data.refreshToken);

                UIHelper.showToast('Login successful!', 'success');

                // Redirect to home after 1 second
                setTimeout(() => {
                    window.location.href = '/pages/home.html';
                }, 1000);
            }
        } catch (error) {
            UIHelper.showToast(error.message || 'Login failed', 'error');
        } finally {
            UIHelper.setButtonLoading('loginBtn', false);
        }
    });
}

// Register Form Handler
function handleRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', (e) => {
            e.preventDefault();
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePassword.textContent = isPassword ? 'Hide' : 'Show';
        });
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        UIHelper.clearAllErrors();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        let isValid = true;

        if (!firstName || !Validator.name(firstName)) {
            UIHelper.showError('firstName', 'First name must be 2-50 characters');
            isValid = false;
        }

        if (!lastName || !Validator.name(lastName)) {
            UIHelper.showError('lastName', 'Last name must be 2-50 characters');
            isValid = false;
        }

        if (!email || !Validator.email(email)) {
            UIHelper.showError('email', 'Invalid email address');
            isValid = false;
        }

        if (!username || !Validator.username(username)) {
            UIHelper.showError('username', 'Username must be 3-30 characters, alphanumeric only');
            isValid = false;
        }

        if (!Validator.password(password)) {
            UIHelper.showError('password', 'Password must be 8+ characters with uppercase, lowercase, and numbers');
            isValid = false;
        }

        if (password !== confirmPassword) {
            UIHelper.showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        if (!agreeTerms) {
            UIHelper.showError('agreeTerms', 'You must agree to the terms');
            isValid = false;
        }

        if (!isValid) return;

        try {
            UIHelper.setButtonLoading('registerBtn', true);

            const response = await api.register({
                firstName,
                lastName,
                email,
                username,
                password,
                confirmPassword
            });

            if (response.success) {
                // Store tokens
                api.setTokens(response.data.accessToken, response.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                UIHelper.showToast('Registration successful! Please verify your email.', 'success');

                // Redirect to email verification page
                setTimeout(() => {
                    window.location.href = '/pages/verify-email.html';
                }, 2000);
            }
        } catch (error) {
            UIHelper.showToast(error.message || 'Registration failed', 'error');
        } finally {
            UIHelper.setButtonLoading('registerBtn', false);
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem('accessToken');
    const currentPage = window.location.pathname;

    // Redirect logged-in users away from auth pages
    if (accessToken && (currentPage.includes('login') || currentPage.includes('register'))) {
        window.location.href = '/pages/home.html';
    }

    // Initialize forms
    handleLoginForm();
    handleRegisterForm();
});
function checkAuth() {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    return {
        isAuthenticated: !!accessToken,
        user
    };
}
// Logout function
function logout() {
    api.clearTokens();
    localStorage.removeItem('user');
    window.location.href = '/pages/login.html';
}
window.checkAuth = checkAuth;
window.logout = logout;