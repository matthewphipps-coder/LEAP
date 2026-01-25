# NEXUS Card & Canvas: User Stories (DISCO-004)

### Story 1: The Arrival (Notification-First)
**User**: Alex, a Network Engineer.
**Scenario**: While Alex is deep in the "Now" canvas investigating a VPN issue, a new High Priority P2 incident is assigned to them.
**Experience**: 
- NO cards pop up or shift on Alex's active canvas. 
- The sidebar "Inbox" badge pulse-glows Amber and increments to `1`.
- Alex finishes their current thought, then clicks the Inbox. They see a single card: "Switch Failure - Site B." 
- Alex drags the card to the "Next" nav item. The Inbox count clears.

### Story 2: The Re-sort (Spatial Anchoring)
**User**: Alex.
**Scenario**: After an hour, Alex's "Now" view is cluttered with 8 cards of various sizes. They want a fresh AI-driven perspective.
**Experience**: 
- Alex clicks the "Re-sort Canvas" button. 
- The AI background-recalculates the relative weights of all 8 cards.
- The cards perform a smooth "Container Transform" animation to their new positions and sizes. 
- A P1 that Alex was ignoring but has an SLA breaching in 15 mins is now **Large, Red, and Pulse-Glows** in the top-left position.

### Story 3: The Holistic Review (All List-View)
**User**: Alex.
**Scenario**: Alex is starting their morning and wants to see everything currently "on their desk" across all horizons.
**Experience**:
- Alex clicks the "All" filter in the sidebar. 
- The UI transitions from a Grid of cards to a **structured List**. 
- Items are grouped: 
    - **INBOX (2)**
    - **NOW (3)**
    - **NEXT (5)**
    - **LATER (12)**
- Alex sees a card in LATER that should be in NOW. They drag it up the list into the NOW group. The horizon state updates instantly.

### Story 4: The Inaccessible Link (Tombstone recovery)
**User**: Alex.
**Scenario**: A card Alex was "Watching" (From Me) has been deleted in ServiceNow because it was a duplicate.
**Experience**:
- Alex notices a grayscale, semi-transparent card on their canvas.
- They click the "Ghost Card." 
- An AI message appears: "This incident (INC005432) was archived as a 'Duplicate of INC005400' in ServiceNow. You no longer need to track this."
- Alex clicks "Mark Done" to clear the tombstone from their view.

### Story 5: The Guardrail (Pinning Scenario)
**User**: Alex.
**Scenario**: Alex is tracking a P3 task that isn't urgent but is personally important to them. They don't want the AI to shrink it during the next re-sort.
**Experience**:
- Alex hovers the P3 card and clicks the **Pin** icon. The card's current "Medium/Teal" state is now locked.
- Alex later triggers a "Re-sort Canvas." 
- 7 other cards re-size and move based on new SLA data, but Alex's P3 card **stays exactly where it was** and keeps its Medium size.
- The AI arranged the new "urgent" cards *around* the pinned anchor.
