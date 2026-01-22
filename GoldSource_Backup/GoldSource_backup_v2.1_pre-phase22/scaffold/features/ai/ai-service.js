/**
 * @file ai-service.js
 * @purpose Unified AI provider interface - Gemini and Claude support
 * @layer feature
 * @dependencies [logger.js]
 * @dependents [future chat components]
 * @locked false
 * @modifyImpact [AI integration]
 * 
 * NOTE: This is the SERVICE INTERFACE ONLY. Not wired to UI yet.
 * Future Factory runs will add chat UI that uses this service.
 */

import { info, error as logError, warn } from '../../core/logger.js';

// =============================================================================
// MODULE CONTRACT
// =============================================================================

export const MODULE_CONTRACT = {
    provides: ['askAI', 'askGemini', 'askClaude', 'getAPIKeys', 'setAPIKeys'],
    requires: ['logger.js']
};

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'nexus-ai-keys';

const ENDPOINTS = {
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    claude: 'https://api.anthropic.com/v1/messages'
};

// =============================================================================
// API KEY MANAGEMENT
// =============================================================================

/**
 * @function getAPIKeys
 * @purpose Get stored API keys from localStorage
 * @returns {Object} { gemini: string|null, claude: string|null }
 */
export function getAPIKeys() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : { gemini: null, claude: null };
    } catch {
        return { gemini: null, claude: null };
    }
}

/**
 * @function setAPIKeys
 * @purpose Store API keys in localStorage
 * @param {Object} keys - { gemini?: string, claude?: string }
 */
export function setAPIKeys(keys) {
    const current = getAPIKeys();
    const updated = { ...current, ...keys };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    info('AI: API keys updated');
}

// =============================================================================
// UNIFIED INTERFACE
// =============================================================================

/**
 * @function askAI
 * @purpose Unified AI query interface
 * @param {string} prompt - User prompt
 * @param {string} provider - 'gemini' or 'claude' (default: 'gemini')
 * @returns {Promise<string>} AI response
 */
export async function askAI(prompt, provider = 'gemini') {
    info('AI: Query', { provider, promptLength: prompt.length });

    if (provider === 'claude') {
        return askClaude(prompt);
    }
    return askGemini(prompt);
}

// =============================================================================
// GEMINI
// =============================================================================

/**
 * @function askGemini
 * @purpose Query Google Gemini API
 * @param {string} prompt - User prompt
 * @returns {Promise<string>} AI response
 */
export async function askGemini(prompt) {
    const keys = getAPIKeys();

    if (!keys.gemini) {
        warn('AI: No Gemini API key configured');
        throw new Error('Gemini API key not configured. Add via setAPIKeys().');
    }

    try {
        const response = await fetch(`${ENDPOINTS.gemini}?key=${keys.gemini}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        info('AI: Gemini response received', { length: text.length });
        return text;

    } catch (err) {
        logError('AI: Gemini request failed', { error: err.message });
        throw err;
    }
}

// =============================================================================
// CLAUDE
// =============================================================================

/**
 * @function askClaude
 * @purpose Query Anthropic Claude API
 * @param {string} prompt - User prompt
 * @returns {Promise<string>} AI response
 */
export async function askClaude(prompt) {
    const keys = getAPIKeys();

    if (!keys.claude) {
        warn('AI: No Claude API key configured');
        throw new Error('Claude API key not configured. Add via setAPIKeys().');
    }

    try {
        const response = await fetch(ENDPOINTS.claude, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': keys.claude,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.content?.[0]?.text || '';

        info('AI: Claude response received', { length: text.length });
        return text;

    } catch (err) {
        logError('AI: Claude request failed', { error: err.message });
        throw err;
    }
}
