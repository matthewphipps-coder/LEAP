/**
 * @file login.js
 * @purpose Login page logic - handles auth form submission
 * @layer page
 * @dependencies [auth-service.js, constants.js]
 * @dependents [login.html]
 * @locked false
 * @modifyImpact [login flow only]
 */

import { login, signup, setupAuthListener, sendPasswordReset } from './core/auth-service.js';
import { ALLOWED_EMAIL_DOMAINS } from './core/constants.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['handleLogin', 'handleSignup', 'toggleMode', 'showMessage', 'handleForgotPassword'],
    requires: ['auth-service.js', 'constants.js']
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
const messageDiv = document.getElementById('login-message');
const subtitle = document.getElementById('login-subtitle');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');
const forgotBtn = document.getElementById('forgot-btn');
const domainNotice = document.getElementById('domain-notice');

// =============================================================================
// THEME INITIALIZATION (PRE-005)
// =============================================================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('light-theme', savedTheme === 'light');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('light-theme', !prefersDark);
    }
}
initTheme();

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

// Toggle mode via addEventListener (PRE-003)
toggleLink.addEventListener('click', toggleMode);

// Forgot password
forgotBtn.addEventListener('click', handleForgotPassword);

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
        showMessage('Please enter email and password', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    // FR-005: Domain validation for signup
    if (isSignupMode && !validateEmailDomain(email)) {
        showMessage('Please use an authorized email domain.', 'error');
        return;
    }

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = isSignupMode ? 'Creating account...' : 'Signing in...';
    hideMessage();

    try {
        if (isSignupMode) {
            await signup(email, password);
        } else {
            await login(email, password);
        }
        // Auth listener will handle redirect
    } catch (err) {
        showMessage(getErrorMessage(err.code), 'error');
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
        domainNotice.classList.add('visible');
    } else {
        subtitle.textContent = 'Sign in to continue';
        submitBtn.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign up';
        passwordInput.autocomplete = 'current-password';
        domainNotice.classList.remove('visible');
    }

    hideMessage();
}

// =============================================================================
// FORGOT PASSWORD (FR-002)
// =============================================================================

/**
 * @function handleForgotPassword
 * @purpose Send password reset email
 */
async function handleForgotPassword() {
    const email = emailInput.value.trim();

    if (!email) {
        showMessage('Please enter your email address first.', 'error');
        return;
    }

    forgotBtn.disabled = true;
    forgotBtn.textContent = 'Sending...';
    hideMessage();

    try {
        await sendPasswordReset(email);
        // FR-003: Success message
        showMessage(`✅ Password reset email sent to ${email}!`, 'success');
    } catch (err) {
        showMessage(getErrorMessage(err.code), 'error');
    }

    forgotBtn.disabled = false;
    forgotBtn.textContent = 'Forgot Password?';
}

// =============================================================================
// DOMAIN VALIDATION (FR-005)
// =============================================================================

/**
 * @function validateEmailDomain
 * @purpose Check if email domain is in allowed list
 * @param {string} email - Email to validate
 * @returns {boolean} True if domain is allowed
 */
function validateEmailDomain(email) {
    if (ALLOWED_EMAIL_DOMAINS.length === 0) return true;
    return ALLOWED_EMAIL_DOMAINS.some(domain =>
        email.toLowerCase().endsWith(domain)
    );
}

// =============================================================================
// MESSAGE HANDLING (FR-003/004)
// =============================================================================

/**
 * @function showMessage
 * @purpose Display message (error or success)
 * @param {string} text - Message text
 * @param {string} type - 'error' or 'success'
 */
function showMessage(text, type = 'error') {
    messageDiv.textContent = text;
    messageDiv.className = `login-message visible ${type}`;
}

/**
 * @function hideMessage
 * @purpose Hide message display
 */
function hideMessage() {
    messageDiv.className = 'login-message';
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
        'auth/invalid-credential': 'Invalid email or password',
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/missing-email': 'Please enter an email address'
    };

    return messages[code] || 'An error occurred. Please try again.';
}
