/**
 * @file chat-panel-ui.js
 * @purpose Chat panel component - conversational interface with AI agent
 * @layer ui
 * @dependencies [state.js, dashboard-service.js, logger.js]
 * @dependents [app.js]
 * @locked false
 * @modifyImpact [chat interface display and interaction]
 */

import { getState, subscribe } from '../../../core/state.js';
import { sendAgentMessage } from '../../../features/dashboard/dashboard-service.js';
import { debug } from '../../../core/logger.js';

// Module contract
export const MODULE_CONTRACT = {
    provides: ['initChatPanel', 'renderChatPanel'],
    requires: ['state.js', 'dashboard-service.js', 'logger.js']
};

// DOM references
let chatPanelEl = null;
let messagesEl = null;
let inputEl = null;

/**
 * @function initChatPanel
 * @purpose Initialize chat panel component
 * @returns {void}
 * @impacts [chat panel is rendered and interactive]
 * @sideEffects [subscribes to state, attaches event listeners]
 */
export function initChatPanel() {
    debug('Initializing chat panel');

    const container = document.getElementById('main-content');
    if (!container) return;

    // Create chat panel container
    chatPanelEl = document.createElement('div');
    chatPanelEl.className = 'chat-panel card';
    chatPanelEl.id = 'chat-panel';

    container.querySelector('.app-main__container').appendChild(chatPanelEl);

    // Initial render
    renderChatPanel();

    // Subscribe to chat state changes
    subscribe((state, source) => {
        if (source.includes('chat')) {
            renderMessages();
        }
    });
}

/**
 * @function renderChatPanel
 * @purpose Render the complete chat panel structure
 * @returns {void}
 * @impacts [chat panel DOM is created]
 * @sideEffects [modifies chatPanelEl innerHTML, attaches event listeners]
 */
export function renderChatPanel() {
    if (!chatPanelEl) return;

    chatPanelEl.innerHTML = `
    <div class="chat-panel__header">
      <div class="chat-panel__title">
        <span class="chat-panel__icon">🤖</span>
        <span>AI Assistant</span>
      </div>
      <div class="chat-panel__status">
        <span class="chat-panel__status-dot"></span>
        <span>Online</span>
      </div>
    </div>
    <div class="chat-panel__messages" id="chat-messages">
      <div class="chat-message chat-message--agent">
        <div class="chat-message__content">
          Hello! I'm your AI assistant. How can I help you today?
        </div>
      </div>
    </div>
    <div class="chat-panel__input-area">
      <input type="text" 
             class="chat-panel__input" 
             id="chat-input"
             placeholder="Type a message..."
             autocomplete="off">
      <button class="btn btn-primary chat-panel__send" id="chat-send">
        Send
      </button>
    </div>
  `;

    // Cache DOM references
    messagesEl = document.getElementById('chat-messages');
    inputEl = document.getElementById('chat-input');

    // Set up event listeners
    const sendBtn = document.getElementById('chat-send');
    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keypress', handleKeyPress);

    debug('Chat panel rendered');
}

/**
 * @function renderMessages
 * @purpose Render chat messages from state
 * @returns {void}
 * @impacts [messages DOM is updated]
 * @sideEffects [modifies messagesEl innerHTML]
 */
function renderMessages() {
    if (!messagesEl) return;

    const state = getState();
    const messages = state.chat.messages || [];
    const isTyping = state.chat.isAgentTyping;

    // Generate message HTML
    let html = messages.map(msg => `
    <div class="chat-message chat-message--${msg.role}">
      <div class="chat-message__content">
        ${msg.content}
      </div>
      <div class="chat-message__time">
        ${formatTime(msg.timestamp)}
      </div>
    </div>
  `).join('');

    // Add typing indicator if agent is typing
    if (isTyping) {
        html += `
      <div class="chat-message chat-message--agent chat-message--typing">
        <div class="chat-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    }

    // Prepend the welcome message if no messages
    if (messages.length === 0) {
        html = `
      <div class="chat-message chat-message--agent">
        <div class="chat-message__content">
          Hello! I'm your AI assistant. How can I help you today?
        </div>
      </div>
    `;
    }

    messagesEl.innerHTML = html;

    // Scroll to bottom
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

/**
 * @function handleSend
 * @purpose Handle send button click
 * @returns {void}
 * @impacts [message is sent to agent]
 * @sideEffects [calls sendAgentMessage, clears input]
 */
async function handleSend() {
    const message = inputEl.value.trim();
    if (!message) return;

    inputEl.value = '';
    inputEl.focus();

    await sendAgentMessage(message);
}

/**
 * @function handleKeyPress
 * @purpose Handle enter key in input
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {void}
 * @impacts [may trigger send]
 * @sideEffects [may call handleSend]
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        handleSend();
    }
}

/**
 * @function formatTime
 * @purpose Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time
 * @impacts [none - pure function]
 * @sideEffects [none]
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
