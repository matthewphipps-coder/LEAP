/**
 * @file action-buttons-ui.js
 * @purpose Action buttons component - quick actions the AI can suggest or execute
 * @layer ui
 * @dependencies [state.js, dashboard-service.js, logger.js]
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [action buttons display and functionality]
 */

import { subscribe } from '../../core/state.js';
import { executeAction } from '../../features/dashboard/dashboard-service.js';
import { debug, info } from '../../core/logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['initActionButtons', 'renderActionButtons'],
    requires: ['state.js', 'dashboard-service.js', 'logger.js']
};

// Available quick actions
const QUICK_ACTIONS = [
    {
        id: 'create-task',
        icon: '➕',
        label: 'New Task',
        description: 'Create a new task'
    },
    {
        id: 'view-calendar',
        icon: '📅',
        label: 'Calendar',
        description: 'View your calendar'
    },
    {
        id: 'ask-ai',
        icon: '🤖',
        label: 'Ask AI',
        description: 'Get AI assistance'
    },
    {
        id: 'quick-report',
        icon: '📊',
        label: 'Report',
        description: 'Generate quick report'
    }
];

// DOM references
let actionButtonsEl = null;

/**
 * @function initActionButtons
 * @purpose Initialize action buttons component
 * @returns {void}
 * @impacts [action buttons are rendered and interactive]
 * @sideEffects [creates DOM elements, attaches event listeners]
 */
export function initActionButtons() {
    debug('Initializing action buttons');

    const container = document.getElementById('main-content');
    if (!container) return;

    // Create action buttons container
    actionButtonsEl = document.createElement('div');
    actionButtonsEl.className = 'action-buttons';
    actionButtonsEl.id = 'action-buttons';

    // Insert between data cards and chat panel
    const mainContainer = container.querySelector('.app-main__container');
    const chatPanel = document.getElementById('chat-panel');

    if (chatPanel) {
        mainContainer.insertBefore(actionButtonsEl, chatPanel);
    } else {
        mainContainer.appendChild(actionButtonsEl);
    }

    // Initial render
    renderActionButtons();
}

/**
 * @function renderActionButtons
 * @purpose Render action buttons
 * @returns {void}
 * @impacts [action buttons DOM is updated]
 * @sideEffects [modifies actionButtonsEl innerHTML, attaches event listeners]
 */
export function renderActionButtons() {
    if (!actionButtonsEl) return;

    actionButtonsEl.innerHTML = `
    <div class="action-buttons__header">
      <h3 class="action-buttons__title">Quick Actions</h3>
    </div>
    <div class="action-buttons__grid">
      ${QUICK_ACTIONS.map(action => `
        <button class="action-button" data-action="${action.id}" title="${action.description}">
          <span class="action-button__icon">${action.icon}</span>
          <span class="action-button__label">${action.label}</span>
        </button>
      `).join('')}
    </div>
  `;

    // Set up event delegation
    actionButtonsEl.addEventListener('click', handleActionClick);

    debug('Action buttons rendered', { actionCount: QUICK_ACTIONS.length });
}

/**
 * @function handleActionClick
 * @purpose Handle clicks on action buttons
 * @param {Event} event - Click event
 * @returns {void}
 * @impacts [may trigger action execution]
 * @sideEffects [may call executeAction]
 */
async function handleActionClick(event) {
    const button = event.target.closest('.action-button');
    if (!button) return;

    const actionId = button.dataset.action;
    if (!actionId) return;

    // Add loading state
    button.classList.add('action-button--loading');

    try {
        const result = await executeAction(actionId);
        info('Quick action executed', { actionId, success: result.success });

        // Show success feedback
        showActionFeedback(button, 'success');
    } catch (error) {
        showActionFeedback(button, 'error');
    } finally {
        button.classList.remove('action-button--loading');
    }
}

/**
 * @function showActionFeedback
 * @purpose Show visual feedback after action execution
 * @param {HTMLElement} button - Button element
 * @param {string} type - Feedback type ('success' or 'error')
 * @returns {void}
 * @impacts [button shows temporary feedback]
 * @sideEffects [modifies button class temporarily]
 */
function showActionFeedback(button, type) {
    button.classList.add(`action-button--${type}`);

    setTimeout(() => {
        button.classList.remove(`action-button--${type}`);
    }, 1500);
}
