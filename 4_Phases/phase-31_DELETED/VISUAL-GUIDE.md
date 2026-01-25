# DISCO-004: Visual Build Guide
**Card & Canvas UI - GoldSource Integration Reference**

---

## Purpose

This guide provides **visual design targets** and **GoldSource integration patterns** for building the NEXUS Card & Canvas UI. 

**Documentation Structure:**
- **[SPEC-004-card-canvas.yaml](SPEC-004-card-canvas.yaml)** - Defines **WHAT to build** (requirements, components, data model)
- **This document (VISUAL-GUIDE.md)** - Defines **HOW to build it** (GoldSource integration, visual targets, code patterns)

> **IMPORTANT:** The prototype (`SPEC-004-prototype.html`) is a monolithic design reference. **Do NOT use its code structure** for the build. Instead, follow this guide to integrate the visual design into GoldSource's modular architecture.

---

## Visual Reference: Key States

### For VS Code Preview (Human Review)

**1. Canvas Overview - Now Horizon**

![Canvas Overview](visual_01_canvas_overview.png)

*Canvas showing grid layout with dynamic card sizing. Large cards (P1) include full details, medium cards show essentials.*

---

**2. Now Horizon - Active State**

![Now Horizon](visual_02_horizon_now.png)

*Lightning bolt icon active in sidebar. Cards represent immediate work with visual weight allocated by priority.*

---

**3. Next Horizon**

![Next Horizon](visual_03_horizon_next.png)

*Clock icon active. Shows staged work with appropriate urgency indicators via badge colors.*

---

**4. Inbox View**

![Inbox View](visual_04_inbox_view.png)

*Inbox icon active with badge count. New/unallocated work appears here for user review.*

---

**5. AI Re-sort Button**

![AI Re-sort](visual_05_ai_resort.png)

*Sparkle icon in sidebar bottom. Tooltip shows "Optimise". Triggers AI-driven card re-allocation.*

---

### For AI Build Phase (Interactive Carousel)

The following carousel will be used by AI during the build phase:

````carousel
![Canvas Overview - Now Horizon](/Users/matthew.phipps/.gemini/antigravity/brain/48cf0ec5-c20d-4fe4-9735-05a8aaeb6b2f/01_canvas_overview_1769250311819.png)
**Canvas Overview:** "Now" horizon showing grid layout with dynamic card sizing. Large cards (P1) include full details, medium cards show essentials.
<!-- slide -->
![Now Horizon - Active State](/Users/matthew.phipps/.gemini/antigravity/brain/48cf0ec5-c20d-4fe4-9735-05a8aaeb6b2f/02_horizon_now_1769250323819.png)
**Now Horizon:** Lightning bolt icon active in sidebar. Cards represent immediate work with visual weight allocated by priority.
<!-- slide -->
![Next Horizon](/Users/matthew.phipps/.gemini/antigravity/brain/48cf0ec5-c20d-4fe4-9735-05a8aaeb6b2f/03_horizon_next_1769250333420.png)
**Next Horizon:** Clock icon active. Shows staged work with appropriate urgency indicators via badge colors.
<!-- slide -->
![Inbox View](/Users/matthew.phipps/.gemini/antigravity/brain/48cf0ec5-c20d-4fe4-9735-05a8aaeb6b2f/04_inbox_view_1769250343573.png)
**Inbox:** Inbox icon active with badge count. New/unallocated work appears here for user review.
<!-- slide -->
![AI Re-sort Button](/Users/matthew.phipps/.gemini/antigravity/brain/48cf0ec5-c20d-4fe4-9735-05a8aaeb6b2f/05_ai_resort_button_1769250352110.png)
**AI Re-sort:** Sparkle icon in sidebar bottom. Tooltip shows "Optimise". Triggers AI-driven card re-allocation.
````

---

## GoldSource Integration Map

### 1. File Structure

The Canvas UI should be integrated into GoldSource as **modular extensions**, not a single file:

