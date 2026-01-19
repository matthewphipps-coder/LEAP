/**
 * @file app.js
 * @purpose Application orchestrator - initializes all modules and coordinates startup
 * @layer core
 * @dependencies [logger.js, error-handler.js, state.js, mock-data.js, all UI components]
 * @dependents [index.html]
 * @locked true
 * @modifyImpact [application startup sequence, module initialization order]
 */

import { info, debug, error as logError } from './logger.js';
import { handleError } from './error-handler.js';
import { getState, updateState, subscribe } from './state.js';
import { getMockTasks, getMockMetrics, getMockNotifications } from './mock-data.js';

// UI Components
import { initHeader } from '../ui/components/header/header-ui.js';
import { initNav } from '../ui/components/nav/nav-ui.js';
import { initFooter } from '../ui/components/footer/footer-ui.js';
import { initChatPanel } from '../ui/components/chat-panel/chat-panel-ui.js';
import { initDataCards } from '../ui/components/data-cards/data-cards-ui.js';
import { initActionButtons } from '../ui/components/action-buttons/action-buttons-ui.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['initApp', 'getAppState'],
    requires: ['logger.js', 'error-handler.js', 'state.js', 'mock-data.js']
};

/**
 * @constant APP_CONFIG
 * @purpose Application configuration constants
 */
const APP_CONFIG = {
    name: 'DemoFactory Prototype',
    version: '0.1.0',
    archetype: 'Agentic Dashboard'
};

/**
 * @function initApp
 * @purpose Initialize the application - entry point called from index.html
 * @returns {Promise<void>}
 * @impacts [entire application starts up, all modules initialized]
 * @sideEffects [initializes state, renders UI, sets up event listeners]
 */
export async function initApp() {
    info(`Initializing ${APP_CONFIG.name} v${APP_CONFIG.version}`);

    try {
        // Step 1: Load initial data into state
        await loadInitialData();

        // Step 2: Initialize UI components
        await initUIComponents();

        // Step 3: Set up global event handlers
        setupGlobalHandlers();

        info('Application initialized successfully');

    } catch (err) {
        handleError(err, {
            silent: false,
            recover: () => {
                logError('Application failed to initialize');
            }
        });
    }
}

/**
 * @function loadInitialData
 * @purpose Load mock data into state for initial render
 * @returns {Promise<void>}
 * @impacts [state is populated with initial data]
 * @sideEffects [calls updateState with mock data]
 */
async function loadInitialData() {
    debug('Loading initial data');

    const tasks = getMockTasks();
    const metrics = getMockMetrics();
    const notifications = getMockNotifications();

    updateState({
        dashboard: {
            tasks,
            metrics,
            notifications
        }
    }, 'app.loadInitialData');

    debug('Initial data loaded', {
        taskCount: tasks.length,
        notificationCount: notifications.length
    });
}

/**
 * @function initUIComponents
 * @purpose Initialize all UI components in correct order
 * @returns {Promise<void>}
 * @impacts [all UI components are rendered]
 * @sideEffects [DOM is populated with component HTML]
 */
async function initUIComponents() {
    debug('Initializing UI components');

    // Shell components (locked)
    initHeader();
    initNav();
    initFooter();

    // Archetype components (flexible)
    initDataCards();
    initActionButtons();
    initChatPanel();

    debug('UI components initialized');
}

/**
 * @function setupGlobalHandlers
 * @purpose Set up application-wide event handlers
 * @returns {void}
 * @impacts [global events are handled]
 * @sideEffects [attaches event listeners to window/document]
 */
function setupGlobalHandlers() {
    debug('Setting up global handlers');

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
        handleError(event.error || event.message, { silent: true });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        handleError(event.reason, { silent: true });
    });

    // Subscribe to state changes for debugging
    subscribe((state, source) => {
        debug('State changed', { source });
    });
}

/**
 * @function getAppState
 * @purpose Convenience function to get current application state
 * @returns {Object} Current state
 * @impacts [none - read only]
 * @sideEffects [none]
 */
export function getAppState() {
    return getState();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
