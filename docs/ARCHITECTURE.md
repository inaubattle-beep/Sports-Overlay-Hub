# Sports Overlay Hub - System Architecture

## Overview
Sports Overlay Hub is a production-grade SaaS platform for live sports broadcast scoreboards, overlay graphics, real-time match administration, and template monetization.

## Core Pillars
1. **Real-Time Score Engine**: Immutable score event ledger (`score_events`) with instant WebSocket state distribution.
2. **OBS Engine**: Dedicated zero-overhead overlay route (`/overlay/{token}`) designed for 900x200 canvas transparent browser sources.
3. **Multi-Sport Support**: Agnostic match entity supporting Football, Cricket, Volleyball/Badminton, and extensible for future sports.
4. **Wallet & Marketplace**: Immutable transaction ledger for coin-based template purchases.
5. **Mobile Remote Controller**: Touch-first responsive interface with tactile scoring controls and haptic feedback.

## System Topology

```
+------------------------+      +------------------------+      +------------------------+
|  User / Admin Control  |      |   OBS Browser Source   |      | Mobile Remote Control  |
|  (React App Dashboard) |      |   (/overlay/{token})   |      | (Touch Score Controls) |
+-----------+------------+      +-----------^------------+      +-----------+------------+
            |                               |                               |
            | HTTP / API                    | HTTP / WS                     | HTTP / API
            v                               |                               v
+-------------------------------------------+--------------------------------------------+
|                                Laravel 11 Backend API                                  |
|   - Authentication (Sanctum)               - Match & Timer State Engines               |
|   - Wallet & Transaction Ledger            - Event Broadcasting (Reverb/Pusher)        |
+-------------------------------------------+--------------------------------------------+
                                            |
                                            v
                                +-----------------------+
                                |  MySQL / SQLite DB    |
                                +-----------------------+
```

## Security Standards
- **Overlay Route Security**: Public signed tokens (`overlay_tokens`) scoped specifically to read-only match state.
- **Role-Based Access Control (RBAC)**: Server-enforced Policy Gates for Super Admin, Admin, Moderator, and User roles.
- **Double-Spending Prevention**: Database row locking (`lockForUpdate()`) on wallet debit transactions.
