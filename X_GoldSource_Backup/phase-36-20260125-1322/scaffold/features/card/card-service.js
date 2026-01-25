/**
 * @file card-service.js
 * @purpose Core business logic for Cards (DISCO-004)
 * @layer features
 * @dependencies [state.js, logger.js]
 * @dependents [nexus-card-ui.js, canvas-ui.js]
 * @spec SPEC-004
 */

import { registerStateSlice, getState } from '../../core/state.js';
import { info, debug } from '../../core/logger.js';

// =============================================================================
// STATE SLICE
// =============================================================================

const INITIAL_STATE = {
    items: [],      // Array of card objects
    loading: false,
    error: null
};

// Registered Actions
const { getCards, setItems, updateItem } = registerStateSlice('cards', INITIAL_STATE, {
    setItems: (state, items) => ({ ...state, items, loading: false }),
    updateItem: (state, updatedCard) => ({
        ...state,
        items: state.items.map(c => c.id === updatedCard.id ? updatedCard : c)
    }),
    setLoading: (state, loading) => ({ ...state, loading }),
    setError: (state, error) => ({ ...state, error, loading: false })
});

// Export getters/setters
export { getCards, setItems };

// =============================================================================
// BUSINESS LOGIC
// =============================================================================

/**
 * @function initCardService
 * @purpose Initialize service and load mock data
 */
export async function initCardService() {
    info('CardService: Initializing...');

    // Simulate API load
    setTimeout(() => {
        const mockData = generateMockCards();
        setItems(mockData);
        info('CardService: Loaded mock data', { count: mockData.length });

        // Emit initial event for badges
        broadcastCardUpdate();
    }, 500);
}

/**
 * @function moveCard
 * @purpose Move card to a new horizon
 * @param {string} cardId 
 * @param {string} targetHorizon (inbox, now, next, later, done)
 */
export function moveCard(cardId, targetHorizon) {
    const { items } = getCards();
    const card = items.find(c => c.id === cardId);

    if (!card) return;

    const updates = { ...card };

    // Logic from VISUAL-GUIDE.md
    if (targetHorizon === 'inbox') {
        updates.inbox = true;
        // State remains unchanged (e.g., keeps 'now' or 'next' status but reappears in inbox)
    } else {
        updates.state = targetHorizon;
        updates.inbox = false;
    }

    updateItem(updates);
    info(`CardService: Moved card ${cardId} to ${targetHorizon}`);

    broadcastCardUpdate();
}

/**
 * @function moveCardRelative
 * @purpose Move card relative to another (for DnD reordering)
 * @param {string} cardId 
 * @param {string} targetId 
 * @param {string} position - 'before' or 'after'
 */
export function moveCardRelative(cardId, targetId, position) {
    const { items } = getCards();
    const cardIndex = items.findIndex(c => c.id === cardId);
    const targetIndex = items.findIndex(c => c.id === targetId);

    if (cardIndex === -1 || targetIndex === -1) return;

    const newItems = [...items];
    const [card] = newItems.splice(cardIndex, 1);

    // Re-calculate target index because splice might have shifted it
    const newTargetIndex = newItems.findIndex(c => c.id === targetId);

    if (position === 'before') {
        newItems.splice(newTargetIndex, 0, card);
    } else {
        newItems.splice(newTargetIndex + 1, 0, card);
    }

    // Update state directly
    setItems(newItems);

    // Also update horizon if they were different (implicit in DnD usually)
    // For now we assume they are in same horizon or handled by logic

    info(`CardService: Moved card ${cardId} ${position} ${targetId}`);
}

/**
 * @function broadcastCardUpdate
 * @purpose Notify system of card changes (for badges)
 */
function broadcastCardUpdate() {
    window.dispatchEvent(new CustomEvent('card-update', {
        detail: {
            stats: getCardStats()
        }
    }));
}

/**
 * @function getCardStats
 * @purpose Calculate counts and priorities for badges
 */
export function getCardStats() {
    const { items } = getCards();

    const stats = {
        total: items.length,
        horizons: {}
    };

    ['inbox', 'now', 'next', 'later', 'done', 'all'].forEach(h => {
        let filtered = [];
        if (h === 'inbox') filtered = items.filter(c => c.inbox);
        else if (h === 'all') filtered = items;
        else filtered = items.filter(c => c.state === h);

        // Calculate counts
        const p1Count = filtered.filter(c => c.content.tags.includes('P1')).length;
        const p2Count = filtered.filter(c => c.content.tags.includes('P2')).length;
        const p3Count = filtered.length - p1Count - p2Count;

        // Calculate max priority score (0-1)
        const maxScore = filtered.reduce((max, c) => Math.max(max, c.ai_meta?.importance_score || 0), 0);

        stats.horizons[h] = {
            count: filtered.length,
            p1: p1Count,
            p2: p2Count,
            p3: p3Count,
            maxScore,
            urgent: maxScore > 0.8,
            warning: maxScore > 0.5 && maxScore <= 0.8
        };
    });

    return stats;
}

// =============================================================================
// MOCK DATA GENERATOR
// =============================================================================

function generateMockCards() {
    return [
        {
            id: 'c-101',
            state: 'now',
            inbox: false,
            content: { title: 'Production Incident: DB Latency', summary: 'P1 incident regarding high latency in us-east-1.', tags: ['P1', 'Incident'] },
            ai_meta: { importance_score: 0.95 }, // Urgent
            visuals: { size: 'large', accent: 'red' },
            status: { last_sync: Date.now(), unread_count: 2 }
        },
        {
            id: 'c-102',
            state: 'now',
            inbox: false,
            content: { title: 'Q4 Roadmap Review', summary: 'Prepare slides for executive review.', tags: ['Task'] },
            ai_meta: { importance_score: 0.6 }, // Warning
            visuals: { size: 'medium', accent: 'amber' },
            status: { last_sync: Date.now(), unread_count: 0 }
        },
        {
            id: 'c-103',
            state: 'next',
            inbox: true,
            content: { title: 'Update documentation', summary: 'Reflect API changes in docs.', tags: ['Docs'] },
            ai_meta: { importance_score: 0.2 }, // Neutral
            visuals: { size: 'compact', accent: 'none' },
            status: { last_sync: Date.now(), unread_count: 0 }
        },
        {
            id: 'c-104',
            state: 'later',
            inbox: false,
            content: { title: 'Refactor Auth Service', summary: '', tags: ['Tech Debt'] },
            ai_meta: { importance_score: 0.4 },
            visuals: { size: 'compact', accent: 'none' },
            status: { last_sync: Date.now(), unread_count: 0 }
        },
        {
            id: 'c-105',
            state: 'next',
            inbox: false,
            content: { title: 'Design System Audit', summary: 'Check accessibility compliance.', tags: ['Design'] },
            ai_meta: { importance_score: 0.5 },
            visuals: { size: 'medium', accent: 'none' },
            status: { last_sync: Date.now(), unread_count: 1 }
        }
    ];
}
