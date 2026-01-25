/**
 * @file canvas-ui.js
 * @purpose Controller for Card & Canvas Interactions (V2 Refactor)
 * @dependencies [card-service.js, state.js]
 */

import { getCards, moveCard, moveCardRelative, setItems } from '../../../features/card/card-service.js';
import { getState, subscribe } from '../../../core/state.js';

// =============================================================================
// STATE & CONFIG
// =============================================================================

let currentHorizon = 'now'; // Default view
let layoutMode = 'masonry'; // 'masonry' | 'freeform'
let draggedId = null;
let isFreeDragging = false;
let freeDragOffset = { x: 0, y: 0 };
let freeDragEl = null;

// =============================================================================
// INITIALIZATION
// =============================================================================

export function initCanvas() {
  console.log('CanvasUI: Initializing');

  // Initial Render
  renderCanvas();
  setupLayoutToggles();

  // State Subscription (Robust Fix)
  subscribe((state, source) => {
    // Re-render on any card change or generic update
    if (source.startsWith('cards.') || source === 'restored') {
      console.log('CanvasUI: State Update Detected', source);
      renderCanvas();
    }
  });

  // Event Listeners
  window.addEventListener('nexus-state-change', renderCanvas);
  window.addEventListener('card-update', renderCanvas);

  // Navigation (Sidebar)
  document.addEventListener('sidebar-action', (e) => {
    const { actionId } = e.detail;
    // Only switch horizon if action is a valid horizon
    if (['inbox', 'now', 'next', 'later', 'done', 'all'].includes(actionId)) {
      currentHorizon = actionId;
      renderCanvas();
    }
  });
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getCardsByHorizon(horizon) {
  const { items } = getCards();
  if (!items) return [];

  if (horizon === 'all') return items;
  if (horizon === 'inbox') return items.filter(c => c.inbox);

  // Default: Check state property
  return items.filter(c => c.state === horizon);
}

// =============================================================================
// RENDERING
// =============================================================================

function renderCanvas() {
  // Use nexus-canvas ID to match index.html
  const container = document.getElementById('nexus-canvas');
  if (!container) {
    console.warn('CanvasUI: Container #nexus-canvas not found');
    return;
  }

  container.innerHTML = '';
  container.className = 'canvas-wrapper'; // Reset to simple flex container (remove .nexus-canvas-grid)

  // 1. Render Horizon Header (Fixed)
  const header = document.createElement('div');
  header.className = 'horizon-header';

  // Title
  const title = document.createElement('h2');
  title.className = 'horizon-title';
  title.textContent = currentHorizon.charAt(0).toUpperCase() + currentHorizon.slice(1);
  header.appendChild(title);

  // Layout Controls (Only for non-list views)
  if (!['all', 'done', 'inbox'].includes(currentHorizon)) {
    const controls = document.createElement('div');
    controls.className = 'layout-controls';

    // Masonry Toggle
    const btnMasonry = document.createElement('button');
    btnMasonry.className = `btn-icon layout-toggle-btn ${layoutMode === 'masonry' ? 'active' : ''}`;
    btnMasonry.id = 'btn-layout-masonry';
    btnMasonry.innerHTML = '<i data-lucide="grid-2x2"></i>'; // Lucide icon
    btnMasonry.title = "Masonry View";
    btnMasonry.onclick = () => switchLayout('masonry');

    // Freeform Toggle
    const btnFree = document.createElement('button');
    btnFree.className = `btn-icon layout-toggle-btn ${layoutMode === 'freeform' ? 'active' : ''}`;
    btnFree.id = 'btn-layout-freeform';
    btnFree.innerHTML = '<i data-lucide="move"></i>'; // Lucide icon
    btnFree.title = "Freeform View";
    btnFree.onclick = () => switchLayout('freeform');

    controls.appendChild(btnMasonry);
    controls.appendChild(btnFree);
    header.appendChild(controls);
  }

  container.appendChild(header);

  // 2. Render Scrollable Card Area
  const scrollArea = document.createElement('div');
  scrollArea.className = 'nexus-scroll-area nexus-canvas';

  if (currentHorizon === 'all') {
    renderListMode(scrollArea);
  } else if (currentHorizon === 'done') {
    renderDoneMode(scrollArea);
  } else {
    // Active Horizon
    if (layoutMode === 'freeform') {
      scrollArea.classList.add('freeform-mode');
      renderFreeForm(scrollArea);
    } else {
      scrollArea.classList.add('grid-mode');
      scrollArea.classList.add('nexus-canvas-grid');
      renderMasonry(scrollArea);
    }
  }

  container.appendChild(scrollArea);

  // Re-initialize icons
  if (window.lucide) window.lucide.createIcons();
}

function renderMasonry(container) {
  const cards = getCardsByHorizon(currentHorizon);
  cards.forEach(c => {
    const el = createCardElement(c);
    configureDnD(el); // Native DnD
    container.appendChild(el);
  });
}

function renderFreeForm(container) {
  const cards = getCardsByHorizon(currentHorizon);
  cards.forEach(c => {
    const el = createCardElement(c);

    // Restore Position or Default
    if (c.x !== undefined && c.y !== undefined) {
      el.style.left = c.x + 'px';
      el.style.top = c.y + 'px';
    } else {
      // Scatter default
      el.style.left = '50px';
      el.style.top = '50px';
    }

    // Mouse Events for Free Drag
    el.addEventListener('mousedown', handleFreeMouseDown);
    container.appendChild(el);
  });
}

function renderListMode(container) {
  container.classList.add('list-mode');
  const groups = ['Inbox', 'Now', 'Next', 'Later'];

  groups.forEach(groupName => {
    const key = groupName.toLowerCase();
    const groupCards = getCardsByHorizon(key);

    // Group Header
    const header = document.createElement('div');
    header.className = 'list-group-header';
    header.textContent = groupName;
    container.appendChild(header);

    // Group Container
    const group = document.createElement('div');
    group.className = 'list-group';
    group.dataset.horizon = key;

    // Group Drop Logic (Horizon Move)
    group.addEventListener('dragover', handleGroupDragOver);
    group.addEventListener('dragleave', handleGroupDragLeave);
    group.addEventListener('drop', handleGroupDrop);

    groupCards.forEach(c => {
      const el = createCardElement(c);
      configureDnD(el);
      group.appendChild(el);
    });

    if (groupCards.length === 0) {
      group.innerHTML = `<div style="padding:10px; color:var(--text-secondary); font-style:italic; font-size:12px;">Empty</div>`;
    }

    container.appendChild(group);
  });
}

function renderDoneMode(container) {
  container.classList.add('list-mode'); // Reuse list styles
  const cards = getCardsByHorizon('done');
  cards.sort((a, b) => new Date(b.doneAt || 0) - new Date(a.doneAt || 0));

  cards.forEach(c => {
    const el = createCardElement(c, false); // Not draggable
    container.appendChild(el);
  });
}

// =============================================================================
// COMPONENT FACTORY
// =============================================================================

function createCardElement(data, draggable = true) {
  const el = document.createElement('div');
  el.className = 'nexus-card';
  el.dataset.id = data.id;
  el.dataset.size = (data.visuals && data.visuals.size) || 'medium';
  if (data.animate) el.dataset.animate = "true";

  // Draggable Attr
  if (draggable && layoutMode !== 'freeform') {
    el.draggable = true;
  }

  // Content
  const pClass = data.content.tags && data.content.tags.includes('P1') ? 'p1' : (data.content.tags.includes('P2') ? 'p2' : 'p3');

  el.innerHTML = `
        <div class="card-header">
            <span class="card-meta">${data.content.tags[0] || 'Type'}</span>
            <span class="card-priority-badge ${pClass}">${pClass.toUpperCase()}</span>
        </div>
        <div class="card-title">${data.content.title}</div>
        <div class="card-summary">${data.content.summary}</div>
        <div class="card-footer">
            <span class="card-timestamp">
                <i data-lucide="clock" style="width:12px;"></i> Just now
            </span>
            ${data.status && data.status.unread_count > 0 ?
      `<span class="card-updates-badge">
                    <i data-lucide="message-square" style="width:14px;"></i> 
                    <span style="font-size:10px; margin-left:4px;">${data.status.unread_count}</span>
                </span>` : ''}
        </div>
    `;

  return el;
}

// =============================================================================
// NATIVE DRAG & DROP (MASONRY / LIST)
// =============================================================================

function configureDnD(el) {
  el.addEventListener('dragstart', handleDragStart);
  el.addEventListener('dragend', handleDragEnd);
  el.addEventListener('dragover', handleCardDragOver);
  el.addEventListener('dragleave', handleCardDragLeave);
  el.addEventListener('drop', handleCardDrop);
}

function handleDragStart(e) {
  draggedId = this.dataset.id;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedId); // For sidebar drops
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  clearDropMarkers();
  draggedId = null;
}

function handleCardDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  if (draggedId === this.dataset.id) return;

  // Advanced Insertion: Top half vs Bottom half
  const rect = this.getBoundingClientRect();
  const isTop = (e.clientY - rect.top) < (rect.height / 2);

  this.classList.remove('drop-before', 'drop-after');
  if (isTop) {
    this.classList.add('drop-before');
  } else {
    this.classList.add('drop-after');
  }
}

function handleCardDragLeave(e) {
  this.classList.remove('drop-before', 'drop-after');
}

function handleCardDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  // Determine insertion
  const rect = this.getBoundingClientRect();
  const isTop = (e.clientY - rect.top) < (rect.height / 2);
  const targetId = this.dataset.id;

  // Execute Move using service
  moveCardRelative(draggedId, targetId, isTop ? 'before' : 'after');

  clearDropMarkers();
  // No manual render needed, card-service update will trigger card-update event
}

function clearDropMarkers() {
  document.querySelectorAll('.drop-before, .drop-after').forEach(el => {
    el.classList.remove('drop-before', 'drop-after');
  });
  document.querySelectorAll('.drag-group-active').forEach(el => {
    el.classList.remove('drag-group-active');
  });
}


// =============================================================================
// LIST GROUP DROPS
// =============================================================================

function handleGroupDragOver(e) {
  e.preventDefault();
  this.classList.add('drag-group-active'); // Add visual style for group
}
function handleGroupDragLeave(e) {
  this.classList.remove('drag-group-active');
}
function handleGroupDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-group-active');
  const newHorizon = this.dataset.horizon;
  moveCard(draggedId, newHorizon);
}


