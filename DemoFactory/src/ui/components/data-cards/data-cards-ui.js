/**
 * @file data-cards-ui.js
 * @purpose Data cards component - display metrics and task information
 * @layer ui
 * @dependencies [state.js, dashboard-service.js, logger.js]
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [data cards display]
 */

import { getState, subscribe } from '../../core/state.js';
import { debug } from '../../core/logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['initDataCards', 'renderDataCards'],
    requires: ['state.js', 'logger.js']
};

// DOM references
let dataCardsEl = null;

/**
 * @function initDataCards
 * @purpose Initialize data cards component
 * @returns {void}
 * @impacts [data cards are rendered and reactive]
 * @sideEffects [subscribes to state, creates DOM elements]
 */
export function initDataCards() {
    debug('Initializing data cards');

    const container = document.getElementById('main-content');
    if (!container) return;

    // Create data cards container
    dataCardsEl = document.createElement('div');
    dataCardsEl.className = 'data-cards';
    dataCardsEl.id = 'data-cards';

    // Insert before chat panel
    const mainContainer = container.querySelector('.app-main__container');
    mainContainer.insertBefore(dataCardsEl, mainContainer.firstChild);

    // Initial render
    renderDataCards();

    // Subscribe to dashboard data changes
    subscribe((state, source) => {
        if (source.includes('dashboard')) {
            renderDataCards();
        }
    });
}

/**
 * @function renderDataCards
 * @purpose Render data cards based on current state
 * @returns {void}
 * @impacts [data cards DOM is updated]
 * @sideEffects [modifies dataCardsEl innerHTML]
 */
export function renderDataCards() {
    if (!dataCardsEl) return;

    const state = getState();
    const metrics = state.dashboard.metrics || {};
    const tasks = state.dashboard.tasks || [];

    // Calculate additional metrics
    const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
    const aiSuggestionsCount = tasks.filter(t => t.aiSuggestion).length;

    dataCardsEl.innerHTML = `
    <div class="data-cards__grid">
      
      <!-- Tasks Completed -->
      <div class="data-card data-card--success">
        <div class="data-card__icon">✅</div>
        <div class="data-card__content">
          <div class="data-card__value">${metrics.tasksCompleted || 0}</div>
          <div class="data-card__label">Tasks Completed</div>
        </div>
      </div>
      
      <!-- Tasks Pending -->
      <div class="data-card data-card--info">
        <div class="data-card__icon">📋</div>
        <div class="data-card__content">
          <div class="data-card__value">${metrics.tasksPending || 0}</div>
          <div class="data-card__label">Tasks Pending</div>
        </div>
      </div>
      
      <!-- High Priority -->
      <div class="data-card data-card--warning">
        <div class="data-card__icon">🔥</div>
        <div class="data-card__content">
          <div class="data-card__value">${highPriorityCount}</div>
          <div class="data-card__label">High Priority</div>
        </div>
      </div>
      
      <!-- AI Assist Rate -->
      <div class="data-card data-card--accent">
        <div class="data-card__icon">🤖</div>
        <div class="data-card__content">
          <div class="data-card__value">${metrics.aiAssistRate || '0%'}</div>
          <div class="data-card__label">AI Assist Rate</div>
        </div>
      </div>
      
    </div>
    
    <!-- Tasks with AI Suggestions -->
    ${aiSuggestionsCount > 0 ? `
      <div class="data-cards__section">
        <h3 class="data-cards__section-title">🤖 AI Suggestions</h3>
        <div class="data-cards__suggestions">
          ${tasks.filter(t => t.aiSuggestion).map(task => `
            <div class="suggestion-card">
              <div class="suggestion-card__task">${task.title}</div>
              <div class="suggestion-card__suggestion">${task.aiSuggestion}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

    debug('Data cards rendered', { metricsCount: Object.keys(metrics).length });
}