```
2_GoldSource/scaffold/
├── index.html                    # Add canvas container in <main>
├── ui/
│   ├── styles/
│   │   ├── base.css              # Already exists (GoldSource core)
│   │   ├── components.css        # ADD: .nexus-card component
│   │   └── canvas.css            # ADD: Canvas grid + layout
│   └── scripts/
│       ├── canvas-controller.js  # ADD: Horizon filtering logic
│       ├── card-renderer.js      # ADD: Card dynamic sizing
│       └── ai-sort.js            # ADD: AI re-sort interaction
└── data/
    └── services/
        └── card-service.js       # ADD: Firestore card CRUD
```

---

## Important: Header Scope Clarification

> **CRITICAL:** DISCO-004 does **NOT** build a new header. The GoldSource scaffold already has a header (from SPEC-003). This spec only makes **minimal modifications** to the existing header.

### What We DON'T Do
- ❌ Create a new header component
- ❌ Replace the existing GoldSource header
- ❌ Build custom navigation tabs
- ❌ Implement new search functionality

### What We DO (Header Modifications)

#### 1. "My Work" Page (System-Provided Canvas)

**Page Title:**
- Change from `Dashboard` to `My Work`
- This is the **immutable, default canvas**
- First page shown when app opens
- Users cannot delete or rename this page

**Extensibility Note:**
- **"My Work" is the ONLY immutable page** (system-locked, cannot be deleted or renamed)
- **All other pages remain extensible** as per GoldSource standards
- Demo Factory can add additional pages/canvases
- Users can create/delete/rename their own custom pages

---

#### 2. Page Tab Badge Color Coding (CRITICAL)

**Behavior:**
Page/canvas icons in the header navigation use the **same badge logic as the sidebar**:

```javascript
function updatePageTabBadge(pageId) {
  const cardsInPage = cards.filter(c => c.pageId === pageId);
  
  // Count
  const count = cardsInPage.length;
  
  // Find highest priority
  const priorities = cardsInPage.map(c => c.ai_meta.importance_score);
  const maxPriority = Math.max(...priorities, 0);
  
  const badge = document.querySelector(`[data-page="${pageId}"] .count-badge`);
  
  // Remove existing classes
  badge.classList.remove('urgent', 'warning');
  
  // Set count
  badge.textContent = count;
  
  // Set color based on highest priority card
  // Set color based on highest priority card
  if (maxPriority >= 0.8) {
    badge.classList.add('urgent');  // Red (#ef4444)
  } else if (maxPriority >= 0.5) {
    badge.classList.add('warning'); // Amber (#f59e0b)
  }
  // else: neutral (gray, no class)
}
```

**Visual Result:**
- If "My Work" page contains a P1 card → Badge = Red
- If "My Work" page contains only P2/P3 → Badge = Amber (if P2 is highest)
- If "My Work" page contains only P3 → Badge = Neutral gray

---

#### 3. Notification/Alarm Icon Badge Color Coding

**Behavior:**
The notification bell icon badge uses the **same color logic** but reflects the **highest priority across ALL cards** (not just one page):

```javascript
function updateNotificationBadge() {
  const allCards = cards; // All cards across all pages
  
  // Count unread/new
  const count = allCards.filter(c => c.inbox === true).length;
  
  // Find highest priority across ALL cards
  const priorities = allCards.map(c => c.ai_meta.importance_score);
  const maxPriority = Math.max(...priorities, 0);
  
  const badge = document.querySelector('.notification-icon .count-badge');
  
  badge.classList.remove('urgent', 'warning');
  badge.textContent = count;
  
  if (maxPriority >= 0.8) {
    badge.classList.add('urgent');  // Red
  } else if (maxPriority >= 0.5) {
    badge.classList.add('warning'); // Amber
  }
}
```

---

#### 4. Header Elements That DON'T Change

**Everything else remains identical to GoldSource SPEC-003:**
- Top bar layout
- Logo/branding  
- Navigation tab structure (extensible for future pages)
- Search bar
- Settings icon
- Theme toggle
- User profile avatar

> **Note:** The "Ritual" action (AI Re-sort button, sparkle icon) is in the **sidebar**, not the header.

