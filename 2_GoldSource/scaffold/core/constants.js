/**
 * @file constants.js
 * @purpose Application constants and environment utilities
 * @layer core
 * @dependencies []
 * @dependents [app.js, all modules]
 * @locked true
 * @modifyImpact [all modules using constants]
 */

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: [
    'APP_NAME', 'APP_VERSION', 'ALLOWED_EMAIL_DOMAINS', 'ENV', 'isDev', 'isProd', 'CHECKPOINT_PREFIX',
    // SPEC-003 configs
    'PAGE_TABS', 'PAGE_SIDEBAR_ACTIONS', 'SETTINGS_MENU', 'SETTINGS_SECTIONS'
  ],
  requires: []
};

// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================

export const APP_NAME = 'NEXUS';
export const APP_VERSION = '2.0.0';

/**
 * @constant ALLOWED_EMAIL_DOMAINS
 * @purpose Restrict signup to specific email domains (FR-005)
 * @extensible Set to empty array to allow any domain
 */
export const ALLOWED_EMAIL_DOMAINS = [];  // e.g., ['@servicenow.com']

// =============================================================================
// ENVIRONMENT DETECTION
// =============================================================================

/**
 * @constant ENV
 * @purpose Detect environment from hostname
 */
export const ENV = (() => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return 'development';
  if (host.includes('staging')) return 'staging';
  return 'production';
})();

export const isDev = ENV === 'development';
export const isProd = ENV === 'production';

// =============================================================================
// CHECKPOINT PREFIX (for console logging context)
// =============================================================================

export const CHECKPOINT_PREFIX = '[NEXUS]';

// =============================================================================
// PAGE TABS CONFIGURATION (SPEC-003)
// =============================================================================

/**
 * @constant PAGE_TABS
 * @purpose Define available pages in header tab bar
 * @extensible Factory can add pages by appending to this array
 */
export const PAGE_TABS = [
  { id: 'my-work', icon: 'layout-dashboard', label: 'My Work' },
  { id: 'incidents', icon: 'alert-triangle', label: 'Incidents', badge: 2 },
  { id: 'reports', icon: 'bar-chart-3', label: 'Reports' },
  { id: 'calendar', icon: 'calendar', label: 'Calendar' },
];

// =============================================================================
// SIDEBAR ACTIONS PER PAGE (SPEC-003)
// =============================================================================

/**
 * @constant PAGE_SIDEBAR_ACTIONS
 * @purpose Define contextual sidebar buttons per page
 * @extensible Factory can add actions by extending page arrays
 */
export const PAGE_SIDEBAR_ACTIONS = {
  'my-work': [
    { id: 'inbox', icon: 'inbox', label: 'Inbox', badge: 3 },
    { id: 'now', icon: 'zap', label: 'Now', badge: 2 },
    { id: 'next', icon: 'clock', label: 'Next', badge: 5 },
    { id: 'later', icon: 'calendar', label: 'Later', badge: 8 },
    { id: 'all', icon: 'list', label: 'All' },
    { id: 'done', icon: 'check-circle', label: 'Done' },
    { id: 'optimise', icon: 'sparkles', label: 'Optimise' }
  ],
  incidents: [
    { id: 'new-incident', icon: 'plus', label: 'New Incident' },
    { id: 'filter', icon: 'filter', label: 'Filter' },
  ],
  reports: [],  // No sidebar actions for reports
  calendar: [], // No sidebar actions for calendar
};

// =============================================================================
// SETTINGS CONFIGURATION (SPEC-003)
// =============================================================================

/**
 * @constant SETTINGS_MENU
 * @purpose Define settings dialog menu structure
 */
export const SETTINGS_MENU = [
  {
    group: 'DISPLAY',
    items: [
      { id: 'appearance', icon: 'palette', label: 'Appearance' },
      { id: 'branding', icon: 'image', label: 'Branding' },
    ]
  }
];

/**
 * @constant SETTINGS_SECTIONS
 * @purpose Define settings section configurations
 */
export const SETTINGS_SECTIONS = {
  appearance: {
    colorModes: ['dark', 'light', 'system'],
    accentColors: [
      { id: 'green', value: '#62d84e', label: 'Green' },
      { id: 'blue', value: '#38bdf8', label: 'Blue' },
      { id: 'purple', value: '#8b5cf6', label: 'Purple' },
    ]
  },
  branding: {
    logoMaxHeight: 32,
    logoMaxWidth: 160,
    supportedFormats: ['svg', 'png', 'jpg', 'webp']
  }
};

