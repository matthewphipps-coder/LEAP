/**
 * @file state.js
 * @purpose Minimal StateManager for scaffold shell - user, theme, sidebar
 * @layer core
 * @dependencies [logger.js]
 * @dependents [app.js, all UI components]
 * @locked true
 * @modifyImpact [all components that read or subscribe to state]
 */

import { debug, info, warn } from './logger.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['getState', 'setUser', 'setTheme', 'setSidebarCollapsed', 'subscribe', 'unsubscribe', 'reset', 'registerStateSlice'],
    requires: ['logger.js']
};

// =============================================================================
// SLICE REGISTRY - Extension point for feature state
// =============================================================================

const slices = {};

// =============================================================================
// INITIAL STATE - Minimal shell state only
// =============================================================================

const INITIAL_STATE = {
    user: null,                 // Set on auth: { uid, email, displayName, photoURL }
    theme: 'dark',              // 'dark' or 'light'
    sidebarCollapsed: false     // Sidebar expand/collapse state
};

// Private state
let state = { ...INITIAL_STATE };

// Subscribers: Map<id, callback>
const subscribers = new Map();
let nextId = 1;

/**
 * @function registerStateSlice
 * @purpose Register a feature's state slice - extension point for locked state.js
 * @param {string} name - Unique slice name (e.g., 'incidents', 'chat')
 * @param {Object} initialState - Initial state for this slice
 * @param {Object} setterDefs - Object of setter functions { name: (state, payload) => newState }
 * @returns {Object} { get[Name], set[Name], ... } - Getter and wrapped setters
 * @example
 *   const { getIncidents, setIncidents, setLoading } = registerStateSlice('incidents', 
 *     { items: [], loading: false },
 *     { setIncidents: (s, items) => ({...s, items}), setLoading: (s, v) => ({...s, loading: v}) }
 *   );
 */
export function registerStateSlice(name, initialState, setterDefs = {}) {
    // Check for collision
    if (slices[name]) {
        warn(`State slice '${name}' already registered, returning existing`);
        return slices[name].api;
    }
    
    // Initialize slice state
    slices[name] = {
        state: { ...initialState },
        api: {}
    };
    
    // Create getter
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
    const getterName = `get${capitalize(name)}`;
    slices[name].api[getterName] = () => ({ ...slices[name].state });
    
    // Create wrapped setters that notify subscribers
    Object.entries(setterDefs).forEach(([setterName, setterFn]) => {
        slices[name].api[setterName] = (payload) => {
            debug(`Slice ${name}: ${setterName}`, { payload });
            slices[name].state = setterFn(slices[name].state, payload);
            notifySubscribers(`${name}.${setterName}`);
        };
    });
    
    debug(`State slice registered: ${name}`, { keys: Object.keys(slices[name].state) });
    return slices[name].api;
}

// =============================================================================
// GETTERS
// =============================================================================

/**
 * @function getState
 * @purpose Get entire state or specific key
 * @param {string} key - Optional specific key to get
 * @returns {any} State value
 */
export function getState(key = null) {
    if (key === null) {
        // Return core state merged with all slice states
        const allState = { ...state };
        Object.entries(slices).forEach(([name, slice]) => {
            allState[name] = { ...slice.state };
        });
        return allState;
    }
    
    // Check if key is a slice name
    if (slices[key]) {
        return { ...slices[key].state };
    }
    
    // Check if key is slice.property (e.g., 'incidents.items')
    if (key.includes('.')) {
        const [sliceName, ...propPath] = key.split('.');
        if (slices[sliceName]) {
            let value = slices[sliceName].state;
            for (const prop of propPath) {
                value = value?.[prop];
            }
            return value;
        }
    }
    
    // Fall back to core state
    return state[key];
}

// =============================================================================
// SETTERS
// =============================================================================

/**
 * @function setUser
 * @purpose Set authenticated user data
 * @param {Object|null} user - User object or null on logout
 */
export function setUser(user) {
    debug('State: setUser', { user: user?.email || null });
    state.user = user;
    notifySubscribers('setUser');
}

/**
 * @function setTheme
 * @purpose Set theme preference
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
        warn('Invalid theme value', { theme });
        return;
    }
    debug('State: setTheme', { theme });
    state.theme = theme;
    notifySubscribers('setTheme');
}

/**
 * @function setSidebarCollapsed
 * @purpose Set sidebar collapsed state
 * @param {boolean} collapsed - Whether sidebar is collapsed
 */
export function setSidebarCollapsed(collapsed) {
    debug('State: setSidebarCollapsed', { collapsed });
    state.sidebarCollapsed = Boolean(collapsed);
    notifySubscribers('setSidebarCollapsed');
}

// =============================================================================
// SUBSCRIPTION
// =============================================================================

/**
 * @function subscribe
 * @purpose Register callback for state changes
 * @param {Function} callback - Called with (state, source) on change
 * @returns {number} Subscription ID
 */
export function subscribe(callback) {
    if (typeof callback !== 'function') {
        warn('Subscribe requires function');
        return null;
    }
    const id = nextId++;
    subscribers.set(id, callback);
    debug('State subscriber added', { id });
    return id;
}

/**
 * @function unsubscribe
 * @purpose Remove subscription
 * @param {number} id - Subscription ID from subscribe()
 * @returns {boolean} True if removed
 */
export function unsubscribe(id) {
    const removed = subscribers.delete(id);
    if (removed) {
        debug('State subscriber removed', { id });
    }
    return removed;
}

/**
 * @function notifySubscribers
 * @purpose Notify all subscribers of state change
 * @param {string} source - What triggered the change
 */
function notifySubscribers(source) {
    const currentState = getState();
    subscribers.forEach((callback, id) => {
        try {
            callback(currentState, source);
        } catch (err) {
            warn('Subscriber error', { id, error: err.message });
        }
    });
}

// =============================================================================
// RESET
// =============================================================================

/**
 * @function reset
 * @purpose Reset state to initial values (for logout)
 */
export function reset() {
    info('State reset');
    state = { ...INITIAL_STATE };
    notifySubscribers('reset');
}