---

## 2. HTML Structure (index.html)

**Location:** `<main>` section of GoldSource scaffold

**Add this structure:**

```html
<main class="canvas-container">
  <!-- Sidebar Navigation -->
  <aside class="nexus-sidebar glass">
    <nav class="sidebar-nav">
      <!-- Horizons -->
      <button class="nav-item" data-horizon="inbox">
        <i data-lucide="inbox"></i>
        <span class="count-badge">3</span>
        <span class="nav-tooltip">Inbox</span>
      </button>
      
      <button class="nav-item active" data-horizon="now">
        <i data-lucide="zap"></i>
        <span class="count-badge urgent">2</span>
        <span class="nav-tooltip">Now</span>
      </button>
      
      <button class="nav-item" data-horizon="next">
        <i data-lucide="clock"></i>
        <span class="count-badge">5</span>
        <span class="nav-tooltip">Next</span>
      </button>
      
      <button class="nav-item" data-horizon="later">
        <i data-lucide="calendar"></i>
        <span class="count-badge">8</span>
        <span class="nav-tooltip">Later</span>
      </button>
      
      <div class="nav-separator"></div>
      
      <!-- AI Re-sort Action -->
      <button class="nav-item" id="ai-resort-btn">
        <i data-lucide="sparkles"></i>
        <span class="nav-tooltip">Optimise</span>
      </button>
    </nav>
  </aside>

  <!-- Canvas Grid -->
  <div class="nexus-canvas" id="card-canvas">
    <!-- Cards render here dynamically -->
  </div>
</main>
```

**Visual Reference:** See screenshot [01_canvas_overview]

---

## 3. CSS Styling

### 3.1 Canvas Grid Layout

**File:** `ui/styles/canvas.css` (NEW)

**Visual Target:** Responsive grid with glassmorphism cards

```css
.canvas-container {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  gap: var(--space-xl);
  padding: var(--space-lg);
  min-height: calc(100vh - var(--header-height));
}

.nexus-canvas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--space-md);
  align-content: start;
  
  /* Scrolling behavior */
  overflow-y: auto;
  max-height: calc(100vh - var(--header-height) - var(--space-lg) * 2);
}

/* Target: 7-8 cards per viewport
   Desktop: 2-3 columns, 3-4 rows visible
   Larger cards ensure prominence and readability */

/* Responsive: single column on mobile */
@media (max-width: 768px) {
  .canvas-container {
    grid-template-columns: 1fr;
  }
  .nexus-sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: row;
  }
}
```

---

### 3.2 Card Component

**File:** `ui/styles/components.css` (APPEND)

**Visual Target:** Dynamic card sizing based on AI priority

```css
/* Base Card - extends GoldSource .glass */
.nexus-card {
  /* Use design token for theme-aware background */
  background: var(--card-bg, rgba(20, 20, 25, 0.8));
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-md);
  
  /* Card-specific */
  padding: var(--space-md);
  cursor: pointer;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  
  /* Default size */
  grid-column: span 1;
}

/* Light theme override */
.light-theme .nexus-card {
  background: var(--glass-bg); /* Uses GoldSource light theme value */
}

/* Hover effect - from GoldSource .hover-lift */
.nexus-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

/* Dynamic Size Variants - AI-driven */
.nexus-card[data-size="compact"] {
  padding: var(--space-sm);
  grid-column: span 1;
  min-height: 120px;
}

.nexus-card[data-size="medium"] {
  grid-column: span 1;
  min-height: 180px;
}

.nexus-card[data-size="large"] {
  grid-column: span 2;
  min-height: 240px;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: var(--space-sm);
}

.card-meta {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Priority Badge */
.card-priority-badge {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
}

.card-priority-badge.p1 {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.card-priority-badge.p2 {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.card-priority-badge.p3 {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
}

/* Card Body */
.card-title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.card-summary {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-sm);
}

/* Only show summary on medium/large cards */
.nexus-card[data-size="compact"] .card-summary {
  display: none;
}

/* Card Footer */
.card-footer {
  display: flex;
  gap: var(--space-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-top: auto;
}

.card-timestamp {
  display: flex;
  align-items: center;
  gap: 4px;
}


```

