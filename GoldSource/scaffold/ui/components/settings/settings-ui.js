/**
 * @file settings-ui.js
 * @purpose Settings dialog component with Appearance and Branding sections
 * @layer ui
 * @dependencies [constants.js, state.js]
 * @dependents [app.js, header-ui.js]
 * @locked false
 * @modifyImpact [settings functionality]
 * @spec SPEC-003
 */

import { SETTINGS_MENU, SETTINGS_SECTIONS } from '../../../core/constants.js';
import { getState, setState } from '../../../core/state.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['initSettings', 'openSettings', 'closeSettings'],
    requires: ['constants.js', 'state.js']
};

// =============================================================================
// STATE
// =============================================================================

let isOpen = false;
let currentSection = 'appearance';
let overlayEl = null;

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * @function initSettings
 * @purpose Initialize settings dialog (create DOM if needed)
 */
export function initSettings() {
    // Check if overlay already exists
    overlayEl = document.getElementById('settings-overlay');

    if (!overlayEl) {
        // Create settings overlay in body
        overlayEl = document.createElement('div');
        overlayEl.id = 'settings-overlay';
        overlayEl.className = 'settings-overlay';
        overlayEl.innerHTML = createSettingsDialogHTML();
        document.body.appendChild(overlayEl);
    }

    // Bind events
    bindSettingsEvents();

    console.log('[Settings] Initialized with', SETTINGS_MENU.length, 'menu groups');
}

// =============================================================================
// DIALOG HTML
// =============================================================================

/**
 * @function createSettingsDialogHTML
 * @purpose Generate settings dialog HTML structure
 */
function createSettingsDialogHTML() {
    return `
    <div class="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <!-- Left Menu -->
      <aside class="settings-menu">
        <div class="settings-menu-header">
          <h2 class="settings-menu-title" id="settings-title">Settings</h2>
        </div>
        <nav class="settings-menu-nav" role="navigation">
          ${renderSettingsMenu()}
        </nav>
      </aside>
      
      <!-- Right Content -->
      <div class="settings-content">
        <header class="settings-content-header">
          <h3 class="settings-content-title" id="settings-section-title">Appearance</h3>
          <button class="settings-close-btn" id="settings-close-btn" aria-label="Close settings">
            <i data-lucide="x"></i>
          </button>
        </header>
        
        <div class="settings-content-body" id="settings-content-body">
          <!-- Section content rendered here -->
        </div>
        
        <footer class="settings-footer">
          <button class="btn btn-secondary" id="settings-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="settings-save-btn">Save Changes</button>
        </footer>
      </div>
    </div>
  `;
}

/**
 * @function renderSettingsMenu
 * @purpose Generate settings menu HTML from SETTINGS_MENU config
 */
function renderSettingsMenu() {
    return SETTINGS_MENU.map(group => `
    <div class="settings-menu-section">
      <div class="settings-menu-section-label">${group.group}</div>
      ${group.items.map(item => `
        <button 
          class="settings-menu-item ${item.id === currentSection ? 'active' : ''}"
          data-section="${item.id}"
        >
          <i data-lucide="${item.icon}"></i>
          ${item.label}
        </button>
      `).join('')}
    </div>
  `).join('');
}

// =============================================================================
// OPEN / CLOSE
// =============================================================================

/**
 * @function openSettings
 * @purpose Open the settings dialog
 */
export function openSettings() {
    if (!overlayEl) {
        initSettings();
    }

    isOpen = true;
    currentSection = 'appearance'; // Reset to default section

    overlayEl.classList.add('visible');

    // Render current section
    renderSection(currentSection);
    updateMenuActiveState();

    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Trap focus
    document.addEventListener('keydown', handleKeydown);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    console.log('[Settings] Opened');
}

/**
 * @function closeSettings
 * @purpose Close the settings dialog
 */
export function closeSettings() {
    if (!overlayEl || !isOpen) return;

    isOpen = false;
    overlayEl.classList.remove('visible');

    // Remove listeners
    document.removeEventListener('keydown', handleKeydown);

    // Restore body scroll
    document.body.style.overflow = '';

    console.log('[Settings] Closed');
}

// =============================================================================
// SECTION RENDERING
// =============================================================================

/**
 * @function renderSection
 * @purpose Render a specific settings section
 * @param {string} sectionId - Section to render
 */
function renderSection(sectionId) {
    const contentBody = document.getElementById('settings-content-body');
    const titleEl = document.getElementById('settings-section-title');

    if (!contentBody) return;

    // Update title
    const menuItem = SETTINGS_MENU.flatMap(g => g.items).find(i => i.id === sectionId);
    if (titleEl && menuItem) {
        titleEl.textContent = menuItem.label;
    }

    // Render section-specific content
    switch (sectionId) {
        case 'appearance':
            contentBody.innerHTML = renderAppearanceSection();
            break;
        case 'branding':
            contentBody.innerHTML = renderBrandingSection();
            break;
        default:
            contentBody.innerHTML = `<p>Section "${sectionId}" not implemented.</p>`;
    }

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Bind section-specific events
    bindSectionEvents(sectionId);
}

