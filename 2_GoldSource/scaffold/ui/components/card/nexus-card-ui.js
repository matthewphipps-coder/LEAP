/**
 * @file nexus-card-ui.js
 * @purpose Renders individual Card DOM elements
 * @layer ui
 * @dependencies [card.css]
 * @dependents [canvas-ui.js]
 * @spec SPEC-004
 */

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatTimestamp(ts) {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// =============================================================================
// COMPONENT RENDERER
// =============================================================================

/**
 * @function createCardElement
 * @purpose Create DOM element for a card
 * @param {Object} cardData - Card data object
 * @returns {HTMLElement} The card element
 */
export function createCardElement(cardData) {
    const card = document.createElement('div');

    // Base classes and attributes
    card.className = 'nexus-card';
    card.draggable = true;

    // Data attributes for styling/logic
    card.dataset.id = cardData.id;
    card.dataset.size = cardData.visuals?.size || 'medium';
    card.dataset.state = cardData.state;
    card.dataset.inbox = cardData.inbox;

    // Determine priority styling
    const score = cardData.ai_meta?.importance_score || 0;
    const priorityInfo = score > 0.8 ? { class: 'p1', label: 'P1' } :
        score > 0.5 ? { class: 'p2', label: 'P2' } :
            { class: 'p3', label: 'P3' };

    // Tag override if present
    const tag = cardData.content?.tags?.[0] || priorityInfo.label;

    // Construct HTML
    card.innerHTML = `
    <div class="card-header">
      <span class="card-meta">#${cardData.id.split('-')[1]}</span>
      <span class="card-priority-badge ${priorityInfo.class}">
        ${tag}
      </span>
    </div>
    
    <h3 class="card-title">${cardData.content?.title || 'Untitled'}</h3>
    
    ${cardData.content?.summary ?
            `<p class="card-summary">${cardData.content.summary}</p>` : ''}
    
    <div class="card-footer">
      <span class="card-timestamp">
        <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
        ${formatTimestamp(cardData.status?.last_sync)}
      </span>
      ${(cardData.status?.unread_count > 0) ?
            `<span class="card-updates-badge">
           <i data-lucide="message-square" style="width: 12px; height: 12px;"></i>
           <span class="badge-count">${cardData.status.unread_count}</span>
         </span>` : ''}
    </div>
  `;

    // EVENT: Drag Start
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', cardData.id);
        e.dataTransfer.effectAllowed = 'move';
        card.classList.add('dragging');

        // Optional: Ghost image
    });

    // EVENT: Drag End
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    // EVENT: Click
    card.addEventListener('click', (e) => {
        // Prevent click if dragging
        console.log('[Card] Clicked', cardData.id);
        // Future: Open workbench
    });

    return card;
}
