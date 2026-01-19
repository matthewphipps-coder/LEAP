/**
 * @file footer-ui.js
 * @purpose Footer component rendering - status, version info
 * @layer ui
 * @dependencies [state.js, logger.js]
 * @dependents [app.js]
 * @locked true
 * @modifyImpact [footer display]
 */

import { getState, subscribe } from '../../../core/state.js';
import { debug } from '../../../core/logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['initFooter', 'renderFooter'],
    requires: ['state.js', 'logger.js']
};

// Footer configuration
const FOOTER_CONFIG = {
    appName: 'DemoFactory Prototype',
    version: 'v0.1.0',
    archetype: 'Agentic Dashboard'
};

// DOM references
let footerEl = null;

/**
 * @function initFooter
 * @purpose Initialize footer component
 * @returns {void}
 * @impacts [footer is rendered]
 * @sideEffects [may subscribe to state for dynamic content]
 */
export function initFooter() {
    debug('Initializing footer component');

    footerEl = document.getElementById('app-footer');

    if (!footerEl) {
        debug('Footer element not found');
        return;
    }

    // Initial render
    renderFooter();

    // Subscribe for any footer-relevant state changes
    subscribe((state, source) => {
        if (source.includes('connection') || source.includes('status')) {
            renderFooter();
        }
    });
}

/**
 * @function renderFooter
 * @purpose Render footer content based on current state
 * @returns {void}
 * @impacts [footer DOM is updated]
 * @sideEffects [modifies footerEl innerHTML]
 */
export function renderFooter() {
    if (!footerEl) return;

    const state = getState();
    const connectionStatus = 'Connected'; // Placeholder for future implementation

    footerEl.innerHTML = `
    <div class="app-footer__left">
      <span class="footer-status">
        <span class="footer-status__indicator footer-status__indicator--online"></span>
        ${connectionStatus}
      </span>
      <span class="footer-version">${FOOTER_CONFIG.appName} ${FOOTER_CONFIG.version}</span>
    </div>
    <div class="app-footer__right">
      <span class="footer-archetype">Archetype: ${FOOTER_CONFIG.archetype}</span>
    </div>
  `;

    debug('Footer rendered');
}
