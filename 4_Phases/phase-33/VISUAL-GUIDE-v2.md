# VISUAL-GUIDE-v2: Recovery & Alignment

**Status**: AUTHORITATIVE (Replaces v1)
**Date**: 2026-01-25
**Source Truth**: `SPEC-004-prototype.html`

## Core Architectural Change
> [!WARNING]
> **Do NOT use CSS Grid** for the main card canvas. 
> The Prototype uses **CSS Multi-column Layout** (`column-count`) to achieve the variable-height "Masonry" effect.
> Grid Layout forces rigid rows, breaking the design intent.

---

## 1. CSS Architecture (Modularized)
Do not copy the monolithic `<style>` block. Split the Prototype CSS into these locations:

### `ui/styles/canvas.css`
**Primary Layout Engine**: Masonry
```css
.nexus-canvas.grid-mode {
  display: block;
  column-count: 3;           /* Fixed 3 columns for Desktop/Laptop */
  column-gap: var(--space-xl);
  align-content: start;
}

/* Responsiveness */
@media (max-width: 700px)  { 
  .nexus-canvas.grid-mode { 
    display: none; /* Mobile Not Supported */
  } 
  /* Or show a "Desktop Only" message */
}

/* Freeform Mode */
.nexus-canvas.freeform-mode {
  display: block;
  position: relative;
  min-height: 800px; /* Drag space */
}
.nexus-canvas.freeform-mode .nexus-card {
  position: absolute;
  width: 300px; /* Fixed width in freeform */
  margin: 0;
  transition: transform 0.2s, top 0.2s, left 0.2s; /* Smooth movement */
}

/* Freeform Interaction */
.nexus-canvas.freeform-mode .nexus-card:hover {
  z-index: 50; /* Pop to front on hover per user request */
}
```

### `ui/styles/scaffold.css` (Structure)
**Fixed Header + Scroll**:
```css
.canvas-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.horizon-header {
  flex-shrink: 0; /* Stays fixed */
  /* Contains Layout Toggles */
}

.nexus-scroll-area {
  flex-grow: 1;
  overflow-y: auto; /* Independent scroll */
  padding-bottom: 100px;
}
```

### `ui/styles/components.css` (or `card.css`)
**Card Mechanics**:
```css
.nexus-card {
  /* ...base glass styles... */
  
  /* CRITICAL FOR MASONRY */
  break-inside: avoid; 
  margin-bottom: var(--space-xl); 
  
  /* Missing in V1 */
  background: rgba(20, 20, 25, 0.7); /* Updated opacity */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Insertion Marker (Gap Highlight) */
/* User Requirement: Highlight the SPACE, not the card */
.nexus-card.drop-before::before {
  content: '';
  position: absolute;
  top: -20px; /* Position in the gap */
  left: 0;
  right: 0;
  height: 4px;
  background: var(--brand-primary);
  border-radius: 2px;
  box-shadow: 0 0 8px var(--brand-primary); /* Glow */
  animation: fade-in 0.2s;
}

/* Bottom Drop Zone (Last Item) */
.nexus-card.drop-after::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0; right: 0; height: 4px;
  background: var(--brand-primary);
  /* ...same style... */
}
```

### `ui/styles/list-view.css` (New Section)
**Grouped Structure**:
```css
.list-group {
  margin-bottom: var(--space-xl);
}
.list-group-header {
  /* ...typography... */
  border-bottom: 1px solid var(--glass-border);
}
/* Dragging into a group highlights the group? */
.list-group.drag-over {
  background: rgba(var(--brand-primary-rgb), 0.05); /* Subtle hint */
}
```

### `ui/styles/plasma.css`
**Animations**:
- Ensure `mix-blend-mode: screen` is active.
- Verify `animation: float` matches prototype timing (45s/55s).

---

## 2. JavaScript Logic (DnD)

### Re-implement Native DnD
V1 attempted generic reordering. V2 must implement the Prototype's specific mechanics:

1.  **Drag Start**:
    ```javascript
    handleDragStart(e) {
      e.dataTransfer.effectAllowed = 'move';
      this.classList.add('dragging');
    }
    ```

2.  **Visual Insertion Marker**:
    ```javascript
    handleCardDragOver(e) {
      e.preventDefault();
      this.classList.add('drop-before'); // Visual Cue
    }
    handleCardDragLeave(e) {
      this.classList.remove('drop-before');
    }
    ```

3.  **Drop Logic (Insert Before/After)**:
    ```javascript
    handleCardDragOver(e) {
      // Calculate active half: Top 50% = drop-before, Bottom 50% = drop-after
      const rect = this.getBoundingClientRect();
      const isTop = (e.clientY - rect.top) < (rect.height / 2);
      
      if (isTop) {
         this.classList.add('drop-before');
         this.classList.remove('drop-after');
      } else {
         this.classList.add('drop-after');
         this.classList.remove('drop-before');
      }
    }
    ```

### Freeform Dragging
Protoype uses mouse events, not HTML5 DnD, for smooth XY movement.
```javascript
handleFreeFormMouseDown(e) {
  isFreeDragging = true;
  // Calculate offset...
  document.addEventListener('mousemove', handleFreeFormMouseMove);
}

handleFreeFormMouseUp(e) {
  // Save new (x,y) to card model
  card.x = newX; 
  card.y = newY;
}
```

### Layout Toggling
```javascript
function toggleLayout(mode) {
  // If switching TO freeform, snapshot current positions if needed
  // If switching TO masonry, ignore positions and let CSS flow
  renderCards();
}
```

---

## 3. Sidebar Integration
**Missing Token**:
- Correct width is `68px` (Prototype), not `64px`.
- Ensure interaction: `drop` on Sidebar Button -> Updates Card Horizon.

---

## 4. Verification Checklist
Before marking Phase 33 complete, verify:
- [ ] Layout is Masonry (vertically stacked, no row gaps).
- [ ] Dragging a card over another card shows the **Green Top Border**.
- [ ] Plasma background is blended correctly.
