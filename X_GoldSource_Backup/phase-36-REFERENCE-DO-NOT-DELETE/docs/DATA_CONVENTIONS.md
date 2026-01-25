# Data Conventions

> **Ring-Fenced Data Pattern** - All user data scoped under `/users/{uid}/`

## Overview

GoldSource uses Firestore with a ring-fenced data architecture. Each user's data is isolated under their UID path, ensuring:
- **Privacy**: No cross-user data access
- **Scalability**: Data spreads naturally across document paths
- **Security**: Simple Firestore rules based on UID matching

## Data Structure

```
/users/{uid}                        ← User profile + preferences
/users/{uid}/cards/{cardId}         ← User's cards (future)
/users/{uid}/conversations/{id}     ← AI chat history (future)
/users/{uid}/settings/{key}         ← Extended settings (future)

# Shared/global data (read-only for users)
/config/app                         ← App-wide config
/templates/{templateId}             ← Shared templates
```

## User Profile Document

Path: `/users/{uid}`

```javascript
{
    email: string,
    displayName: string,
    photoURL: string | null,
    role: string,           // 'member', 'admin', etc.
    xp: number,
    createdAt: Timestamp,   // serverTimestamp()
    lastLoginAt: Timestamp, // Updated on each login
    preferences: {
        theme: 'dark' | 'light',
        sidebarCollapsed: boolean
        // Future prefs here
    },
    updatedAt: Timestamp    // Updated on preference change
}
```

## Data Service Pattern

All data services follow this template pattern. See `core/user-service.js` as the reference implementation.

### Key Principles

1. **Ring-fenced access** - Always scope to current user's UID
2. **Server timestamps** - Use `serverTimestamp()` for all time fields
3. **Error handling** - Log errors, don't crash
4. **Offline fallback** - Graceful degradation when offline

### Service Template

```javascript
import { db, auth } from './firebase.js';
import { 
    collection, doc, getDoc, getDocs, addDoc, 
    updateDoc, deleteDoc, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { error as logError } from './logger.js';

// Get ring-fenced collection reference
function getUserCollection() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Not authenticated');
    return collection(db, 'users', uid, '[feature]');
}

// CRUD operations follow...
export async function getAll() { ... }
export async function getById(id) { ... }
export async function create(data) { ... }
export async function update(id, data) { ... }
export async function remove(id) { ... }

// Real-time listener
export function subscribeToAll(callback) {
    return onSnapshot(getUserCollection(), (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(items);
    });
}
```

## Preference Sync Pattern

Theme and other preferences sync to Firestore with localStorage fallback:

1. **On change**: Save to localStorage AND Firestore
2. **On login**: Load from Firestore → apply → skip Firestore sync
3. **Offline**: localStorage serves as fallback

```javascript
// In theme-manager.js
export function setTheme(theme, skipFirestoreSync = false) {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    
    if (!skipFirestoreSync) {
        savePreference('theme', theme);  // Async, non-blocking
    }
}
```

## Security Rules (Reference)

```javascript
// Firestore rules (not in scaffold, deployed to Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
