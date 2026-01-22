/**
 * @file state.js
 * @purpose StateManager - single source of truth for application state with pub/sub
 * @layer core
 * @dependencies [logger.js]
 * @dependents [app.js, dashboard-service.js, all UI components]
 * @locked true
 * @modifyImpact [all components that read or subscribe to state]
 */

import { debug, info, warn } from './logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['getState', 'updateState', 'subscribe', 'unsubscribe', 'resetState'],
    requires: ['logger.js']
};

/**
 * @constant INITIAL_STATE
 * @purpose Define the default state structure for the application
 */
const INITIAL_STATE = {
    // User and session
    user: {
        isAuthenticated: true,  // Simulated auth for prototype
        name: 'Demo User',
        role: 'user'
    },

    // Dashboard data
    dashboard: {
        tasks: [],
        metrics: {},
        notifications: []
    },

    // Chat state
    chat: {
        messages: [],
        isAgentTyping: false
    },

    // UI state
    ui: {
        theme: 'light',
        sidebarOpen: true,
        activePanel: 'dashboard'
    }
};

// Private state - not directly accessible
let currentState = JSON.parse(JSON.stringify(INITIAL_STATE));

// Subscribers map: id -> callback
const subscribers = new Map();
let subscriberId = 0;

/**
 * @function getState
 * @purpose Retrieve current state or a specific path within state
 * @param {string} path - Optional dot-notation path (e.g., 'user.name')
 * @returns {any} The state value at the specified path, or full state if no path
 * @impacts [none - read only]
 * @sideEffects [none]
 */
export function getState(path = null) {
    if (!path) {
        // Return deep copy to prevent mutation
        return JSON.parse(JSON.stringify(currentState));
    }

    // Navigate path
    const keys = path.split('.');
    let value = currentState;

    for (const key of keys) {
        if (value === undefined || value === null) {
            warn('State path not found', { path });
            return undefined;
        }
        value = value[key];
    }

    // Return deep copy for objects
    return typeof value === 'object' && value !== null
        ? JSON.parse(JSON.stringify(value))
        : value;
}

/**
 * @function updateState
 * @purpose Merge new state into current state and notify subscribers
 * @param {Object} newState - Partial state to merge (can be nested)
 * @param {string} source - Optional identifier for what triggered the update
 * @returns {void}
 * @impacts [all subscribed UI components will be notified]
 * @sideEffects [modifies currentState, triggers subscriber callbacks]
 */
export function updateState(newState, source = 'unknown') {
    debug('State update requested', { source, newState });

    // Deep merge
    currentState = deepMerge(currentState, newState);

    info('State updated', { source, subscriberCount: subscribers.size });

    // Notify all subscribers
    notifySubscribers(source);
}

/**
 * @function subscribe
 * @purpose Register a callback to be notified on state changes
 * @param {Function} callback - Function to call on state change
 * @returns {number} Subscription ID for unsubscribing
 * @impacts [callback will be called on future state changes]
 * @sideEffects [adds entry to subscribers map]
 */
export function subscribe(callback) {
    if (typeof callback !== 'function') {
        warn('Subscribe requires a function callback');
        return null;
    }

    const id = ++subscriberId;
    subscribers.set(id, callback);

    debug('New state subscriber', { id, totalSubscribers: subscribers.size });

    return id;
}

/**
 * @function unsubscribe
 * @purpose Remove a subscription by ID
 * @param {number} id - Subscription ID from subscribe()
 * @returns {boolean} True if unsubscribed, false if ID not found
 * @impacts [callback will no longer be called on state changes]
 * @sideEffects [removes entry from subscribers map]
 */
export function unsubscribe(id) {
    const existed = subscribers.delete(id);

    if (existed) {
        debug('Subscriber removed', { id, remainingSubscribers: subscribers.size });
    } else {
        warn('Unsubscribe failed - ID not found', { id });
    }

    return existed;
}

/**
 * @function resetState
 * @purpose Reset state to initial values
 * @param {string} source - What triggered the reset
 * @returns {void}
 * @impacts [all state returns to initial, all subscribers notified]
 * @sideEffects [replaces currentState, notifies subscribers]
 */
export function resetState(source = 'manual') {
    info('State reset', { source });
    currentState = JSON.parse(JSON.stringify(INITIAL_STATE));
    notifySubscribers(source);
}

/**
 * @function notifySubscribers
 * @purpose Call all subscriber callbacks with current state
 * @param {string} source - What triggered the notification
 * @returns {void}
 * @impacts [all subscriber callbacks are invoked]
 * @sideEffects [executes subscriber callback functions]
 */
function notifySubscribers(source) {
    const state = getState();

    subscribers.forEach((callback, id) => {
        try {
            callback(state, source);
        } catch (error) {
            warn('Subscriber callback error', { id, error: error.message });
        }
    });
}

/**
 * @function deepMerge
 * @purpose Recursively merge source into target
 * @param {Object} target - Object to merge into
 * @param {Object} source - Object to merge from
 * @returns {Object} Merged object
 * @impacts [none - pure function]
 * @sideEffects [none]
 */
function deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}
