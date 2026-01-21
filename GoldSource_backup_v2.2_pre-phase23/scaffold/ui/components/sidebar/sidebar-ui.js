/**
 * @file sidebar-ui.js
 * @purpose Sidebar component - navigation panel with collapse/expand
 * @layer ui
 * @dependencies [state.js]
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [sidebar navigation]
 */

import { getState, setSidebarCollapsed, subscribe } from '../../../core/state.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: ['initSidebar', 'toggleSidebar'],
  requires: ['state.js']
};

// =============================================================================
// SIDEBAR INITIALIZATION
// =============================================================================

/**
 * @function initSidebar
 * @purpose Initialize sidebar component
 */
export function initSidebar() {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  sidebarEl.innerHTML = `
    <div class="sidebar-content">
      <!-- Toggle Button -->
      <button class="sidebar-toggle" id="sidebar-toggle" title="Toggle sidebar">
        <span class="toggle-icon">◀</span>
      </button>
      
      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Dashboard</div>
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#" class="nav-link nav-link--active">
                <span class="nav-icon">📊</span>
                <span class="nav-label">Overview</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      
      <!-- Footer -->
      <div class="sidebar-footer">
        <span class="sidebar-version">v2.0.0</span>
      </div>
    </div>
  `;

  // Bind toggle event
  document.getElementById('sidebar-toggle')?.addEventListener('click', toggleSidebar);

  // Subscribe to state changes
  subscribe((state, source) => {
    if (source === 'setSidebarCollapsed') {
      updateSidebarState();
    }
  });

  // Set initial state
  updateSidebarState();
}

/**
 * @function toggleSidebar
 * @purpose Toggle sidebar collapsed state
 */
export function toggleSidebar() {
  const current = getState('sidebarCollapsed');
  setSidebarCollapsed(!current);
}

/**
 * @function updateSidebarState
 * @purpose Update sidebar DOM based on collapsed state
 */
function updateSidebarState() {
  const sidebarEl = document.getElementById('sidebar');
  const toggleIcon = document.querySelector('.toggle-icon');
  const collapsed = getState('sidebarCollapsed');

  if (sidebarEl) {
    sidebarEl.classList.toggle('sidebar--collapsed', collapsed);
  }

  if (toggleIcon) {
    toggleIcon.textContent = collapsed ? '▶' : '◀';
  }
}
