/**
 * @file mock-data.js
 * @purpose Provide mock data patterns for prototype demos without real backend
 * @layer core
 * @dependencies [logger.js]
 * @dependents [dashboard-service.js]
 * @locked false
 * @modifyImpact [all components displaying mock data]
 */

import { debug } from './logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['getMockTasks', 'getMockMetrics', 'getMockNotifications', 'simulateAgentResponse'],
    // ... existing exports
    requires: ['logger.js']
};

// =============================================================================
// TEST DATA GENERATOR
// =============================================================================

const TITLES = [
    "Review Q4 Budget", "Update Security Policy", "Fix Login Bug", "Client Meeting Prep",
    "Database Migration", "API Documentation", "User Research Interviews", "Design System Audit",
    "Performance Optimization", "Accessibility Review", "Cloud Infrastructure Audit",
    "Kubernetes Cluster Upgrade", "Mobile App Beta Testing", "Customer Support Ticket Analysis",
    "Sales Pipeline Review", "Marketing Campaign Launch", "Quarterly Business Review Prep",
    "Employee Onboarding Flow", "GDPR Compliance Check", "Legacy Code Refactoring",
    "Feature Flag Cleanup", "CI/CD Pipeline Improvements", "Zero Trust Architecture Plan",
    "Data Lake Storage Optimization", "Machine Learning Model Training", "End-to-End Testing Suite",
    "Chaos Engineering Drill", "Incident Response Playbook Update", "Vendor Contract Renewal",
    "Team Building Event Planning"
];

const SUMMARIES = [
    "Needs urgent attention.",
    "Blocked by external dependency.",
    "Review comments from the team before merging.",
    "Pending final approval from legal.",
    "Customer reported critical issue in production. Needs immediate fix.",
    "Draft initial scope and timeline.",
    "",
    "See attached document for details."
];

const TYPES = ['task', 'incident', 'report'];
const HORIZONS = ['now', 'next', 'inbox', 'later'];
const PRIORITIES = ['p1', 'p2', 'p3'];
const SIZES = ['small', 'medium', 'large'];

/**
 * @function generateTestCards
 * @purpose Generate randomized test cards
 * @param {number} count - Number of cards to generate
 * @returns {Array} Array of card objects
 */
export function generateTestCards(count = 30) {
    const cards = [];

    for (let i = 0; i < count; i++) {
        const type = TYPES[Math.floor(Math.random() * TYPES.length)];
        const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];

        cards.push({
            id: `TEST-${1000 + i}`,
            title: TITLES[i % TITLES.length] + (i > TITLES.length ? ` ${i}` : ''),
            type: type,
            horizon: HORIZONS[Math.floor(Math.random() * HORIZONS.length)],
            priority: priority,
            size: SIZES[Math.floor(Math.random() * SIZES.length)],
            updates: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
            animate: Math.random() > 0.8,
            meta: `${type.toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
            summary: SUMMARIES[Math.floor(Math.random() * SUMMARIES.length)],
            timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`
        });
    }

    return cards;
}

/**
 * @constant MOCK_TASKS
// ... existing MOCK_TASKS ...
const MOCK_TASKS = [
    {
        id: 'TASK-001',
        title: 'Review Q4 Budget Proposal',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Demo User',
        dueDate: '2026-01-20',
        aiSuggestion: 'This task is time-sensitive. Consider prioritizing today.'
    },
    {
        id: 'TASK-002',
        title: 'Update Security Policies',
        status: 'pending',
        priority: 'medium',
        assignee: 'Demo User',
        dueDate: '2026-01-25',
        aiSuggestion: 'Related documentation was updated yesterday. Review changes.'
    },
    {
        id: 'TASK-003',
        title: 'Complete Training Module',
        status: 'complete',
        priority: 'low',
        assignee: 'Demo User',
        dueDate: '2026-01-18',
        aiSuggestion: null
    }
];

/**
 * @constant MOCK_METRICS
 * @purpose Sample metrics data for dashboard cards
 */
const MOCK_METRICS = {
    tasksCompleted: 12,
    tasksPending: 5,
    tasksOverdue: 1,
    avgCompletionTime: '2.3 days',
    aiAssistRate: '78%'
};

/**
 * @constant MOCK_NOTIFICATIONS
 * @purpose Sample notification data
 */
const MOCK_NOTIFICATIONS = [
    {
        id: 'NOTIF-001',
        type: 'info',
        message: 'Your weekly summary is ready',
        timestamp: '2026-01-19T08:00:00Z',
        read: false
    },
    {
        id: 'NOTIF-002',
        type: 'alert',
        message: 'Task TASK-001 is due tomorrow',
        timestamp: '2026-01-19T09:30:00Z',
        read: false
    }
];

/**
 * @constant AGENT_RESPONSES
 * @purpose Pre-defined agent responses for chat simulation
 */
const AGENT_RESPONSES = [
    "I've analyzed your current workload. You have 5 pending tasks, with 1 marked as high priority.",
    "Based on your schedule, I recommend focusing on 'Review Q4 Budget Proposal' first.",
    "I can help you with that. What specific information do you need?",
    "I've found 3 related documents that might help with this task.",
    "Your task has been created and added to your queue."
];

/**
 * @function getMockTasks
 * @purpose Retrieve mock task data
 * @param {Object} filters - Optional filters (status, priority)
 * @returns {Array} Array of task objects
 * @impacts [none - read only]
 * @sideEffects [none]
 */
export function getMockTasks(filters = {}) {
    debug('Getting mock tasks', { filters });

    let tasks = [...MOCK_TASKS];

    if (filters.status) {
        tasks = tasks.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
        tasks = tasks.filter(t => t.priority === filters.priority);
    }

    return tasks;
}

/**
 * @function getMockMetrics
 * @purpose Retrieve mock metrics data
 * @returns {Object} Metrics object
 * @impacts [none - read only]
 * @sideEffects [none]
 */
export function getMockMetrics() {
    debug('Getting mock metrics');
    return { ...MOCK_METRICS };
}

/**
 * @function getMockNotifications
 * @purpose Retrieve mock notification data
 * @param {boolean} unreadOnly - If true, return only unread notifications
 * @returns {Array} Array of notification objects
 * @impacts [none - read only]
 * @sideEffects [none]
 */
export function getMockNotifications(unreadOnly = false) {
    debug('Getting mock notifications', { unreadOnly });

    if (unreadOnly) {
        return MOCK_NOTIFICATIONS.filter(n => !n.read);
    }

    return [...MOCK_NOTIFICATIONS];
}

/**
 * @function simulateAgentResponse
 * @purpose Generate a simulated AI agent response with delay
 * @param {string} userMessage - The user's input message
 * @returns {Promise<string>} Agent response after simulated delay
 * @impacts [chat UI will update with response]
 * @sideEffects [none - returns promise]
 */
export async function simulateAgentResponse(userMessage) {
    debug('Simulating agent response', { userMessage });

    // Simulate thinking delay (500-1500ms)
    const delay = 500 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Select a contextually-appropriate response (simplified for prototype)
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('task') || lowerMessage.includes('work')) {
        return AGENT_RESPONSES[0];
    } else if (lowerMessage.includes('priority') || lowerMessage.includes('focus')) {
        return AGENT_RESPONSES[1];
    } else if (lowerMessage.includes('help')) {
        return AGENT_RESPONSES[2];
    } else if (lowerMessage.includes('document') || lowerMessage.includes('find')) {
        return AGENT_RESPONSES[3];
    } else {
        return AGENT_RESPONSES[Math.floor(Math.random() * AGENT_RESPONSES.length)];
    }
}