**Visual Reference:** See screenshots [01_canvas_overview], [02_horizon_now]

---

### 3.3 Sidebar Navigation

**File:** `ui/styles/canvas.css` (APPEND)

**Visual Target:** Floating pill with circular buttons and badges

```css
.nexus-sidebar {
  position: fixed;
  top: calc(var(--header-height) + 40px);
  left: var(--space-lg);
  width: var(--sidebar-width);
  padding: var(--space-md) var(--space-sm);
  border-radius: calc(var(--sidebar-width) / 2);
  z-index: var(--z-sidebar);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--glass-bg);
}

.nav-item.active {
  color: var(--brand-primary);
  background: rgba(98, 216, 78, 0.15);
}

/* Count Badge - reuse GoldSource unified badge */
.count-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-badge.warning {
  background: #f59e0b;
}

.count-badge.urgent {
  background: #ef4444;
}

/* Tooltip */
.nav-tooltip {
  position: absolute;
  left: calc(100% + 16px);
  top: 50%;
  transform: translateY(-50%);
  padding: var(--space-sm) var(--space-md);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--glass-shadow);
  color: var(--text-primary);
  font-size: var(--text-sm);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-fast);
  pointer-events: none;
}

.nav-item:hover .nav-tooltip {
  opacity: 1;
  visibility: visible;
}

.nav-separator {
  width: 32px;
  height: 1px;
  background: var(--glass-border);
  margin: var(--space-xs) 0;
}
```

**Visual Reference:** See screenshots [02_horizon_now], [03_horizon_next], [05_ai_resort_button]

---

## 4. JavaScript Logic

### 4.1 Canvas Controller

**File:** `ui/scripts/canvas-controller.js` (NEW)

**Responsibility:** Horizon filtering and view state management

