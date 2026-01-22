/**
 * @file error-handler.js
 * @purpose Centralized error handling framework with consistent error management
 * @layer core
 * @dependencies [logger.js]
 * @dependents [app.js, all service and UI modules]
 * @locked true
 * @modifyImpact [all error handling behavior across application]
 */

import { error as logError, warn } from './logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['handleError', 'createError', 'ERROR_TYPES'],
    requires: ['logger.js']
};

/**
 * @constant ERROR_TYPES
 * @purpose Define categorized error types for consistent handling
 */
export const ERROR_TYPES = {
    VALIDATION: 'VALIDATION',
    STATE: 'STATE',
    RENDER: 'RENDER',
    NETWORK: 'NETWORK',
    UNKNOWN: 'UNKNOWN'
};

/**
 * @function createError
 * @purpose Create a structured error object with type and context
 * @param {string} type - Error type from ERROR_TYPES
 * @param {string} message - Human-readable error message
 * @param {Object} context - Additional error context
 * @returns {Object} Structured error object
 * @impacts [none - pure function]
 * @sideEffects [none]
 */
export function createError(type, message, context = {}) {
    return {
        type: ERROR_TYPES[type] || ERROR_TYPES.UNKNOWN,
        message,
        context,
        timestamp: new Date().toISOString()
    };
}

/**
 * @function handleError
 * @purpose Process an error with logging and optional recovery
 * @param {Error|Object} error - Error to handle
 * @param {Object} options - Handling options
 * @param {boolean} options.silent - If true, don't show user notification
 * @param {Function} options.recover - Recovery function to call
 * @returns {void}
 * @impacts [logs error, may trigger recovery, may show notification]
 * @sideEffects [writes to console via logger, may call recovery function]
 */
export function handleError(error, options = {}) {
    const { silent = false, recover = null } = options;

    // Normalize error to structured format
    const structuredError = error.type
        ? error
        : createError('UNKNOWN', error.message || String(error), { originalError: error });

    // Log the error
    logError(`[${structuredError.type}] ${structuredError.message}`, structuredError.context);

    // Attempt recovery if provided
    if (recover && typeof recover === 'function') {
        try {
            warn('Attempting error recovery...', { errorType: structuredError.type });
            recover(structuredError);
        } catch (recoveryError) {
            logError('Recovery failed', { originalError: structuredError, recoveryError: recoveryError.message });
        }
    }

    // Show user notification if not silent
    if (!silent) {
        showErrorNotification(structuredError);
    }
}

/**
 * @function showErrorNotification
 * @purpose Display error notification to user (placeholder for future implementation)
 * @param {Object} error - Structured error object
 * @returns {void}
 * @impacts [user sees error notification]
 * @sideEffects [may update DOM with notification element]
 */
function showErrorNotification(error) {
    // TODO: Implement user-facing error notification
    // For prototype, log to console
    console.error('User notification:', error.message);
}

/**
 * @function wrapAsync
 * @purpose Wrap async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function with error handling
 * @impacts [wrapped function will have automatic error handling]
 * @sideEffects [none - returns new function]
 */
export function wrapAsync(fn, options = {}) {
    return async function (...args) {
        try {
            return await fn.apply(this, args);
        } catch (error) {
            handleError(error, options);
            return null;
        }
    };
}
