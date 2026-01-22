/**
 * @file theme-manager.js
 * @purpose Simple dark/light theme toggle - NO complexity
 * @layer core
 * @dependencies [state.js, logger.js]
 * @dependents [app.js, header-ui.js]
 * @locked false
 * @modifyImpact [theme appearance]
 * 
 * DESIGN DECISION: Keep SIMPLE. No sticky scenarios, no color mixing, no brand themes.
 * This is what broke old NEXUS.
 */

import { setTheme as setStateTheme, getState } from './state.js';
import { info } from './logger.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['initTheme', 'getTheme', 'setTheme'],
    requires: ['state.js', 'logger.js']
};

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'nexus-theme';
const LIGHT_CLASS = 'light-theme';

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * @function initTheme
 * @purpose Initialize theme on app load
 * - Check localStorage for saved preference
 * - Fall back to system preference
 * - Apply theme to body
 */
export function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Priority: saved > system > default (dark)
    const theme = saved || (systemPrefersDark ? 'dark' : 'light');

    applyTheme(theme);
    setStateTheme(theme);

    info('Theme initialized', { theme });
}

// =============================================================================
// GETTERS / SETTERS
// =============================================================================

/**
 * @function getTheme
 * @purpose Get current theme
 * @returns {string} 'dark' or 'light'
 */
export function getTheme() {
    return getState('theme') || 'dark';
}

/**
 * @function setTheme
 * @purpose Set and persist theme
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
        return;
    }

    applyTheme(theme);
    setStateTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);

    info('Theme changed', { theme });
}

// =============================================================================
// INTERNAL
// =============================================================================

/**
 * @function applyTheme
 * @purpose Apply theme class to body
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add(LIGHT_CLASS);
    } else {
        document.body.classList.remove(LIGHT_CLASS);
    }
}
