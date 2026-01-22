/**
 * @file header-ui.js
 * @purpose Header component - logo, user avatar, theme toggle, logout
 * @layer ui
 * @dependencies [state.js, auth-service.js]
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [header appearance and actions]
 */

import { getState, subscribe } from '../../../core/state.js';
import { createUserAvatarHTML } from '../../../core/auth-service.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: ['initHeader', 'updateUserDisplay'],
  requires: ['state.js', 'auth-service.js']
};

// =============================================================================
// HEADER INITIALIZATION
// =============================================================================

/**
 * @function initHeader
 * @purpose Initialize header component
 * @param {Object} user - Current user object
 * @param {Function} onLogout - Logout callback
 * @param {Function} onThemeToggle - Theme toggle callback
 */
export function initHeader(user, onLogout, onThemeToggle) {
  const headerEl = document.getElementById('header');
  if (!headerEl) return;

  headerEl.innerHTML = `
    <div class="header-content">
      <!-- Logo -->
      <div class="header-brand">
        <span class="header-logo">NEXUS</span>
      </div>
      
      <!-- Spacer -->
      <div class="header-spacer"></div>
      
      <!-- Actions -->
      <div class="header-actions">
        <!-- Theme Toggle -->
        <button id="theme-toggle" class="btn btn-ghost btn-icon" title="Toggle theme">
          <span class="theme-icon">🌙</span>
        </button>
        
        <!-- User Avatar -->
        <div class="header-user" id="header-user">
          <div class="user-avatar">
            ${createUserAvatarHTML(user)}
          </div>
          <span class="user-name">${user?.displayName || 'User'}</span>
        </div>
        
        <!-- Logout -->
        <button id="logout-btn" class="btn btn-ghost btn-icon" title="Sign out">
          <span>⎋</span>
        </button>
      </div>
    </div>
  `;

  // Bind events
  document.getElementById('logout-btn')?.addEventListener('click', onLogout);
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    onThemeToggle();
    updateThemeIcon();
  });

  // Subscribe to state changes
  subscribe((state, source) => {
    if (source === 'setTheme') {
      updateThemeIcon();
    }
  });

  // Set initial theme icon
  updateThemeIcon();
}

/**
 * @function updateThemeIcon
 * @purpose Update theme toggle icon based on current theme
 */
function updateThemeIcon() {
  const icon = document.querySelector('.theme-icon');
  const theme = getState('theme');
  if (icon) {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

/**
 * @function updateUserDisplay
 * @purpose Update user display in header
 * @param {Object} user - User object
 */
export function updateUserDisplay(user) {
  const userEl = document.getElementById('header-user');
  if (userEl && user) {
    userEl.innerHTML = `
      <div class="user-avatar">
        ${createUserAvatarHTML(user)}
      </div>
      <span class="user-name">${user.displayName || 'User'}</span>
    `;
  }
}
