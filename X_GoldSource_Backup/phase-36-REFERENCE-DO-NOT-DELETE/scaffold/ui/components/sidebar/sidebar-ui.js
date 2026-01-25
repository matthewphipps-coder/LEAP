/**
 * @file sidebar-ui.js
 * @purpose Sidebar component - floating pill with contextual per-page actions
 * @layer ui
 * @dependencies [constants.js, card-service.js]
 * @dependents [app.js, page-router.js]
 * @locked false
 * @modifyImpact [sidebar navigation]
 * @spec SPEC-003
 */

import { PAGE_SIDEBAR_ACTIONS } from '../../../core/constants.js';
import { moveCard } from '../../../features/card/card-service.js';
import { info } from '../../../core/logger.js';
import { getState, subscribe } from '../../../core/state.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: ['initSidebar', 'handleSidebarAction'],
  requires: ['constants.js', 'card-service.js', 'state.js']
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

  // Listen for badge updates
  window.addEventListener('card-update', (e) => {
    updateBadges(e.detail.stats);
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

  console.log('[Sidebar] updateSidebarForPage:', pageId, 'Actions:', actions.length);

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
          <span class="count-badge" style="display: none">0</span> <!-- Dynamic badge -->
          <span class="nav-tooltip">${action.label}</span>
        </button>
      `).join('')}
    </nav>
  `;

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Setup Drop Targets (for My Work page logic)
  if (pageId === 'my-work') {
    setupDropTargets(sidebarEl);
  }

  // Set first action as active
  currentActiveAction = actions[0]?.id || null;

  console.log('[Sidebar] Rendered', actions.length, 'actions for', pageId);
}

// =============================================================================
// ACTION HANDLING
// =============================================================================

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
// DROP & BADGE LOGIC
// =============================================================================

function setupDropTargets(sidebarEl) {
  const buttons = sidebarEl.querySelectorAll('.nav-item');

  buttons.forEach(btn => {
    const actionId = btn.dataset.action;
    // Only horizons are drop targets
    if (['inbox', 'now', 'next', 'later', 'done'].includes(actionId)) {

      btn.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
        btn.classList.add('drag-over');
      });

      btn.addEventListener('dragleave', () => {
        btn.classList.remove('drag-over');
      });

      btn.addEventListener('drop', (e) => {
        e.preventDefault();
        btn.classList.remove('drag-over');
        const cardId = e.dataTransfer.getData('text/plain');
        if (cardId) {
          moveCard(cardId, actionId);
        }
      });
    }
  });
}

function updateBadges(stats) {
  if (currentPage !== 'my-work' || !stats) return;

  const horizons = stats.horizons || {};

  document.querySelectorAll('.nav-item').forEach(btn => {
    const action = btn.dataset.action;
    const badgeEl = btn.querySelector('.count-badge');

    if (badgeEl && horizons[action] && action !== 'done') {
      const data = horizons[action];
      badgeEl.textContent = data.count;
      badgeEl.style.display = data.count > 0 ? 'flex' : 'none';

      // Priority Color Logic (Highest priority wins)
      badgeEl.style.backgroundColor = ''; // Reset
      badgeEl.style.color = '';

      if (data.p1 > 0) {
        badgeEl.style.backgroundColor = 'var(--badge-urgent)'; // Red
        badgeEl.style.color = 'white';
      } else if (data.p2 > 0) {
        badgeEl.style.backgroundColor = 'var(--badge-warning)'; // Amber
        badgeEl.style.color = 'white'; // Contrast check needed? Usually black on amber, but using white for consistency with dark mode
      } else {
        badgeEl.style.backgroundColor = 'var(--badge-neutral)'; // Gray/Default
      }
    }
  });
}
