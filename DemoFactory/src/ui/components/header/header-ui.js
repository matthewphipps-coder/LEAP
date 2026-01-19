/**
 * @file header-ui.js
 * @purpose Header component rendering - user info, notifications, theme toggle
 * @layer ui
 * @dependencies [state.js, logger.js]
 * @dependents [app.js]
 * @locked true
 * @modifyImpact [header display, user actions in header]
 */

import { getState, subscribe, updateState } from '../../core/state.js';
import { debug } from '../../core/logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['initHeader', 'renderHeader'],
    requires: ['state.js', 'logger.js']
};

// DOM references
let headerActionsEl = null;

/**
 * @function initHeader
 * @purpose Initialize header component and set up subscriptions
 * @returns {void}
 * @impacts [header is rendered and reactive to state changes]
 * @sideEffects [subscribes to state, attaches event listeners]
 */
export function initHeader() {
    debug('Initializing header component');

    headerActionsEl = document.getElementById('header-actions');

    if (!headerActionsEl) {
        debug('Header actions element not found');
        return;
    }

    // Initial render
    renderHeader();

    // Subscribe to state changes
    subscribe((state, source) => {
        if (source.includes('user') || source.includes('ui.theme')) {
            renderHeader();
        }
    });

    // Set up event delegation
    headerActionsEl.addEventListener('click', handleHeaderClick);
}

/**
 * @function renderHeader
 * @purpose Render header actions based on current state
 * @returns {void}
 * @impacts [header actions DOM is updated]
 * @sideEffects [modifies headerActionsEl innerHTML]
 */
export function renderHeader() {
    if (!headerActionsEl) return;

    const state = getState();
    const { user, ui } = state;
    const isDark = ui.theme === 'dark';

    headerActionsEl.innerHTML = `
    <button class="btn btn-secondary header-action" id="theme-toggle" title="Toggle theme">
      ${isDark ? '☀️' : '🌙'}
    </button>
    <button class="btn btn-secondary header-action" id="notifications-btn" title="Notifications">
      🔔
    </button>
    <div class="header-user">
      <span class="header-user__name">${user.name}</span>
      <div class="header-user__avatar">${user.name.charAt(0)}</div>
    </div>
  `;

    debug('Header rendered');
}

/**
 * @function handleHeaderClick
 * @purpose Handle clicks on header action buttons
 * @param {Event} event - Click event
 * @returns {void}
 * @impacts [may update state based on clicked action]
 * @sideEffects [may trigger state updates]
 */
function handleHeaderClick(event) {
    const target = event.target.closest('button');
    if (!target) return;

    const id = target.id;

    if (id === 'theme-toggle') {
        toggleTheme();
    } else if (id === 'notifications-btn') {
        debug('Notifications clicked');
        // TODO: Open notifications panel
    }
}

/**
 * @function toggleTheme
 * @purpose Toggle between light and dark theme
 * @returns {void}
 * @impacts [UI theme changes, all components affected]
 * @sideEffects [updates state, modifies document data-theme attribute]
 */
function toggleTheme() {
    const currentTheme = getState('ui.theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Update document attribute for CSS
    document.documentElement.setAttribute('data-theme', newTheme);

    // Update state
    updateState({ ui: { theme: newTheme } }, 'header.toggleTheme');

    debug('Theme toggled', { newTheme });
}