```javascript
class CanvasController {
  constructor() {
    this.currentHorizon = 'now';
    this.cards = [];
    this.initEventListeners();
  }

  initEventListeners() {
    // Horizon filter clicks
    document.querySelectorAll('[data-horizon]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchHorizon(e.target.closest('.nav-item').dataset.horizon);
      });
    });

    // AI Re-sort button
    document.getElementById('ai-resort-btn').addEventListener('click', () => {
      this.triggerAIResort();
    });
  }

  switchHorizon(horizon) {
    this.currentHorizon = horizon;
    
    // Update active state
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-horizon="${horizon}"]`).classList.add('active');
    
    // Re-render cards for this horizon
    this.renderCards();
  }

  async renderCards() {
    const canvas = document.getElementById('card-canvas');
    const filteredCards = this.cards.filter(card => 
      card.state === this.currentHorizon || 
      (this.currentHorizon === 'inbox' && card.inbox === true)
    );
    
    canvas.innerHTML = '';
    filteredCards.forEach(card => {
      canvas.appendChild(this.createCardElement(card));
    });
  }

  createCardElement(cardData) {
    // See card-renderer.js for implementation
  }

  async triggerAIResort() {
    // Call AI service to recalculate card presentation
    // Update card.visuals.size based on AI response
    // Re-render canvas
  }
}
```

---

### 4.2 Card Renderer

**File:** `ui/scripts/card-renderer.js` (NEW)

**Responsibility:** Creates card DOM elements with dynamic sizing

```javascript
function createCardElement(cardData) {
  const card = document.createElement('div');
  card.className = 'nexus-card glass animate-in';
  card.dataset.size = cardData.visuals.size; // 'compact' | 'medium' | 'large'
  card.dataset.stale = cardData.status.is_stale;
  card.dataset.cardId = cardData.card_id;

  // Determine priority badge class
  const priorityClass = cardData.ai_meta.importance_score > 0.8 ? 'p1' :
                        cardData.ai_meta.importance_score > 0.5 ? 'p2' : 'p3';

  card.innerHTML = `
    <div class="card-header">
      <span class="card-meta">${cardData.source_record.external_id}</span>
      <span class="card-priority-badge ${priorityClass}">
        ${cardData.content.tags?.[0] || 'P3'}
      </span>
    </div>
    
    <h3 class="card-title">${cardData.content.title}</h3>
    
    ${cardData.content.summary ? 
      `<p class="card-summary">${cardData.content.summary}</p>` : ''}
    
    <div class="card-footer">
      <span class="card-timestamp">
        <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
        ${formatTimestamp(cardData.status.last_sync)}
      </span>
      ${cardData.status.unread_count > 0 ? 
        `<span class="count-badge">${cardData.status.unread_count}</span>` : ''}
    </div>
  `;

  // Click handler - open workbench
  card.addEventListener('click', () => {
    if (!cardData.status.is_stale) {
      openWorkbench(cardData);
    }
  });

  return card;
}
```

---

## 4.3 Drag-and-Drop Interaction (CRITICAL BEHAVIOR)

> **IMPORTANT:** This is a core interaction pattern. The prototype does NOT fully implement this behavior, but the build MUST.

### Drag-and-Drop to Sidebar Buttons

**User Action:** User drags a card and drops it on a sidebar horizon button (Inbox, Now, Next, Later, or Done)

**System Response:**
1. **Update card state** in Firestore (`card.state` field)
2. **Update card inbox flag** if moving to/from Inbox
3. **Re-calculate badge counts** for affected horizons
4. **Re-calculate badge colors** based on remaining card priorities
5. **Animate card removal** from current view
6. **Update sidebar badges** with new counts/colors

---

### State Change Logic

| Drop Target | Card State Change | Inbox Flag | Notes |
|-------------|-------------------|------------|-------|
| **Inbox button** | `state` unchanged | `inbox = true` | Card stays in current horizon but appears in Inbox view |
| **Now button** | `state = 'now'` | `inbox = false` | Card moves to Now horizon |
| **Next button** | `state = 'next'` | `inbox = false` | Card moves to Next horizon |
| **Later button** | `state = 'later'` | `inbox = false` | Card moves to Later horizon |
| **Done button** | `state = 'done'` | `inbox = false` | Card archived, removed from active horizons |

---

### Badge Count Update Logic

**After ANY card move, recalculate ALL badge counts:**

```javascript
function updateBadgeCounts() {
  const horizons = ['inbox', 'now', 'next', 'later', 'done'];
  
  horizons.forEach(horizon => {
    let count = 0;
    
    if (horizon === 'inbox') {
      // Inbox shows cards where inbox=true (regardless of state)
      count = cards.filter(c => c.inbox === true).length;
    } else {
      // Other horizons show cards where state matches
      count = cards.filter(c => c.state === horizon).length;
    }
    
    // Update badge DOM
    const badge = document.querySelector(`[data-horizon="${horizon}"] .count-badge`);
    if (badge) {
      badge.textContent = count;
      if (count === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'flex';
      }
    }
  });
}
```

---

### Badge Color Update Logic (CRITICAL)

**After a card move, recalculate badge color based on HIGHEST PRIORITY card remaining in that horizon:**

```javascript
function updateBadgeColor(horizon) {
  let cardsInHorizon;
  
  if (horizon === 'inbox') {
    cardsInHorizon = cards.filter(c => c.inbox === true);
  } else {
    cardsInHorizon = cards.filter(c => c.state === horizon);
  }
  
  // Find highest priority (importance_score)
  const priorities = cardsInHorizon.map(c => c.ai_meta.importance_score);
  const maxPriority = Math.max(...priorities, 0);
  
  const badge = document.querySelector(`[data-horizon="${horizon}"] .count-badge`);
  
  if (badge) {
    // Remove existing priority classes
    badge.classList.remove('urgent', 'warning');
    
    // Apply new priority class
    if (maxPriority >= 0.8) {
      badge.classList.add('urgent');  // Red
    } else if (maxPriority >= 0.5) {
      badge.classList.add('warning'); // Amber
    }
    // else: neutral (no class, default gray)
  }
}
```

---

### Example: Dragging a P1 Card from "Now" to "Done"

**Before:**
- Now horizon: 3 cards (1× P1, 2× P3)
- Now badge: Count = `3`, Color = `Red` (urgent)
- Done horizon: 5 cards
- Done badge: Count = `5`, Color = `Neutral`

**User Action:**
- Drags the P1 card
- Drops on "Done" button

**After:**
1. **Card state updated:** `card.state = 'done'`, `card.inbox = false`
2. **Card animates out** of Now canvas
3. **Badge counts updated:**
   - Now badge: Count = `2` (decremented)
   - Done badge: Count = `6` (incremented)
4. **Badge colors updated:**
   - Now badge: Color = `Neutral` (no P1/P2 cards left, only P3)
   - Done badge: Color remains `Neutral` (Done never shows priority)

---

### Implementation Checklist

When building drag-and-drop:

- [ ] **Enable draggable** on all `.nexus-card` elements
- [ ] **Add drop zones** to all `.nav-item[data-horizon]` buttons
- [ ] **Visual feedback:** Highlight drop target on hover
- [ ] **State update:** Write to Firestore on drop
- [ ] **Badge count:** Recalculate and update counts
- [ ] **Badge color:** Recalculate based on remaining priorities
- [ ] **Animation:** Card fades out from current view
- [ ] **Persistence:** Changes must survive page refresh

---

### Visual Feedback During Drag

**While dragging:**
1. Card becomes semi-transparent (opacity: 0.6)
2. Sidebar buttons eligible for drop highlight with border glow
3. Drop target shows subtle scale-up animation

**CSS for drag states:**

```css
/* Card being dragged */
.nexus-card.dragging {
  opacity: 0.6;
  cursor: grabbing;
  transform: rotate(2deg);
}

