/**
 * @file sidebar-ui.js
 * @purpose Sidebar component - floating pill with contextual per-page actions
 * @layer ui
 * @dependencies [constants.js]
 * @dependents [app.js, page-router.js]
 * @locked false
 * @modifyImpact [sidebar navigation]
 * @spec SPEC-003
 */

import { PAGE_SIDEBAR_ACTIONS } from '../../../core/constants.js';
import { getState, subscribe } from '../../../core/state.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: ['initSidebar', 'handleSidebarAction'],
  requires: ['constants.js', 'state.js']
};

// =============================================================================
// STATE
// =============================================================================

let currentPage = null;
let currentActiveAction = null;

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * @function initSidebar
 * @purpose Initialize sidebar component
 */
export function initSidebar() {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  // Add glass class for consistent styling
  sidebarEl.classList.add('glass');

  // Bind action clicks
  sidebarEl.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.nav-item');
    if (actionBtn) {
      const actionId = actionBtn.dataset.action;
      if (actionId) {
        handleSidebarAction(actionId);
      }
    }
  });

  // LEAP-067: Subscribe to state changes (Unidirectional Flow)
  subscribe((state, source) => {
    if (source === 'setCurrentPage' || source === 'reset') {
      updateSidebarForPage(state.currentPage);
    }
  });

  // Initial render
  const initialState = getState();
  updateSidebarForPage(initialState.currentPage);

  console.log('[Sidebar] Initialized');
}

// =============================================================================
// PAGE-SPECIFIC RENDERING
// =============================================================================

/**
 * @function updateSidebarForPage
 * @purpose Update sidebar content based on current page
 * @param {string} pageId - The ID of the current page
 */
function updateSidebarForPage(pageId) {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  currentPage = pageId;
  const actions = PAGE_SIDEBAR_ACTIONS[pageId] || [];

  // Hide sidebar if no actions for this page
  if (actions.length === 0) {
    sidebarEl.classList.add('hidden');
    console.log('[Sidebar] Hidden - no actions for', pageId);
    return;
  }

  // Show sidebar and render actions
  sidebarEl.classList.remove('hidden');

  sidebarEl.innerHTML = `
    <nav class="sidebar-nav" role="toolbar" aria-label="Page actions">
      ${actions.map((action, index) => `
        <button 
          class="nav-item ${index === 0 ? 'active' : ''} ${action.badge ? 'has-badge' : ''}"
          data-action="${action.id}"
          aria-label="${action.label}"
          title="${action.label}"
        >
          <i data-lucide="${action.icon}"></i>
          ${action.badge ? `<span class="count-badge">${action.badge}</span>` : ''}
          <span class="nav-tooltip">${action.label}</span>
        </button>
      `).join('')}
    </nav>
  `;

  // Initialize Lucide icons for new content
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set first action as active
  currentActiveAction = actions[0]?.id || null;

  console.log('[Sidebar] Rendered', actions.length, 'actions for', pageId);
}

// =============================================================================
// ACTION HANDLING
// =============================================================================

/**
 * @function handleSidebarAction
 * @purpose Handle sidebar action button click
 * @param {string} actionId - The ID of the clicked action
 */
export function handleSidebarAction(actionId) {
  // Update active state
  document.querySelectorAll('.nav-item').forEach(btn => {
    const isActive = btn.dataset.action === actionId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });

  currentActiveAction = actionId;

  // Dispatch custom event for features to handle
  const event = new CustomEvent('sidebar-action', {
    detail: {
      actionId,
      pageId: currentPage
    },
    bubbles: true
  });
  document.dispatchEvent(event);

  console.log('[Sidebar] Action triggered:', actionId, 'on page:', currentPage);
}

// =============================================================================
// GETTERS
// =============================================================================

/**
 * @function getCurrentAction
 * @purpose Get the currently active sidebar action
 * @returns {string|null} Current action ID
 */
export function getCurrentAction() {
  return currentActiveAction;
}

/**
 * @function getActionsForPage
 * @purpose Get sidebar actions for a specific page
 * @param {string} pageId - Page ID
 * @returns {Array} Array of action objects
 */
export function getActionsForPage(pageId) {
  return PAGE_SIDEBAR_ACTIONS[pageId] || [];
}
