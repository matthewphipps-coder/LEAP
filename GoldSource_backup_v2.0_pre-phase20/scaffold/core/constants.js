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
  provides: ['APP_NAME', 'APP_VERSION', 'ENV', 'isDev', 'isProd'],
  requires: []
};

// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================

export const APP_NAME = 'NEXUS';
export const APP_VERSION = '2.0.0';

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
