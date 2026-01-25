/**
 * @file login.js
 * @purpose Login page logic - handles auth form submission
 * @layer page
 * @dependencies [auth-service.js]
 * @dependents [login.html]
 * @locked false
 * @modifyImpact [login flow only]
 */

import { login, signup, setupAuthListener } from './core/auth-service.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['handleLogin', 'handleSignup', 'toggleMode', 'showError'],
    requires: ['auth-service.js']
};

// =============================================================================
// STATE
// =============================================================================

let isSignupMode = false;

// =============================================================================
// DOM ELEMENTS
// =============================================================================

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const errorDiv = document.getElementById('login-error');
const subtitle = document.getElementById('login-subtitle');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');

// =============================================================================
// INITIALIZATION
// =============================================================================

// Check if already logged in
setupAuthListener((user) => {
    if (user) {
        // Already authenticated, redirect to dashboard
        window.location.href = 'index.html';
    }
});

// Form submission
form.addEventListener('submit', handleSubmit);

// Toggle Mode (Fixed: Inline handler violation removed)
// Toggle Mode (Fixed: Inline handler violation removed)
if (toggleLink) {
    toggleLink.addEventListener('click', toggleMode);
}

// =============================================================================
// HANDLERS
// =============================================================================

/**
 * @function handleSubmit
 * @purpose Handle form submission for login or signup
 * @param {Event} e - Submit event
 */
async function handleSubmit(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Please enter email and password');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = isSignupMode ? 'Creating account...' : 'Signing in...';
    hideError();

    try {
        if (isSignupMode) {
            await signup(email, password);
        } else {
            await login(email, password);
        }
        // Auth listener will handle redirect
    } catch (err) {
        showError(getErrorMessage(err.code));
        submitBtn.disabled = false;
        submitBtn.textContent = isSignupMode ? 'Create Account' : 'Sign In';
    }
}

/**
 * @function toggleMode
 * @purpose Switch between login and signup modes
 */
function toggleMode() {
    isSignupMode = !isSignupMode;

    if (isSignupMode) {
        subtitle.textContent = 'Create your account';
        submitBtn.textContent = 'Create Account';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Sign in';
        passwordInput.autocomplete = 'new-password';
    } else {
        subtitle.textContent = 'Sign in to continue';
        submitBtn.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign up';
        passwordInput.autocomplete = 'current-password';
    }

    hideError();
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * @function showError
 * @purpose Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
}

/**
 * @function hideError
 * @purpose Hide error message
 */
function hideError() {
    errorDiv.classList.remove('visible');
}

/**
 * @function getErrorMessage
 * @purpose Convert Firebase error codes to user-friendly messages
 * @param {string} code - Firebase error code
 * @returns {string} User-friendly error message
 */
function getErrorMessage(code) {
    const messages = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/too-many-requests': 'Too many attempts. Please try again later.'
    };

    return messages[code] || 'An error occurred. Please try again.';
}