/* Sidebar button as valid drop target */
.nav-item.drop-target {
  border: 2px solid var(--brand-primary);
  box-shadow: 0 0 20px var(--accent-glow);
  transform: scale(1.1);
}

/* Drop zone for card reordering (subtle highlight) */
.nexus-card.drop-zone,
.card-row.drop-zone {
  border: 2px dashed var(--brand-primary);
  opacity: 0.5;
  background: rgba(98, 216, 78, 0.05);
}
```

---

### Card Reordering Behavior

**Grid Mode:**
- User drags any card
- Closest valid drop position between cards highlights with subtle dashed border
- Drop updates card's position/order in current horizon
- Position is persisted (survives page refresh until next AI re-sort)

**List Mode:**
- User drags any row
- Closest valid row position highlights with subtle dashed border
- **Within same group:** Drop updates order within that state
- **To different group:** Drop changes card state and moves to new group
  - Example: Drag card from Now group to Next group → card.state changes to 'next'
- Position within new group is where card was dropped

---

## 5. Data Schema Reference

**Firestore Collection:** `users/{userId}/cards/{cardId}`

The card JSON structure is defined in the Discovery Log. Key fields for visual rendering:

```typescript
interface Card {
  card_id: string;
  state: 'new' | 'now' | 'next' | 'later' | 'done';
  inbox: boolean;
  content: {
    title: string;
    summary?: string;
    tags: string[];
  };
  visuals: {
    size: 'compact' | 'small' | 'medium' | 'large';
    design_token: 'p1' | 'p2' | 'p3' | 'p4' | 'brand' | 'neutral';
    shimmer: boolean;
  };
  ai_meta: {
    importance_score: number; // 0.0 - 1.0
    highlight_reason: string;
  };
  status: {
    is_stale: boolean;
    unread_count: number;
    last_sync: string; // ISO8601
  };
}
```

---

## 6. GoldSource Design Tokens

**Use existing GoldSource tokens** from `ui/styles/base.css`:

| NEXUS Concept | GoldSource Token | Usage |
|---------------|------------------|-------|
| Canvas background | `var(--bg-primary)` | Main canvas area |
| Card surface | `var(--glass-bg)` | Card background |
| Card border | `var(--glass-border)` | Card outline |
| Card shadow | `var(--glass-shadow)` | Depth effect |
| P1 priority | `#ef4444` (red) | Urgent cards/badges |
| P2 priority | `#f59e0b` (amber) | Important cards/badges |
| P3 priority | `var(--text-secondary)` | Normal cards/badges |
| Sidebar active | `var(--brand-primary)` | Active horizon icon |
| Spacing grid | `var(--space-md)` | Card gap (16px) |
| Hover lift | `.hover-lift` class | Reuse GoldSource animation |