/**
 * @function renderAppearanceSection
 * @purpose Render Appearance settings section
 */
function renderAppearanceSection() {
    const currentTheme = getState('theme') || 'dark';
    const config = SETTINGS_SECTIONS.appearance;

    return `
    <div class="settings-section">
      <h4>Theme</h4>
      
      <div class="setting-row">
        <label for="color-mode-select">Color Mode</label>
        <select class="setting-select" id="color-mode-select">
          ${config.colorModes.map(mode => `
            <option value="${mode}" ${currentTheme === mode ? 'selected' : ''}>
              ${mode.charAt(0).toUpperCase() + mode.slice(1)}
            </option>
          `).join('')}
        </select>
      </div>
      
      <div class="setting-row">
        <label for="accent-color-select">Accent Color</label>
        <select class="setting-select" id="accent-color-select">
          ${config.accentColors.map(color => `
            <option value="${color.id}">${color.label}</option>
          `).join('')}
        </select>
      </div>
    </div>
  `;
}

/**
 * @function renderBrandingSection
 * @purpose Render Branding settings section
 */
function renderBrandingSection() {
    return `
    <div class="settings-section">
      <h4>Workspace Logos</h4>
      
      <div class="setting-row">
        <label>Dark Mode Logo</label>
        <label class="setting-file-btn" for="logo-dark-input">
          <i data-lucide="upload"></i>
          Choose File
        </label>
        <input type="file" id="logo-dark-input" class="setting-file-input" accept="image/*">
      </div>
      
      <div class="setting-row">
        <label>Light Mode Logo</label>
        <label class="setting-file-btn" for="logo-light-input">
          <i data-lucide="upload"></i>
          Choose File
        </label>
        <input type="file" id="logo-light-input" class="setting-file-input" accept="image/*">
      </div>
      
      <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-md);">
        Recommended: SVG or PNG with transparent background. Max height: 32px.
      </p>
    </div>
  `;
}

// =============================================================================
// EVENT HANDLING
// =============================================================================

/**
 * @function bindSettingsEvents
 * @purpose Bind event listeners for settings dialog
 */
function bindSettingsEvents() {
    // Close button
    document.getElementById('settings-close-btn')?.addEventListener('click', closeSettings);

    // Cancel button
    document.getElementById('settings-cancel-btn')?.addEventListener('click', closeSettings);

    // Save button
    document.getElementById('settings-save-btn')?.addEventListener('click', saveSettings);

    // Click outside to close
    overlayEl?.addEventListener('click', (e) => {
        if (e.target === overlayEl) {
            closeSettings();
        }
    });

    // Menu item clicks
    overlayEl?.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.settings-menu-item');
        if (menuItem) {
            const sectionId = menuItem.dataset.section;
            if (sectionId && sectionId !== currentSection) {
                currentSection = sectionId;
                renderSection(sectionId);
                updateMenuActiveState();
            }
        }
    });
}

/**
 * @function bindSectionEvents
 * @purpose Bind section-specific event listeners
 */
function bindSectionEvents(sectionId) {
    if (sectionId === 'appearance') {
        // Theme select change (live preview)
        document.getElementById('color-mode-select')?.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            if (newTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDark ? 'dark' : 'light');
            } else {
                applyTheme(newTheme);
            }
        });
    }
}

/**
 * @function handleKeydown
 * @purpose Handle keyboard events when settings is open
 */
function handleKeydown(e) {
    if (e.key === 'Escape') {
        closeSettings();
    }
}

/**
 * @function updateMenuActiveState
 * @purpose Update active state of menu items
 */
function updateMenuActiveState() {
    document.querySelectorAll('.settings-menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === currentSection);
    });
}

/**
 * @function saveSettings
 * @purpose Save settings and close dialog
 */
function saveSettings() {
    // Get current values
    const themeSelect = document.getElementById('color-mode-select');
    if (themeSelect) {
        const theme = themeSelect.value;
        setState('theme', theme === 'system' ?
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') :
            theme
        );
    }

    console.log('[Settings] Saved');
    closeSettings();
}

/**
 * @function applyTheme
 * @purpose Apply theme immediately (for live preview)
 */
function applyTheme(theme) {
    document.body.classList.toggle('light-theme', theme === 'light');
}

// =============================================================================
// GETTERS
// =============================================================================

/**
 * @function isSettingsOpen
 * @purpose Check if settings dialog is open
 */
export function isSettingsOpen() {
    return isOpen;
}
