/**
 * @file canvas-ui.js
 * @purpose Canvas component - main content area (empty for future cards)
 * @layer ui
 * @dependencies [state.js]
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [main content area]
 */

import { subscribe } from '../../../core/state.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: ['initCanvas'],
  requires: ['state.js']
};

// =============================================================================
// CANVAS INITIALIZATION
// =============================================================================

/**
 * @function initCanvas
 * @purpose Initialize canvas component with welcome message
 */
export function initCanvas() {
  const canvasEl = document.getElementById('canvas');
  if (!canvasEl) return;

  canvasEl.innerHTML = `
    <div class="canvas-content">
      <div class="canvas-welcome">
        <h1 class="welcome-title">Welcome to NEXUS</h1>
        <p class="welcome-subtitle">Your AI-First Enterprise Dashboard</p>
        <p class="welcome-hint">This canvas is ready for future features via the Factory.</p>
      </div>
    </div>
  `;

  // Subscribe to state changes for future features
  subscribe((state, source) => {
    // Future: update canvas based on state changes
  });
}
