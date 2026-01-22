/**
 * @file auth-service.js
 * @purpose Authentication functions - login state, user data, logout
 * @layer core
 * @dependencies [firebase.js, state.js, logger.js]
 * @dependents [app.js, login.js, header-ui.js]
 * @locked false
 * @modifyImpact [authentication flow, user display]
 */

import { auth, db } from './firebase.js';
import { setUser, reset } from './state.js';
import { info, error as logError } from './logger.js';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { createUserProfile, loadUserPreferences, updateLastLogin } from './user-service.js';
import { setTheme } from './theme-manager.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['setupAuthListener', 'login', 'signup', 'logout', 'sendPasswordReset', 'fetchUserData', 'createUserAvatarHTML'],
    requires: ['firebase.js', 'state.js', 'logger.js']
};

// =============================================================================
// AUTH STATE LISTENER
// =============================================================================

/**
 * @function setupAuthListener
 * @purpose Watch Firebase auth state and update app state
 * @param {Function} onAuthChange - Callback with (user) on state change
 * @returns {Function} Unsubscribe function
 */
export function setupAuthListener(onAuthChange) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            info('Auth: User signed in', { uid: firebaseUser.uid });
            const userData = await fetchUserData(firebaseUser.uid);
            const user = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: userData?.displayName || firebaseUser.email?.split('@')[0] || 'User',
                photoURL: userData?.photoURL || null
            };
            setUser(user);

            // FR-001: Update lastLoginAt on each login
            await updateLastLogin(firebaseUser.uid);

            // FR-002: Load user preferences and apply theme
            const prefs = await loadUserPreferences(firebaseUser.uid);
            if (prefs?.theme) {
                setTheme(prefs.theme, true); // Skip sync - just loaded from Firestore
            }

            if (onAuthChange) onAuthChange(user);
        } else {
            info('Auth: No user');
            setUser(null);
            if (onAuthChange) onAuthChange(null);
        }
    });
}

// =============================================================================
// AUTHENTICATION ACTIONS
// =============================================================================

/**
 * @function login
 * @purpose Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User credential
 */
export async function login(email, password) {
    info('Auth: Login attempt', { email });
    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return credential;
    } catch (err) {
        logError('Auth: Login failed', { error: err.message });
        throw err;
    }
}

/**
 * @function signup
 * @purpose Create new account with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - Optional display name
 * @returns {Promise<Object>} User credential
 */
export async function signup(email, password, displayName = null) {
    info('Auth: Signup attempt', { email });
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document in Firestore via user-service
        // FR-001: Complete user profile with role, xp, lastLoginAt, and preferences
        await createUserProfile(credential.user.uid, {
            email,
            displayName: displayName || email.split('@')[0],
            role: 'member',
            xp: 0
        });

        return credential;
    } catch (err) {
        logError('Auth: Signup failed', { error: err.message });
        throw err;
    }
}

/**
 * @function logout
 * @purpose Sign out and redirect to login
 */
export async function logout() {
    info('Auth: Logout');
    try {
        await signOut(auth);
        reset(); // Reset state
        window.location.href = 'login.html';
    } catch (err) {
        logError('Auth: Logout failed', { error: err.message });
        throw err;
    }
}

/**
 * @function sendPasswordReset
 * @purpose Send password reset email to user (FR-002)
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export async function sendPasswordReset(email) {
    info('Auth: Password reset requested', { email });
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (err) {
        logError('Auth: Password reset failed', { error: err.message });
        throw err;
    }
}

// =============================================================================
// USER DATA
// =============================================================================

/**
 * @function fetchUserData
 * @purpose Get user data from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User data or null
 */
export async function fetchUserData(uid) {
    try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        return docSnap.exists() ? docSnap.data() : null;
    } catch (err) {
        logError('Auth: Failed to fetch user data', { uid, error: err.message });
        return null;
    }
}

/**
 * @function createUserAvatarHTML
 * @purpose Generate avatar HTML for user display
 * @param {Object} user - User object with displayName and photoURL
 * @returns {string} HTML string for avatar
 */
export function createUserAvatarHTML(user) {
    if (user?.photoURL) {
        return `<img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar-img">`;
    }

    // Generate initials avatar
    const initials = (user?.displayName || 'U').substring(0, 2).toUpperCase();
    return `<span class="user-avatar-initials">${initials}</span>`;
}
