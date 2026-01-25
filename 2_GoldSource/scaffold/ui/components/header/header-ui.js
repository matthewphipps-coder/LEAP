/**
 * @file header-ui.js
 * @purpose Header component - floating design with logo, tabs, search, actions
 * @layer ui
 * @dependencies [state.js, auth-service.js, constants.js, page-router.js]
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [header appearance and navigation]
 * @spec SPEC-003
 */

import { getState, subscribe } from '../../../core/state.js';
import { createUserAvatarHTML } from '../../../core/auth-service.js';
import { PAGE_TABS } from '../../../core/constants.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: ['initHeader', 'updateUserDisplay', 'renderPageTabs'],
  requires: ['state.js', 'auth-service.js', 'constants.js']
};

// =============================================================================
// STATE
// =============================================================================

let overflowMenuOpen = false;

// =============================================================================
// HEADER INITIALIZATION
// =============================================================================

/**
 * @function initHeader
 * @purpose Initialize header component with all SPEC-003 elements
 * @param {Object} user - Current user object
 * @param {Function} onLogout - Logout callback
 * @param {Function} onThemeToggle - Theme toggle callback
 * @param {Function} onSettingsOpen - Settings open callback
 */
export function initHeader(user, onLogout, onThemeToggle, onSettingsOpen) {
  const headerEl = document.getElementById('header');
  if (!headerEl) return;

  headerEl.innerHTML = `
    <!-- Left Zone: Logo, Brand, Tabs -->
    <div class="header-left">
      <!-- Customer Logo Slot -->
      <div class="header-logo">
        <img class="header-logo-img logo-dark" src="assets/logo-dark.svg" alt="Logo" onerror="this.style.display='none'">
        <img class="header-logo-img logo-light" src="assets/logo-light.svg" alt="Logo" onerror="this.style.display='none'">
      </div>
      
      <!-- Brand Text -->
      <span class="header-brand-text">NEXUS</span>
      
      <!-- Page Tabs -->
      <div class="page-tabs-container">
        <nav class="page-tabs" id="page-tabs" role="tablist">
          ${renderPageTabs()}
        </nav>
        <button class="tabs-overflow-btn" id="tabs-overflow-btn" aria-label="More pages" aria-expanded="false">
          <i data-lucide="more-horizontal"></i>
        </button>
        <div class="tabs-overflow-menu" id="tabs-overflow-menu" role="menu"></div>
      </div>
    </div>
    
    <!-- AI Search (centered) -->
    <div class="ai-search-container">
      <input type="text" class="ai-search-box" placeholder="Ask anything..." id="ai-search" aria-label="AI Search">
    </div>
    
    <!-- Actions (right) -->
    <div class="header-actions">
      <!-- Notifications -->
      <div class="has-badge">
        <button class="btn-icon" id="notifications-btn" aria-label="Notifications">
          <i data-lucide="bell"></i>
        </button>
        <span class="count-badge" id="notification-count">5</span>
      </div>
      
      <!-- Settings -->
      <button class="btn-icon" id="settings-btn" aria-label="Settings">
        <i data-lucide="settings"></i>
      </button>
      
      <!-- Theme Toggle -->
      <div class="theme-toggle" id="theme-toggle" role="switch" aria-label="Toggle theme" tabindex="0"></div>
      
      <!-- User Avatar -->
      <div class="user-avatar" id="user-avatar" title="${user?.displayName || 'User'}">
        ${getUserInitials(user)}
      </div>
    </div>
  `;

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Bind events
  bindHeaderEvents(onLogout, onThemeToggle, onSettingsOpen);

  // Subscribe to state changes
  subscribe((state, source) => {
    if (source === 'setTheme') {
      updateThemeToggle();
    }
  });

  // Set initial theme state
  updateThemeToggle();

  // Setup tab overflow observer
  setupTabOverflow();

  console.log('[Header] Initialized with', PAGE_TABS.length, 'page tabs');
}

// =============================================================================
// TAB RENDERING
// =============================================================================

/**
 * @function renderPageTabs
 * @purpose Generate tab HTML from PAGE_TABS config
 * @returns {string} HTML string for tabs
 */
export function renderPageTabs() {
  return PAGE_TABS.map((tab, index) => `
    <button 
      class="page-tab ${index === 0 ? 'active' : ''} ${tab.badge ? 'has-badge' : ''}"
      data-page="${tab.id}"
      role="tab"
      aria-selected="${index === 0}"
      aria-controls="page-${tab.id}"
      title="${tab.label}"
    >
      <i data-lucide="${tab.icon}"></i>
      ${tab.badge ? `<span class="count-badge">${tab.badge}</span>` : ''}
      <span class="tab-tooltip">${tab.label}</span>
    </button>
  `).join('');
}

