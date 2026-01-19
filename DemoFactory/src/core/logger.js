/**
 * @file logger.js
 * @purpose Centralized logging with structured output for debugging and audit
 * @layer core
 * @dependencies []
 * @dependents [app.js, state.js, error-handler.js, all service and UI modules]
 * @locked true
 * @modifyImpact [all logging output across application]
 */

// Module contract
export const MODULE_CONTRACT = {
  provides: ['log', 'info', 'warn', 'error', 'debug', 'LOG_LEVELS'],
  requires: []
};

/**
 * @constant LOG_LEVELS
 * @purpose Define available log levels for filtering
 */
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Current log level - can be changed for filtering
let currentLogLevel = LOG_LEVELS.DEBUG;

/**
 * @function formatMessage
 * @purpose Create consistent log message format with timestamp and context
 * @param {string} level - Log level name
 * @param {string} message - Message to log
 * @param {Object} context - Additional context data
 * @returns {string} Formatted log message
 * @impacts [none - pure function]
 * @sideEffects [none]
 */
function formatMessage(level, message, context = {}) {
  const timestamp = new Date().toISOString();
  const contextStr = Object.keys(context).length > 0 
    ? ` | ${JSON.stringify(context)}` 
    : '';
  return `[${timestamp}] [${level}] ${message}${contextStr}`;
}

/**
 * @function log
 * @purpose Generic log function with level specification
 * @param {number} level - Log level from LOG_LEVELS
 * @param {string} message - Message to log
 * @param {Object} context - Additional context
 * @returns {void}
 * @impacts [console output]
 * @sideEffects [writes to browser console]
 */
export function log(level, message, context = {}) {
  if (level < currentLogLevel) return;
  
  const formatted = formatMessage(
    Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level) || 'LOG',
    message,
    context
  );
  
  console.log(formatted);
}

/**
 * @function debug
 * @purpose Log debug-level message
 * @param {string} message - Message to log
 * @param {Object} context - Additional context
 * @returns {void}
 * @impacts [console output at DEBUG level]
 * @sideEffects [writes to browser console]
 */
export function debug(message, context = {}) {
  log(LOG_LEVELS.DEBUG, message, context);
}

/**
 * @function info
 * @purpose Log info-level message
 * @param {string} message - Message to log
 * @param {Object} context - Additional context
 * @returns {void}
 * @impacts [console output at INFO level]
 * @sideEffects [writes to browser console]
 */
export function info(message, context = {}) {
  log(LOG_LEVELS.INFO, message, context);
}

/**
 * @function warn
 * @purpose Log warning-level message
 * @param {string} message - Message to log
 * @param {Object} context - Additional context
 * @returns {void}
 * @impacts [console output at WARN level]
 * @sideEffects [writes to browser console]
 */
export function warn(message, context = {}) {
  log(LOG_LEVELS.WARN, message, context);
}

/**
 * @function error
 * @purpose Log error-level message
 * @param {string} message - Message to log
 * @param {Object} context - Additional context
 * @returns {void}
 * @impacts [console output at ERROR level]
 * @sideEffects [writes to browser console]
 */
export function error(message, context = {}) {
  log(LOG_LEVELS.ERROR, message, context);
}

/**
 * @function setLogLevel
 * @purpose Change the minimum log level for filtering
 * @param {number} level - New minimum log level
 * @returns {void}
 * @impacts [changes which messages appear in console]
 * @sideEffects [modifies module-level currentLogLevel]
 */
export function setLogLevel(level) {
  currentLogLevel = level;
}
