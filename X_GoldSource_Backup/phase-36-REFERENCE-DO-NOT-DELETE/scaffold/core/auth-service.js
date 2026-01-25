/**
 * @file auth-service.js
 * @purpose Authentication functions - MOCK IMPLEMENTATION
 * @layer core
 * @dependencies [state.js, logger.js]
 * @dependents [app.js, login.js, header-ui.js]
 * @locked false
 * @modifyImpact [authentication flow, user display]
 */

import { setUser, reset } from './state.js';
import { info, error as logError } from './logger.js';
import { setTheme } from './theme-manager.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['setupAuthListener', 'login', 'signup', 'logout', 'sendPasswordReset', 'fetchUserData', 'createUserAvatarHTML'],
    requires: ['state.js', 'logger.js']
};

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_USER = {
    uid: 'mock-user-123',
    email: 'demo@nexus.ai',
    displayName: 'Nexus User',
    photoURL: null
};

// =============================================================================
// AUTH STATE LISTENER
// =============================================================================

/**
 * @function setupAuthListener
 * @purpose Watch Auth state (Mocked)
 * @param {Function} onAuthChange - Callback with (user) on state change
 * @returns {Function} Unsubscribe function
 */
export function setupAuthListener(onAuthChange) {
    info('Auth: Initializing Mock Auth Listener');

    // Simulate async auth check
    setTimeout(() => {
        info('Auth: Mock user automatic login');
        setUser(MOCK_USER);
        if (onAuthChange) onAuthChange(MOCK_USER);
    }, 500);

    return () => { }; // Unsubscribe no-op
}

// =============================================================================
// AUTHENTICATION ACTIONS
// =============================================================================

/**
 * @function login
 * @purpose Sign in mock
 */
export async function login(email, password) {
    info('Auth: Mock login attempt', { email });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    setUser(MOCK_USER);
    return { user: MOCK_USER };
}

/**
 * @function signup
 * @purpose Sign up mock
 */
export async function signup(email, password, displayName = null) {
    info('Auth: Mock signup attempt', { email });
    await new Promise(resolve => setTimeout(resolve, 800));

    setUser(MOCK_USER);
    return { user: MOCK_USER };
}

/**
 * @function logout
 * @purpose Sign out mock
 */
export async function logout() {
    info('Auth: Mock logout');
    reset(); // Reset state
    // Redirect logic usually handled by app, but here we just reset state
    // In a real app we might reload or change window.location
    window.location.reload();
}

/**
 * @function sendPasswordReset
 * @purpose Mock reset
 */
export async function sendPasswordReset(email) {
    info('Auth: Mock password reset', { email });
    await new Promise(resolve => setTimeout(resolve, 500));
}

// =============================================================================
// USER DATA
// =============================================================================

/**
 * @function fetchUserData
 * @purpose Get mock user data
 */
export async function fetchUserData(uid) {
    return {
        displayName: 'Nexus User',
        role: 'admin',
        xp: 1250,
        preferences: { theme: 'dark' }
    };
}

/**
 * @function createUserAvatarHTML
 * @purpose Generate avatar HTML for user display
 */
export function createUserAvatarHTML(user) {
    if (user?.photoURL) {
        return `<img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar-img">`;
    }

    // Generate initials avatar
    const initials = (user?.displayName || 'U').substring(0, 2).toUpperCase();
    return `<span class="user-avatar-initials">${initials}</span>`;
}