// =============================================================================
// TAB OVERFLOW HANDLING
// =============================================================================

/**
 * @function setupTabOverflow
 * @purpose Monitor tabs container for overflow and show/hide "More" button
 */
function setupTabOverflow() {
  const tabsContainer = document.querySelector('.page-tabs');
  const overflowBtn = document.getElementById('tabs-overflow-btn');
  const overflowMenu = document.getElementById('tabs-overflow-menu');

  if (!tabsContainer || !overflowBtn) return;

  // Check overflow on resize
  const checkOverflow = () => {
    const tabs = tabsContainer.querySelectorAll('.page-tab');
    let hasOverflow = false;
    const hiddenTabs = [];

    tabs.forEach((tab, index) => {
      // Check if tab is visible (within container)
      const tabRect = tab.getBoundingClientRect();
      const containerRect = tabsContainer.getBoundingClientRect();

      if (tabRect.right > containerRect.right - 40) {
        tab.style.display = 'none';
        hasOverflow = true;
        hiddenTabs.push(PAGE_TABS[index]);
      } else {
        tab.style.display = '';
      }
    });

    overflowBtn.classList.toggle('visible', hasOverflow);

    // Populate overflow menu
    if (hasOverflow) {
      overflowMenu.innerHTML = hiddenTabs.map(tab => `
        <button data-page="${tab.id}">
          <i data-lucide="${tab.icon}"></i>
          ${tab.label}
        </button>
      `).join('');

      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ attrs: { class: '' } });
      }
    }
  };

  // Initial check
  setTimeout(checkOverflow, 100);

  // Resize observer
  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(tabsContainer);
  }

  // Toggle overflow menu
  overflowBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    overflowMenuOpen = !overflowMenuOpen;
    overflowMenu.classList.toggle('visible', overflowMenuOpen);
    overflowBtn.setAttribute('aria-expanded', overflowMenuOpen);
  });

  // Close on outside click
  document.addEventListener('click', () => {
    if (overflowMenuOpen) {
      overflowMenuOpen = false;
      overflowMenu.classList.remove('visible');
      overflowBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// =============================================================================
// EVENT BINDING
// =============================================================================

/**
 * @function bindHeaderEvents
 * @purpose Bind click handlers for header buttons
 */
function bindHeaderEvents(onLogout, onThemeToggle, onSettingsOpen) {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', () => {
    onThemeToggle?.();
    updateThemeToggle();
  });
  themeToggle?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onThemeToggle?.();
      updateThemeToggle();
    }
  });

  // Settings button
  document.getElementById('settings-btn')?.addEventListener('click', () => {
    onSettingsOpen?.();
  });

  // User avatar (could open profile menu)
  document.getElementById('user-avatar')?.addEventListener('click', () => {
    // Future: open user menu
    console.log('[Header] User avatar clicked');
  });

  // Notifications (placeholder)
  document.getElementById('notifications-btn')?.addEventListener('click', () => {
    console.log('[Header] Notifications clicked');
  });
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * @function getUserInitials
 * @purpose Extract initials from user name
 */
function getUserInitials(user) {
  if (!user?.displayName) return 'U';
  const parts = user.displayName.split(' ');
  if (parts.length >= 2) {
    return parts[0][0] + parts[parts.length - 1][0];
  }
  return parts[0][0];
}

/**
 * @function updateThemeToggle
 * @purpose Update theme toggle aria state
 */
function updateThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const theme = getState('theme');
  if (toggle) {
    toggle.setAttribute('aria-checked', theme === 'light');
  }
}

/**
 * @function updateUserDisplay
 * @purpose Update user display in header
 * @param {Object} user - User object
 */
export function updateUserDisplay(user) {
  const avatarEl = document.getElementById('user-avatar');
  if (avatarEl && user) {
    avatarEl.innerHTML = getUserInitials(user);
    avatarEl.title = user.displayName || 'User';
  }
}

/**
 * @function updateNotificationCount
 * @purpose Update notification badge count
 * @param {number} count - New count
 */
export function updateNotificationCount(count) {
  const badge = document.getElementById('notification-count');
  if (badge) {
    badge.textContent = count > 0 ? count : '';
  }
}
