/**
 * @file canvas-ui.js
 * @purpose Main display area for Cards (Masonry/Grid/List/Freeform)
 * @layer ui
 * @dependencies [canvas.css, card.css, card-service.js]
 * @dependents [app.js]
 * @spec SPEC-006
 */

import { CardService } from '../../../features/card/card-service.js';
import { getState, subscribe, setViewPreference } from '../../../core/state.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
  provides: ['initCanvas', 'refreshCanvas'],
  requires: ['card-service.js', 'state.js']
};

// =============================================================================
// STATE
// =============================================================================

let currentHorizon = 'inbox'; // Default
let currentLayout = 'grid';   // grid | list | freeform

// =============================================================================
// INITIALIZATION
// =============================================================================

export function initCanvas() {
  const canvasContainer = document.querySelector('#page-dashboard .page-content');
  if (!canvasContainer) {
    console.error('[Canvas] Fatal: Container #page-dashboard .page-content not found');
    return;
  }

  // Clear existing content and setup container
  canvasContainer.innerHTML = `
    <div class="canvas-container">
      <header class="horizon-header">
        <span id="horizon-title">My Work</span>
        <div class="layout-toggles">
          <button class="layout-toggle-btn active" data-layout="grid" title="Masonry Grid"><i data-lucide="grid"></i></button>
          <button class="layout-toggle-btn" data-layout="list" title="List View"><i data-lucide="list"></i></button>
          <button class="layout-toggle-btn" data-layout="freeform" title="Freeform"><i data-lucide="move"></i></button>
        </div>
      </header>
      <div id="nexus-canvas" class="nexus-scroll-area nexus-canvas grid-mode">
        <!-- Cards injected here -->
      </div>
    </div>
  `;

  // Bind Layout Toggles
  const toggles = canvasContainer.querySelectorAll('.layout-toggle-btn');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.layout;
      setViewPreference(currentHorizon, mode); // Persist to state
    });
  });

  // Subscribe to external events (Sidebar Filter)
  // Subscribe to external events (Sidebar Filter)
  document.addEventListener('sidebar-action', (e) => {
    const { actionId, pageId } = e.detail;
    if (pageId === 'dashboard') {
      if (['inbox', 'now', 'next', 'later', 'all', 'done'].includes(actionId)) {
        setHorizon(actionId);
      }
    }
  });

  // LOGIC: Handle Drop from Sidebar
  document.addEventListener('sidebar-drop', (e) => {
    const { cardId, actionId, pageId } = e.detail;
    if (pageId === 'dashboard') {
      // actionId is the target horizon (e.g. 'next')
      const success = CardService.updateCardHorizon(cardId, actionId);
      if (success) {
        // Optimistic refresh (service also emits card-update, but we can fast-path)
        // renderCards() will be called by the card-update listener below
      }
    }
  });

  // LOGIC: Refresh on Data Change
  document.addEventListener('card-update', (e) => {
    // If the moved card was in our current view, or moved INTO our current view
    // For simplicity, always re-render to ensure consistency
    renderCards();
    console.log('[Canvas] Refreshed due to card-update');
  });

  // STATE SUBSCRIPTION: Layout Changes
  subscribe((state, source) => {
    if (source === 'setViewPreference') {
      const newMode = state.viewPreferences[currentHorizon];
      setLayoutMode(newMode);
    }
  });

  // Initial Render
  setHorizon('inbox'); // Will trigger renderCards and read layout

  if (typeof lucide !== 'undefined') lucide.createIcons();
  console.log('[Canvas] Initialized');
}

// =============================================================================
// LOGIC
// =============================================================================

function setHorizon(horizon) {
  currentHorizon = horizon;
  const titleMap = {
    all: 'All Cards',
    done: 'Done'
  };
  document.getElementById('horizon-title').textContent = titleMap[horizon] || horizon;

  // LAYOUT RESTRICTIONS
  // Define allowed layouts per horizon
  const allowedLayouts = {
    done: ['list'],
    all: ['grid', 'list'],
    default: ['grid', 'list', 'freeform']
  };

  const allowed = allowedLayouts[horizon] || allowedLayouts.default;

  // UI: Show/Hide Toggle Buttons
  document.querySelectorAll('.layout-toggle-btn').forEach(btn => {
    const layout = btn.dataset.layout;
    if (allowed.includes(layout)) {
      btn.style.removeProperty('display');
    } else {
      btn.style.display = 'none';
    }
  });

  // RESTORE/ENFORCE LAYOUT
  const state = getState();
  let targetMode = state.viewPreferences[horizon] || 'grid';

  // If saved preference is invalid for this horizon, fall back to first allowed
  if (!allowed.includes(targetMode)) {
    targetMode = allowed[0];
  }

  setLayoutMode(targetMode);
}

