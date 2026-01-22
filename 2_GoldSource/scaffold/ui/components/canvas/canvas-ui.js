/**
 * @file canvas-ui.js
 * @purpose Canvas component - main content area
 * @layer ui
 * @dependencies []
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [main content area]
 */

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: ['initCanvas'],
  requires: []
};

// =============================================================================
// CANVAS INITIALIZATION
// =============================================================================

/**
 * @function initCanvas
 * @purpose Initialize canvas component
 * @note Legacy function - page sections now defined in index.html (SPEC-003).
 *       Multi-page system uses #page-dashboard, #page-incidents, etc.
 *       This function is kept as no-op for backwards compatibility.
 */
export function initCanvas() {
  // No-op: Page sections are statically defined in index.html
  // Do NOT overwrite canvas innerHTML - it destroys page-router targets
}