// =============================================================================
// FREEFORM MOUSE DRAG
// =============================================================================

function handleFreeMouseDown(e) {
  if (e.button !== 0) return;
  isFreeDragging = true;
  freeDragEl = this;

  const rect = this.getBoundingClientRect();
  freeDragOffset.x = e.clientX - rect.left;
  freeDragOffset.y = e.clientY - rect.top;

  this.style.zIndex = 1000; // Pop on drag
  this.style.transition = 'none'; // Instant follow

  document.addEventListener('mousemove', handleFreeMouseMove);
  document.addEventListener('mouseup', handleFreeMouseUp);
}

function handleFreeMouseMove(e) {
  if (!isFreeDragging || !freeDragEl) return;

  const container = document.getElementById('nexus-canvas');
  const containerRect = container.getBoundingClientRect();

  let newX = e.clientX - containerRect.left - freeDragOffset.x + container.scrollLeft;
  let newY = e.clientY - containerRect.top - freeDragOffset.y + container.scrollTop;

  freeDragEl.style.left = newX + 'px';
  freeDragEl.style.top = newY + 'px';
}

function handleFreeMouseUp(e) {
  if (!isFreeDragging) return;
  isFreeDragging = false;

  // Persistence (Mock - requires new service method updateCardPosition, ignoring for now as Freeform is Prototype)
  // const id = freeDragEl.dataset.id;
  // const x = parseFloat(freeDragEl.style.left);
  // const y = parseFloat(freeDragEl.style.top);
  // state.updateCardPosition(id, x, y);

  freeDragEl.style.transition = ''; // Restore smooth
  freeDragEl.style.zIndex = ''; // Reset (Hover rule handles 50)
  freeDragEl = null;

  document.removeEventListener('mousemove', handleFreeMouseMove);
  document.removeEventListener('mouseup', handleFreeMouseUp);
}

// =============================================================================
// LAYOUT TOGGLES
// =============================================================================

function setupLayoutToggles() {
  const btnMasonry = document.getElementById('btn-layout-masonry');
  const btnFree = document.getElementById('btn-layout-freeform');

  if (btnMasonry) btnMasonry.onclick = () => switchLayout('masonry');
  if (btnFree) btnFree.onclick = () => switchLayout('freeform');
}

function switchLayout(mode) {
  if (layoutMode === mode) return;
  layoutMode = mode;

  // UI Updates
  document.querySelectorAll('.layout-toggle-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-layout-${mode}`).classList.add('active');

  renderCanvas();
}
