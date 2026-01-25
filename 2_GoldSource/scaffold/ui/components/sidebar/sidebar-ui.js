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
  // LEAP-067: Subscribe to state changes (Unidirectional Flow)
  subscribe((state, source) => {
    if (source === 'setCurrentPage' || source === 'reset') {
      updateSidebarForPage(state.currentPage);
    }
  });

  // REACTIVE BADGES (SPEC-006)
  document.addEventListener('card-update', (e) => {
    const { stats } = e.detail;
    if (stats && currentPage === 'dashboard') {
      updateSidebarBadges(stats);
    }
  });

  // Initial render
  const initialState = getState();
  updateSidebarForPage(initialState.currentPage);

  // Initialize badges with real data immediately
  // DYNAMIC IMPORT or Global - CardService is a feature module, maybe hard to import directly if strict layering?
  // But we can dispatch a request or just import it if allowed. 
  // Given app architecture, features depend on core, UI depends on core.
  // SidebarUI -> CardService is UI -> Feature (Side-dependency). Ideally Avoid.
  // Better: app.js listens for init and dispatches stats? 
  // OR: Just allow it for now since we are in a tight loop.
  // actually, let's use the event bus to request an update?
  // Or simpler: Dispatch a 'card-update' from the Service when it loads?
  // Let's modify CardService to dispatch initial state on load/init? 
  // Or just import CardService here dynamically to avoid circular dep issues during module load.

  import('../../../features/card/card-service.js').then(({ CardService }) => {
    const stats = CardService.getCardStats();
    if (currentPage === 'dashboard') {
      updateSidebarBadges(stats);
      // Also update header
      document.dispatchEvent(new CustomEvent('card-update', {
        detail: { stats },
        bubbles: true
      }));
    }
  });

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
          data-droppable="${action.droppable || false}"
          aria-label="${action.label}"
          title="${action.label}"
        >
          <i data-lucide="${action.icon}"></i>
          ${action.badge ? `<span class="count-badge ${action.badgeColor || ''}">${action.badge}</span>` : ''}
          <span class="nav-tooltip">${action.label}</span>
        </button>
      `).join('')}
    </nav>
  `;

  // Initialize Drag & Drop Zones
  initDropZones(sidebarEl);

  // Initialize Lucide icons for new content
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set first action as active
  currentActiveAction = actions[0]?.id || null;

  console.log('[Sidebar] Rendered', actions.length, 'actions for', pageId);
}

/**
 * @function initDropZones
 * @purpose Attach drag events to droppable items
 */
function initDropZones(container) {
  const droppables = container.querySelectorAll('[data-droppable="true"]');

  droppables.forEach(el => {
    el.addEventListener('dragover', (e) => {
      e.preventDefault(); // Allow drop
      e.dataTransfer.dropEffect = 'move';
      el.classList.add('drag-over');
    });

    el.addEventListener('dragleave', () => {
      el.classList.remove('drag-over');
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drag-over');

      const cardId = e.dataTransfer.getData('text/plain');
      const actionId = el.dataset.action;

      if (cardId) {
        handleSidebarDrop(cardId, actionId);
      }
    });
  });
}

/**
 * @function handleSidebarDrop
 * @purpose Dispatch drop event
 */
function handleSidebarDrop(cardId, actionId) {
  const event = new CustomEvent('sidebar-drop', {
    detail: { cardId, actionId, pageId: currentPage },
    bubbles: true
  });
  document.dispatchEvent(event);
  console.log('[Sidebar] Drop detected:', cardId, '->', actionId);

  // Optimistic UI update (simulate badge increment)
  // In real app, this waits for state update
  const btn = document.querySelector(`[data-action="${actionId}"]`);
  if (btn) {
    btn.classList.add('pulse'); // CSS animation
    setTimeout(() => btn.classList.remove('pulse'), 500);
  }
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

/**
 * @function updateSidebarBadges
 * @purpose Update badge counts based on live stats
 * @param {Object} stats - { inbox: 5, now: 2 ... }
 */
function updateSidebarBadges(stats) {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  Object.entries(stats).forEach(([key, data]) => {
    // Check if data is object (new format) or number (legacy fallback)
    const count = typeof data === 'object' ? data.count : data;
    const hasP1 = typeof data === 'object' ? data.hasP1 : false;
    const hasP2 = typeof data === 'object' ? data.hasP2 : false;

    const btn = sidebarEl.querySelector(`[data-action="${key}"]`);
    if (btn) {
      // Find or create badge
      let badge = btn.querySelector('.count-badge');
      if (count > 0) {
        if (!badge) {
          const badgeEl = document.createElement('span');
          badgeEl.className = 'count-badge';
          btn.appendChild(badgeEl);
          badge = badgeEl;
        }
        badge.textContent = count;

        // COLOR LOGIC
        badge.className = 'count-badge'; // Reset
        if (hasP1) badge.classList.add('urgent');
        else if (hasP2) badge.classList.add('warning');

        btn.classList.add('has-badge');
      } else {
        if (badge) badge.remove();
        btn.classList.remove('has-badge');
      }
    }
  });
}