function setLayoutMode(mode) {
  currentLayout = mode;
  const canvas = document.getElementById('nexus-canvas');
  if (!canvas) return; // Guard

  canvas.className = 'nexus-scroll-area nexus-canvas'; // Reset
  canvas.classList.add(`${mode}-mode`);

  // Visual Toggle State
  document.querySelectorAll('.layout-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.layout === mode);
  });

  // Re-render (Freeform needs positions)
  renderCards();
}

function renderCards() {
  const canvas = document.getElementById('nexus-canvas');
  let html = '';
  let hasCards = false;

  if (currentHorizon === 'all') {
    // Grouped View
    const horizons = ['inbox', 'now', 'next', 'later'];

    horizons.forEach(h => {
      const cards = CardService.getCards(h);
      if (cards.length > 0) {
        hasCards = true;
        html += `<div class="horizon-group-title">${h}</div>`;
        html += cards.map((card, index) => createCardHTML(card, index)).join('');
      }
    });

  } else {
    // Flat View
    const cards = CardService.getCards(currentHorizon);
    if (cards.length > 0) {
      hasCards = true;
      html = cards.map((card, index) => createCardHTML(card, index)).join('');
    }
  }

  if (!hasCards && currentHorizon === 'all') {
    canvas.innerHTML = `<div class="init-message"><h2>All Clear</h2><p>No items in All</p></div>`;
    return;
  } else if (!hasCards) {
    canvas.innerHTML = `<div class="init-message"><h2>All Clear</h2><p>No items in ${currentHorizon}</p></div>`;
    return;
  }

  canvas.innerHTML = html;

  // Attach Drag Listeners
  // Attach Drag Listeners
  const cardEls = canvas.querySelectorAll('.nexus-card');
  cardEls.forEach(el => {
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', el.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      el.classList.add('dragging');

      // Calculate offset from mouse to card corner to prevent jumping
      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      e.dataTransfer.setData('application/json', JSON.stringify({ offsetX, offsetY }));
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });
  });

  // FREEFORM DROP ZONE
  if (currentLayout === 'freeform') {
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault(); // ALLOW DROP
      e.dataTransfer.dropEffect = 'move';
    });

    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      const cardId = e.dataTransfer.getData('text/plain');
      const offsetData = e.dataTransfer.getData('application/json');

      if (cardId && offsetData) {
        const { offsetX, offsetY } = JSON.parse(offsetData);
        const canvasRect = canvas.getBoundingClientRect();

        // New position relative to canvas container
        // Also consider scrollTop if the container scrolls!
        const scrollTop = canvas.scrollTop;
        const scrollLeft = canvas.scrollLeft;

        let x = e.clientX - canvasRect.left - offsetX + scrollLeft;
        let y = e.clientY - canvasRect.top - offsetY + scrollTop;

        // constrain to bounds? For now allow freedom.
        x = Math.max(0, x);
        y = Math.max(0, y);

        // Update DOM immediately for smoothness
        const cardEl = canvas.querySelector(`.nexus-card[data-id="${cardId}"]`);
        if (cardEl) {
          cardEl.style.left = `${x}px`;
          cardEl.style.top = `${y}px`;
        }

        // Save to DB
        CardService.updateCardPosition(cardId, x, y);
      }
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =============================================================================
// HTML GENERATION (Safe)
// =============================================================================

function createCardHTML(card, index) {
  // Freeform random positioning simulation
  // Freeform positioning
  let style = '';
  if (currentLayout === 'freeform') {
    // Use stored position if available, else random layout (legacy mock)
    // Note: In real app, we'd probably want to Auto-Layout them first time.

    let top, left;

    if (card.x !== undefined && card.y !== undefined) {
      left = card.x;
      top = card.y;
    } else {
      // Fallback Random / Grid-like Scatter
      top = 50 + (index * 60) + (Math.random() * 20);
      left = 50 + (index * 40) + (Math.random() * 50);
    }

    style = `style="top: ${top}px; left: ${left}px;"`;
  }

  return `
    <article 
      class="nexus-card" 
      draggable="true" 
      data-id="${card.id}"
      data-size="${card.size}"
      data-animate="${card.animate}"
      ${style}
    >
      <div class="card-header">
        <span class="card-meta">${card.meta || ''}</span>
        ${card.updates > 0 ? `
          <button class="card-updates-badge" title="${card.updates} updates">
            <i data-lucide="message-square"></i>
            <span class="badge-count">${card.updates}</span>
          </button>
        ` : ''}
      </div>
      
      <h3 class="card-title">${card.title}</h3>
      <p class="card-summary">${card.summary || ''}</p>
      
      <div class="card-footer">
        <span class="card-priority-badge ${card.priority}">${card.priority.toUpperCase()}</span>
        <span>${card.timestamp}</span>
      </div>
    </article>
  `;
}
