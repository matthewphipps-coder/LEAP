/**
 * @file app.js
 * @purpose Application bootstrap and orchestration
 * @layer core
 * @dependencies [logger.js, state.js, auth-service.js, theme-manager.js, all UI components]
 * @dependents [index.html]
 * @locked false
 * @modifyImpact [application initialization flow]
 * @spec SPEC-003
 */

import { info, error as logError } from './logger.js';
import { getState } from './state.js';
import { setupAuthListener, logout } from './auth-service.js';
import { initTheme, setTheme, getTheme } from './theme-manager.js';
import { initHeader } from '../ui/components/header/header-ui.js';
import { initSidebar } from '../ui/components/sidebar/sidebar-ui.js';
import { initCanvas } from '../ui/components/canvas/canvas-ui.js';
import { initPageRouter } from './page-router.js';
import { initSettings, openSettings } from '../ui/components/settings/settings-ui.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['initApp'],
    requires: [
        'logger.js', 'state.js', 'auth-service.js', 'theme-manager.js',
        'header-ui.js', 'sidebar-ui.js', 'canvas-ui.js',
        'page-router.js', 'settings-ui.js'  // SPEC-003
    ]
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * @function initApp
 * @purpose Bootstrap the application
 */
async function initApp() {
    info('App: Initializing NEXUS');

    try {
        // 1. Initialize theme (before rendering)
        initTheme();

        // 2. Set up auth listener and wait for auth state
        setupAuthListener((user) => {
            if (!user) {
                // Not authenticated, redirect to login
                info('App: No user, redirecting to login');
                window.location.href = 'login.html';
                return;
            }

            // User is authenticated, initialize UI
            info('App: User authenticated, initializing UI', { email: user.email });
            initializeUI(user);
        });

    } catch (err) {
        logError('App: Initialization failed', { error: err.message });
    }
}

/**
 * @function initializeUI
 * @purpose Initialize all UI components after auth confirmed
 * @param {Object} user - Authenticated user object
 */
function initializeUI(user) {
    info('App: Initializing UI components');

    // Initialize SPEC-003 components
    initHeader(user, handleLogout, handleThemeToggle, handleSettingsOpen);
    initSidebar();
    initSettings();
    initPageRouter();  // Connect page changes to sidebar (via State)
    initCanvas();

    info('App: Initialization complete (SPEC-003)');
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

/**
 * @function handleLogout
 * @purpose Handle logout button click
 */
function handleLogout() {
    logout();
}

/**
 * @function handleThemeToggle
 * @purpose Handle theme toggle
 */
function handleThemeToggle() {
    const currentTheme = getTheme();
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

/**
 * @function handleSettingsOpen
 * @purpose Handle settings button click (SPEC-003)
 */
function handleSettingsOpen() {
    openSettings();
}

// =============================================================================
// START APPLICATION
// =============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
