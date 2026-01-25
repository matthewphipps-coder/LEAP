/**
 * @file canvas-ui.js
 * @purpose Main display area for Cards (Masonry/Grid/List/Freeform)
 * @layer ui
 * @dependencies [canvas.css, card.css, card-service.js]
 * @dependents [app.js]
 * @spec SPEC-006
 */

import { CardService } from '../../features/card/card-service.js';
import { getState, subscribe, setViewPreference } from '../../core/state.js';

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
  const canvasContainer = document.getElementById('main-content');
  if (!canvasContainer) return;

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
  document.addEventListener('sidebar-action', (e) => {
    const { actionId, pageId } = e.detail;
    if (pageId === 'dashboard') {
      if (['inbox', 'now', 'next', 'later', 'all'].includes(actionId)) {
        setHorizon(actionId);
      }
    }
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
  document.getElementById('horizon-title').textContent = horizon === 'all' ? 'All Cards' : horizon;

  // RESTORE LAYOUT PREFERENCE
  const state = getState();
  const savedMode = state.viewPreferences[horizon] || 'grid';
  setLayoutMode(savedMode);
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
  const cards = CardService.getCards(currentHorizon);

  if (cards.length === 0) {
    canvas.innerHTML = `<div class="init-message"><h2>All Clear</h2><p>No items in ${currentHorizon}</p></div>`;
    return;
  }

  canvas.innerHTML = cards.map((card, index) => createCardHTML(card, index)).join('');

  // Attach Drag Listeners
  const cardEls = canvas.querySelectorAll('.nexus-card');
  cardEls.forEach(el => {
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', el.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      el.classList.add('dragging');
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =============================================================================
// HTML GENERATION (Safe)
// =============================================================================

function createCardHTML(card, index) {
  // Freeform random positioning simulation
  let style = '';
  if (currentLayout === 'freeform') {
    const top = 50 + (index * 60) + (Math.random() * 20);
    const left = 50 + (index * 40) + (Math.random() * 50);
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
