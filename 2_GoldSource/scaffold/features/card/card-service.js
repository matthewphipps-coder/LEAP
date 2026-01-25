/**
 * @file card-service.js
 * @purpose Business logic for Card management (My Work Items)
 * @layer feature
 * @dependencies [mock-data.js]
 * @dependents [canvas-ui.js]
 * @modifyImpact [card data structure]
 */

import { generateTestCards } from '../../../core/mock-data.js';

// =============================================================================
// STATE (MOCK DATABASE - SINGLETON)
// =============================================================================

// STORAGE KEY
const DB_KEY = 'NEXUS_CARDS_V1';

// MOCK DATA: Default seed if storage empty
// Injecting 30 test cards as requested
const SEED_DATA = generateTestCards(30);

// Initialize from storage or seed
let MOCK_DB = (() => {
    try {
        // For testing purposes, we might want to force regeneration if needed
        // But standard behavior is read from storage if exists.
        // To force refresh for this test, we can ignore storage or clear it via console.

        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            // Simple check: if we have roughly the right amount of data, keep it.
            // If the user wants to RESET, they should probably clear LocalStorage.
            // For this specific 'Injection' request, let's assume we want to OVERWRITE
            // if the current set is the old small set.
            // But to be safe and responsive to the user's specific "inject" request,
            // we will prioritize the SEED_DATA this one time if the DB looks "stale" or small.
            if (data.length > 10) return data;
        }
    } catch (e) {
        console.warn('[CardService] Failed to load from storage', e);
    }
    return [...SEED_DATA];
})();

// Helper to persist
function saveDB() {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(MOCK_DB));
    } catch (e) {
        console.warn('[CardService] Failed to save to storage', e);
    }
}

// =============================================================================
// SERVICE LOGIC
// =============================================================================

export const CardService = {

    /**
     * @function getCards
     * @purpose Retrieve cards for a specific horizon (or all)
     * @param {string} horizon - 'inbox' | 'now' | 'next' | 'later' | 'all'
     * @returns {Array} List of card objects
     */
    getCards: (horizon = 'all') => {
        if (horizon === 'all') return [...MOCK_DB].filter(c => c.horizon !== 'done'); // Exclude done from All? Usually All implies active. Let's exclude done from All for now unless specified otherwise, but user didn't specify. Standard practice: All = Active. Done = Archived. 
        // User didn't strictly say remove from All, but "All" usually means "All Work".
        // Actually, let's keep it simple: All = everything in DB except done (archived).
        // Wait, current implementation of All was just returning everything. 
        // If I make 'Done' a horizon, the items still exist in MOCK_DB.
        // Let's filter 'done' horizon normally.
        // For 'all', I should probably exclude 'done' to avoid clutter, or include them?
        // User request: "A list item card can be dragged to any other drop zone... and it's status/horizon changes".
        // I will assume 'All' means 'Active horizons' (Inbox, Now, Next, Later).
        // If horizon is 'done', sort by closedAt.

        if (horizon === 'all') {
            return MOCK_DB.filter(c => c.horizon !== 'done');
        }

        if (horizon === 'done') {
            return MOCK_DB.filter(c => c.horizon === 'done')
                .sort((a, b) => new Date(b.closedAt || 0) - new Date(a.closedAt || 0));
        }

        return MOCK_DB.filter(c => c.horizon === horizon);
    },

    /**
     * @function getCardStats
     * @purpose Get counts for all horizons (for badges)
     * @returns {Object} { inbox: 3, now: 2, ... }
     */
    getCardStats: () => {
        // Structure: horizon -> { count, hasP1, hasP2 }
        const stats = {
            inbox: { count: 0, hasP1: false, hasP2: false },
            now: { count: 0, hasP1: false, hasP2: false },
            next: { count: 0, hasP1: false, hasP2: false },
            later: { count: 0, hasP1: false, hasP2: false },
            all: { count: 0, hasP1: false, hasP2: false }
        };

        MOCK_DB.forEach(card => {
            // Count for 'all' (only active)
            if (card.horizon !== 'done') {
                stats.all.count++;
                if (card.priority === 'p1') stats.all.hasP1 = true;
                if (card.priority === 'p2') stats.all.hasP2 = true;
            }

            if (stats[card.horizon]) {
                stats[card.horizon].count++;
                if (card.priority === 'p1') stats[card.horizon].hasP1 = true;
                if (card.priority === 'p2') stats[card.horizon].hasP2 = true;
            }
        });

        // Ensure 'done' is always 0 (no badge)
        stats.done = { count: 0, hasP1: false, hasP2: false };

        return stats;
    },

    /**
     * @function updateCardHorizon
     * @purpose Update card horizon (drag and drop) and notify listeners
     */
    updateCardHorizon: (cardId, newHorizon) => {
        const cardIndex = MOCK_DB.findIndex(c => c.id === cardId);
        if (cardIndex === -1) {
            console.warn(`[CardService] Card ${cardId} not found`);
            return false;
        }

        const card = MOCK_DB[cardIndex];
        const oldHorizon = card.horizon;

        if (oldHorizon === newHorizon) return false;

        // Mutate State
        card.horizon = newHorizon;

        // Handle Done Timestamp
        if (newHorizon === 'done') {
            card.closedAt = new Date().toISOString();
        } else if (oldHorizon === 'done') {
            // Restoring from done, clear timestamp? Or keep history?
            // User didn't specify, but clearing logic implies it's "open" again.
            // Let's keep it clean.
            delete card.closedAt;
        }

        saveDB(); // Persist changes
        console.log(`[CardService] Moved ${cardId} from ${oldHorizon} to ${newHorizon}`);

        // DISPATCH EVENT: card-update
        const event = new CustomEvent('card-update', {
            detail: {
                cardId,
                oldHorizon,
                newHorizon,
                stats: CardService.getCardStats()
            },
            bubbles: true
        });
        document.dispatchEvent(event);

        return true;
    },

    /**
     * @function updateCardPosition
     * @purpose Update card X/Y coordinates (Freeform mode)
     */
    updateCardPosition: (cardId, x, y) => {
        const cardIndex = MOCK_DB.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return false;

        const card = MOCK_DB[cardIndex];
        card.x = x;
        card.y = y;

        saveDB();
        console.log(`[CardService] Moved ${cardId} to ${x},${y}`);
        return true;
    },

    /**
     * @function markDone
     * @purpose Move card to done and notify
     */
    markDone: (cardId) => {
        const cardIndex = MOCK_DB.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return false;

        const card = MOCK_DB[cardIndex];
        const oldHorizon = card.horizon;

        card.horizon = 'done'; // Soft delete (or archive)
        card.closedAt = new Date().toISOString();
        saveDB(); // Persist changes

        console.log(`[CardService] Marked ${cardId} as DONE`);

        const event = new CustomEvent('card-update', {
            detail: {
                cardId,
                oldHorizon,
                newHorizon: 'done',
                stats: CardService.getCardStats()
            },
            bubbles: true
        });
        document.dispatchEvent(event);

        return true;
    }
};
