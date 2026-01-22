/**
 * @file user-service.js
 * @purpose User profile and preferences CRUD - ring-fenced data pattern
 * @layer core
 * @dependencies [firebase.js, logger.js]
 * @dependents [auth-service.js, theme-manager.js]
 * @locked false
 * @modifyImpact [user data, preferences persistence]
 * 
 * DATA CONVENTION: Ring-Fenced User Data
 * =======================================
 * All user data lives under /users/{uid}/
 * - /users/{uid}           → User profile + preferences
 * - /users/{uid}/cards/    → User's cards (future)
 * - /users/{uid}/conversations/ → AI chat history (future)
 * 
 * This service is the TEMPLATE for all future data services.
 * See docs/DATA_CONVENTIONS.md for full documentation.
 */

import { db, auth } from './firebase.js';
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { info, error as logError } from './logger.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['createUserProfile', 'loadUserPreferences', 'savePreference', 'updateLastLogin'],
    requires: ['firebase.js', 'logger.js']
};

// =============================================================================
// DEFAULT PREFERENCES
// =============================================================================

const DEFAULT_PREFERENCES = {
    theme: 'dark',
    sidebarCollapsed: false
};

// =============================================================================
// USER PROFILE OPERATIONS
// =============================================================================

/**
 * @function createUserProfile
 * @purpose Create user document on signup (FR-001)
 * @param {string} uid - Firebase user ID
 * @param {Object} data - User data (email, displayName, etc.)
 * @returns {Promise<void>}
 */
export async function createUserProfile(uid, data) {
    try {
        const userRef = doc(db, 'users', uid);
        
        // Check if user already exists (returning user)
        const existingDoc = await getDoc(userRef);
        if (existingDoc.exists()) {
            info('UserService: User profile already exists', { uid });
            // Update lastLoginAt for returning users
            await updateLastLogin(uid);
            return;
        }

        // Create new user profile with preferences
        const userDoc = {
            email: data.email,
            displayName: data.displayName || data.email?.split('@')[0] || 'User',
            photoURL: data.photoURL || null,
            role: data.role || 'member',
            xp: data.xp || 0,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            preferences: { ...DEFAULT_PREFERENCES }
        };

        await setDoc(userRef, userDoc);
        info('UserService: User profile created', { uid, email: data.email });
    } catch (err) {
        logError('UserService: Failed to create user profile', { uid, error: err.message });
        throw err;
    }
}

/**
 * @function updateLastLogin
 * @purpose Update lastLoginAt timestamp (FR-001)
 * @param {string} uid - Firebase user ID
 * @returns {Promise<void>}
 */
export async function updateLastLogin(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            lastLoginAt: serverTimestamp()
        });
        info('UserService: Updated lastLoginAt', { uid });
    } catch (err) {
        // Non-critical - don't throw, just log
        logError('UserService: Failed to update lastLoginAt', { uid, error: err.message });
    }
}

// =============================================================================
// USER PREFERENCES OPERATIONS
// =============================================================================

/**
 * @function loadUserPreferences
 * @purpose Load preferences from Firestore on login (FR-002)
 * @param {string} uid - Firebase user ID
 * @returns {Promise<Object>} Preferences object with defaults merged
 */
export async function loadUserPreferences(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            info('UserService: No user doc, returning defaults', { uid });
            return { ...DEFAULT_PREFERENCES };
        }

        const prefs = userDoc.data()?.preferences || {};
        // Merge with defaults (ensures new preference fields get defaults)
        const mergedPrefs = { ...DEFAULT_PREFERENCES, ...prefs };
        
        info('UserService: Loaded preferences', { uid, prefs: mergedPrefs });
        return mergedPrefs;
    } catch (err) {
        logError('UserService: Failed to load preferences', { uid, error: err.message });
        // Return defaults on error (offline fallback will kick in from theme-manager)
        return { ...DEFAULT_PREFERENCES };
    }
}

/**
 * @function savePreference
 * @purpose Save single preference to Firestore (FR-002)
 * @param {string} key - Preference key (e.g., 'theme')
 * @param {any} value - Preference value
 * @returns {Promise<boolean>} Success status
 */
export async function savePreference(key, value) {
    const uid = auth.currentUser?.uid;
    if (!uid) {
        info('UserService: No authenticated user, skip Firestore sync');
        return false;
    }

    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            [`preferences.${key}`]: value,
            updatedAt: serverTimestamp()
        });
        info('UserService: Saved preference', { key, value });
        return true;
    } catch (err) {
        logError('UserService: Failed to save preference', { key, error: err.message });
        // Don't throw - let localStorage fallback handle it
        return false;
    }
}
