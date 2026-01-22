/**
 * @file firebase.js
 * @purpose Firebase initialization - Auth and Firestore instances
 * @layer core
 * @dependencies [External: Firebase SDK via CDN]
 * @dependents [auth-service.js, app.js]
 * @locked true
 * @modifyImpact [all Firebase-dependent functionality]
 * @secrets Uses config.js for Firebase credentials (not committed to git)
 */

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['auth', 'db', 'initFirebase'],
    requires: ['config.js (Firebase credentials)']
};

// =============================================================================
// FIREBASE SDK IMPORTS (from CDN via importmap in HTML)
// =============================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// =============================================================================
// FIREBASE CONFIGURATION
// =============================================================================

// Import config from separate file (not committed to git)
// Create config.js with: export const firebaseConfig = { apiKey: '...', ... }
import { firebaseConfig } from './config.js';

// =============================================================================
// INITIALIZATION
// =============================================================================

let app = null;
let auth = null;
let db = null;

/**
 * @function initFirebase
 * @purpose Initialize Firebase app and services
 * @returns {Object} { auth, db }
 */
export function initFirebase() {
    if (app) {
        return { auth, db };
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    console.log('[NEXUS] Firebase initialized');

    return { auth, db };
}

// Initialize on module load
const services = initFirebase();

// =============================================================================
// EXPORTS
// =============================================================================

export { auth, db };