---

## 7. Animations & Transitions

**Use GoldSource patterns:**

- **Card entrance:** `.animate-in` class (fadeInUp)
- **Hover effect:** `.hover-lift` mixin
- **Horizon switch:** 300ms ease-out transition on grid
- **AI Re-sort:** Container transform (450ms cubic-bezier)

---

## 8. Build Phase Checklist

When implementing in the 8-stage build process:

### Stage 1: Discovery
- [x] Visual guide complete (this document)
- [x] Requirements defined (DISCOVERY_LOG.md)

### Stage 2: Research
- [ ] Review GoldSource scaffold structure
- [ ] Identify extension points in existing files

### Stage 3: Analysis
- [ ] Validate card schema with DISCO-002 (Integration Layer)
- [ ] Confirm Workbench integration with DISCO-001

### Stage 4: Design
- [ ] Map this visual guide to specific GoldSource files
- [ ] Define new file structure (canvas.css, card-renderer.js, etc.)

### Stage 5: Implementation
- [ ] Create CSS files: `canvas.css`, extend `components.css`
- [ ] Create JS modules: `canvas-controller.js`, `card-renderer.js`, `ai-sort.js`
- [ ] Add HTML structure to `index.html`
- [ ] Implement Firestore card service

### Stage 6: Validation
- [ ] Test horizon switching
- [ ] Test card dynamic sizing
- [ ] Test badge color logic
- [ ] Test AI Re-sort button

### Stage 7: Testing
- [ ] Test in dark theme
- [ ] Test in light theme
- [ ] Test responsive layout (mobile)
- [ ] Test with real Firestore data

### Stage 8: Closure
- [ ] Git commit with descriptive message
- [ ] Update `CURRENT_STATE.yaml`
- [ ] Create closure artifact

---

## 9. Key Differences from Prototype

| Prototype | GoldSource Build |
|-----------|------------------|
| **Single HTML file** | Distributed across `index.html`, CSS modules, JS modules |
| **Inline CSS** | External `canvas.css`, `components.css` |
| **Inline JS** | Modular scripts: `canvas-controller.js`, `card-renderer.js` |
| **Hardcoded demo data** | Firestore live data via `card-service.js` |
| **Custom design tokens** | Reuse GoldSource variables from `base.css` |
| **Monolithic structure** | Component-based, follows GoldSource architecture |

---

## 10. AI Build Instructions

**When implementing this during the build phase:**

### Read Both Documents
1. **Start with:** `SPEC-004-card-canvas.yaml` for requirements and data model
2. **Then reference:** This Visual Guide for GoldSource integration and visual targets
3. **Ignore:** `SPEC-004-prototype.html` code structure (visual reference only)

### Implementation Guidelines
1. **DO** reference this visual guide for design targets
2. **DO** follow GoldSource modular architecture
3. **DO** reuse existing GoldSource design tokens and utilities
4. **DO** extend existing files rather than replace them
5. **DO** implement drag-and-drop badge update logic (Section 4.3)
6. **DON'T** copy code structure from the prototype
7. **DON'T** create inline styles or scripts
8. **DON'T** deviate from GoldSource file organization

---

## Summary

This visual guide provides:

✅ **Visual targets** via screenshots and carousel  
✅ **GoldSource integration map** for modular implementation  
✅ **CSS/HTML/JS specifications** aligned with existing architecture  
✅ **Data schema reference** for Firestore integration  
✅ **Build checklist** for the 8-stage process  

**Next Step:** Proceed to T-1 Spec stage to formalize the functional specification based on this visual guide.
