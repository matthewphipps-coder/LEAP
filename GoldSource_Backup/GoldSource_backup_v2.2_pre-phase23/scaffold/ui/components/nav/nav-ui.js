/**
 * @file nav-ui.js
 * @purpose Navigation component rendering - sidebar navigation
 * @layer ui
 * @dependencies [state.js, logger.js]
 * @dependents [app.js]
 * @locked true
 * @modifyImpact [navigation display, active panel selection]
 */

import { getState, subscribe, updateState } from '../../../core/state.js';
import { debug } from '../../../core/logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['initNav', 'renderNav'],
    requires: ['state.js', 'logger.js']
};

// Navigation items configuration
const NAV_ITEMS = [
    { id: 'dashboard', icon: '📊', label: 'Overview', section: 'Dashboard' },
    { id: 'tasks', icon: '📋', label: 'Tasks', section: 'Dashboard' },
    { id: 'chat', icon: '💬', label: 'Agent Chat', section: 'Dashboard' },
    { id: 'settings', icon: '⚙️', label: 'Settings', section: 'System' }
];

// DOM references
let navEl = null;

/**
 * @function initNav
 * @purpose Initialize navigation component and set up subscriptions
 * @returns {void}
 * @impacts [navigation is rendered and reactive to state changes]
 * @sideEffects [subscribes to state, attaches event listeners]
 */
export function initNav() {
    debug('Initializing nav component');

    navEl = document.getElementById('app-nav');

    if (!navEl) {
        debug('Nav element not found');
        return;
    }

    // Initial render
    renderNav();

    // Subscribe to state changes
    subscribe((state, source) => {
        if (source.includes('ui.activePanel') || source.includes('ui.sidebarOpen')) {
            renderNav();
        }
    });

    // Set up event delegation
    navEl.addEventListener('click', handleNavClick);
}

/**
 * @function renderNav
 * @purpose Render navigation based on current state
 * @returns {void}
 * @impacts [navigation DOM is updated]
 * @sideEffects [modifies navEl innerHTML]
 */
export function renderNav() {
    if (!navEl) return;

    const state = getState();
    const activePanel = state.ui.activePanel;

    // Group items by section
    const sections = {};
    NAV_ITEMS.forEach(item => {
        if (!sections[item.section]) {
            sections[item.section] = [];
        }
        sections[item.section].push(item);
    });

    // Generate HTML
    let html = '';
    Object.entries(sections).forEach(([sectionName, items]) => {
        html += `
      <div class="app-nav__section">
        <div class="app-nav__section-title">${sectionName}</div>
        <ul class="app-nav__list">
          ${items.map(item => `
            <li class="app-nav__item">
              <a href="#" 
                 class="app-nav__link ${activePanel === item.id ? 'app-nav__link--active' : ''}"
                 data-panel="${item.id}">
                <span class="app-nav__link-icon">${item.icon}</span>
                <span>${item.label}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    });

    navEl.innerHTML = html;
    debug('Nav rendered', { activePanel });
}

/**
 * @function handleNavClick
 * @purpose Handle clicks on navigation links
 * @param {Event} event - Click event
 * @returns {void}
 * @impacts [may change active panel]
 * @sideEffects [may trigger state updates]
 */
function handleNavClick(event) {
    const link = event.target.closest('.app-nav__link');
    if (!link) return;

    event.preventDefault();

    const panelId = link.dataset.panel;
    if (panelId) {
        setActivePanel(panelId);
    }
}

/**
 * @function setActivePanel
 * @purpose Update the active panel in state
 * @param {string} panelId - ID of panel to activate
 * @returns {void}
 * @impacts [active panel changes, content area updates]
 * @sideEffects [updates state]
 */
function setActivePanel(panelId) {
    updateState({ ui: { activePanel: panelId } }, 'nav.setActivePanel');
    debug('Active panel changed', { panelId });
}
