/**
 * @file dashboard-service.js
 * @purpose Dashboard business logic - data loading, transformations, AI interactions
 * @layer feature
 * @dependencies [state.js, mock-data.js, logger.js]
 * @dependents [chat-panel-ui.js, data-cards-ui.js, action-buttons-ui.js]
 * @locked false
 * @modifyImpact [dashboard data display, AI agent responses]
 */

import { getState, updateState } from '../../core/state.js';
import { getMockTasks, getMockMetrics, getMockNotifications, simulateAgentResponse } from '../../core/mock-data.js';
import { debug, info } from '../../core/logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['loadDashboardData', 'sendAgentMessage', 'executeAction', 'getTasksByStatus'],
    requires: ['state.js', 'mock-data.js', 'logger.js']
};

/**
 * @function loadDashboardData
 * @purpose Load all dashboard data into state
 * @returns {Promise<void>}
 * @impacts [dashboard state is populated with data]
 * @sideEffects [updates state with tasks, metrics, notifications]
 */
export async function loadDashboardData() {
    debug('Loading dashboard data');

    const tasks = getMockTasks();
    const metrics = getMockMetrics();
    const notifications = getMockNotifications();

    updateState({
        dashboard: {
            tasks,
            metrics,
            notifications
        }
    }, 'dashboard.loadData');

    info('Dashboard data loaded', {
        taskCount: tasks.length,
        notificationCount: notifications.length
    });
}

/**
 * @function sendAgentMessage
 * @purpose Send a message to the AI agent and get response
 * @param {string} message - User's message to the agent
 * @returns {Promise<string>} Agent's response
 * @impacts [chat state updates with new messages]
 * @sideEffects [updates state with user message and agent response]
 */
export async function sendAgentMessage(message) {
    debug('Sending message to agent', { message });

    // Add user message to chat
    const userMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    };

    const currentMessages = getState('chat.messages') || [];

    // Update state with user message and set typing indicator
    updateState({
        chat: {
            messages: [...currentMessages, userMessage],
            isAgentTyping: true
        }
    }, 'dashboard.sendAgentMessage');

    // Get agent response
    const response = await simulateAgentResponse(message);

    // Add agent response to chat
    const agentMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'agent',
        content: response,
        timestamp: new Date().toISOString()
    };

    const updatedMessages = getState('chat.messages') || [];

    updateState({
        chat: {
            messages: [...updatedMessages, agentMessage],
            isAgentTyping: false
        }
    }, 'dashboard.agentResponse');

    info('Agent responded', { responseLength: response.length });

    return response;
}

/**
 * @function executeAction
 * @purpose Execute a quick action (e.g., create task, mark complete)
 * @param {string} actionId - ID of the action to execute
 * @param {Object} params - Action parameters
 * @returns {Promise<Object>} Action result
 * @impacts [state may change based on action]
 * @sideEffects [may update tasks, send notifications]
 */
export async function executeAction(actionId, params = {}) {
    debug('Executing action', { actionId, params });

    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 300));

    const results = {
        success: true,
        actionId,
        message: `Action "${actionId}" executed successfully`,
        timestamp: new Date().toISOString()
    };

    info('Action executed', results);

    return results;
}

/**
 * @function getTasksByStatus
 * @purpose Get tasks filtered by status
 * @param {string} status - Status to filter by (pending, in-progress, complete)
 * @returns {Array} Filtered tasks
 * @impacts [none - read only]
 * @sideEffects [none]
 */
export function getTasksByStatus(status) {
    const tasks = getState('dashboard.tasks') || [];
    return tasks.filter(task => task.status === status);
}

/**
 * @function getHighPriorityTasks
 * @purpose Get tasks marked as high priority
 * @returns {Array} High priority tasks
 * @impacts [none - read only]
 * @sideEffects [none]
 */
export function getHighPriorityTasks() {
    const tasks = getState('dashboard.tasks') || [];
    return tasks.filter(task => task.priority === 'high');
}

/**
 * @function getTasksWithAISuggestions
 * @purpose Get tasks that have AI suggestions
 * @returns {Array} Tasks with AI suggestions
 * @impacts [none - read only]
 * @sideEffects [none]
 */
export function getTasksWithAISuggestions() {
    const tasks = getState('dashboard.tasks') || [];
    return tasks.filter(task => task.aiSuggestion);
}
