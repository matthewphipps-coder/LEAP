/**
 * @file card-service.js
 * @purpose Business logic for Card management (My Work Items)
 * @layer feature
 * @dependencies []
 * @dependents [canvas-ui.js]
 * @modifyImpact [card data structure]
 */

export const CardService = {

    /**
     * @function getCards
     * @purpose Retrieve cards for a specific horizon (or all)
     * @param {string} horizon - 'inbox' | 'now' | 'next' | 'later' | 'all'
     * @returns {Array} List of card objects
     */
    getCards: (horizon = 'all') => {
        // MOCK DATA: Matching SPEC-004-prototype.html
        const allCards = [
            // NOW Horizon
            {
                id: 'c-101',
                title: 'Review Quarterly Reports',
                type: 'task',
                horizon: 'now',
                priority: 'p1',
                size: 'medium',
                updates: 3,
                animate: true,
                meta: 'FINANCE-2024',
                summary: 'Final review needed for Q4 financial statements before board meeting.',
                timestamp: '2h ago'
            },
            {
                id: 'c-102',
                title: 'Server Outage Analysis',
                type: 'incident',
                horizon: 'now',
                priority: 'p1',
                size: 'small',
                updates: 0,
                animate: false,
                meta: 'INC-9942',
                summary: 'Root cause analysis for yesterday\'s downtime.',
                timestamp: '4h ago'
            },

            // NEXT Horizon
            {
                id: 'c-201',
                title: 'Update User Permissions',
                type: 'task',
                horizon: 'next',
                priority: 'p2',
                size: 'small',
                updates: 1,
                animate: false,
                meta: 'ADMIN-001',
                summary: 'Implement new RBAC roles.',
                timestamp: '1d ago'
            },
            {
                id: 'c-202',
                title: 'Design System Migration',
                type: 'task',
                horizon: 'next',
                priority: 'p2',
                size: 'large',
                updates: 5,
                animate: false,
                meta: 'UI-KIT-V2',
                summary: 'Migration guide for button components needs review. Check breaking changes list.',
                timestamp: '1d ago'
            },

            // INBOX Horizon
            {
                id: 'c-301',
                title: 'New Feature Request',
                type: 'task',
                horizon: 'inbox',
                priority: 'p3',
                size: 'small',
                updates: 0,
                animate: false,
                meta: 'FR-102',
                summary: 'User requested dark mode toggle.',
                timestamp: '10m ago'
            },
            {
                id: 'c-302',
                title: 'Bug Report: Login',
                type: 'incident',
                horizon: 'inbox',
                priority: 'p1',
                size: 'medium',
                updates: 12,
                animate: true,
                meta: 'BUG-404',
                summary: 'Users reporting 404 on login page.',
                timestamp: '1m ago'
            },
            {
                id: 'c-303',
                title: 'Team Sync Notes',
                type: 'report',
                horizon: 'inbox',
                priority: 'p3',
                size: 'small',
                updates: 0,
                animate: false,
                meta: 'MEETING',
                summary: 'Weekly sync notes.',
                timestamp: '5m ago'
            },

            // LATER Horizon
            {
                id: 'c-401',
                title: 'Q2 Roadmap Planning',
                type: 'task',
                horizon: 'later',
                priority: 'p3',
                size: 'medium',
                updates: 0,
                animate: false,
                meta: 'PLANNING',
                summary: 'Early discussions for Q2 goals.',
                timestamp: '1w ago'
            }
        ];

        if (horizon === 'all') return allCards;
        return allCards.filter(c => c.horizon === horizon);
    },

    /**
     * @function updateCard
     * @purpose Update card horizon (drag and drop)
     */
    updateCardHorizon: (cardId, newHorizon) => {
        // In a real app, this would make an API call.
        // For now, we just log it as a contract verification.
        console.log(`[CardService] Moving ${cardId} to ${newHorizon}`);
        return true;
    },

    /**
     * @function markDone
     * @purpose Move card to done
     */
    markDone: (cardId) => {
        console.log(`[CardService] Marking ${cardId} as DONE`);
        return true;
    }
};
