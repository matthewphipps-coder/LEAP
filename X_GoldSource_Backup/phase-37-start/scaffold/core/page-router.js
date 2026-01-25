/**
 * @file page-router.js
 * @purpose Client-side page switching from PAGE_TABS config
 * @layer core
 * @dependencies [constants.js, sidebar-ui.js]
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [page navigation, sidebar updates]
 */

import { PAGE_TABS } from './constants.js';
import { setCurrentPage } from './state.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['initPageRouter', 'switchPage', 'getCurrentPage'],
    requires: ['constants.js', 'state.js']
};

// =============================================================================
// STATE
// =============================================================================

let currentPage = null;

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * @function initPageRouter
 * @purpose Initialize page router and set default page
 */
export function initPageRouter() {
    // Set initial page to first tab
    const defaultPage = PAGE_TABS[0]?.id || 'dashboard';
    switchPage(defaultPage);

    // Listen for tab clicks (delegated)
    document.addEventListener('click', (e) => {
        const tab = e.target.closest('[data-page]');
        if (tab) {
            e.preventDefault();
            switchPage(tab.dataset.page);
        }
    });

    console.log('[PageRouter] Initialized with', PAGE_TABS.length, 'pages');
}

// =============================================================================
// PAGE SWITCHING
// =============================================================================

/**
 * @function switchPage
 * @purpose Switch to a different page
 * @param {string} pageId - ID of page to switch to
 */
export function switchPage(pageId) {
    if (!pageId || pageId === currentPage) return;

    const prevPage = currentPage;
    currentPage = pageId;

    // Update tab active states
    document.querySelectorAll('.page-tab').forEach(tab => {
        const isActive = tab.dataset.page === pageId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });

    // Update page visibility
    document.querySelectorAll('.page').forEach(page => {
        const isActive = page.dataset.page === pageId;
        page.classList.toggle('page--active', isActive);
        page.setAttribute('aria-hidden', !isActive);
    });

    // LEAP-067: Update State (Source of Truth)
    setCurrentPage(pageId);

    console.log('[PageRouter] Switched from', prevPage, 'to', pageId);
}

// =============================================================================
// GETTERS
// =============================================================================

/**
 * @function getCurrentPage
 * @purpose Get current page ID
 * @returns {string} Current page ID
 */
export function getCurrentPage() {
    return currentPage;
}

/**
 * @function getPageTabs
 * @purpose Get all configured page tabs
 * @returns {Array} PAGE_TABS array
 */
export function getPageTabs() {
    return PAGE_TABS;
}
