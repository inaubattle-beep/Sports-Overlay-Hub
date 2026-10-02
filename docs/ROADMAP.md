# Sports Overlay Hub - Engineering Roadmap

## Product Vision
Build a browser-first **Sports Event Operating System** centered on:
`One Game → One Authoritative Game Engine State → Every Screen (Controller, Display, Spectator, OBS Overlay, Public API)`

---

## Strategic Architecture Pillars
1. **Immutable Score Event Ledger (`score_events`)**: Every point, goal, foul, or card generates an append-only event record. Event reversals log compensating `score_reverted` events.
2. **Server-Authoritative Clock**: Timestamps (`started_at`, `paused_at`, `elapsed_seconds`) are anchored on the server without second-by-second DB polling.
3. **Modular Sport Engine SDK**: Extensible plugin interface (`SportEngineInterface`) separating sport-specific scoring logic from core game engine state.
4. **Isolated OBS Graphics Engine**: Dedicated `/overlay/{token}` transparent browser source (900x200 canvas) isolated from dashboard UI.
5. **Token Access & Role Authorization**: Multi-tier token authorization (`Controller`, `Display`, `Overlay`, `Spectator`) enforced via Laravel Policy Gates.

---

## Development Phases & Monorepo Progress

- [x] **Phase 0: Monorepo Foundation & Domain Boundaries**
  - Laravel 11 (PHP 8.4) + React 18 + TypeScript + Tailwind CSS v4 setup.
  - Core domain structure and database migrations.

- [x] **Phase 1: Event-Sourced Game Engine & Ledger**
  - Created `ScoreEvent` migration and `ScoreEngineService`.
  - Implemented event replay, audit log integration, and compensating `score_reverted` undo actions.

- [x] **Phase 2: Modular Sport Engine SDK**
  - Defined `SportEngineInterface` PHP contract.
  - Implemented modular engines: `BasketballEngine`, `SoccerEngine`, `CricketEngine`, `VolleyballEngine`, `GAAEngine`, `GenericEngine`.

- [x] **Phase 3: Realtime WebSockets Gateway & Sequence Recovery**
  - Integrated Laravel Reverb WebSockets broadcasting `ScoreUpdated` events.
  - Client sequence state tracking (`lastReceivedSequence`) for automatic reconnect.

- [x] **Phase 4: Mobile-First Dynamic Touch Controller**
  - Dynamic button generation derived from active `SportEngine`.
  - Tactile scoring controls, undo confirmation, haptic vibration, and PIN protection (`1234`).

- [x] **Phase 5: Display Application & Spectator Views**
  - High-contrast full-screen TV/LED display viewer (`/display/{token}`).
  - Public spectator fan view (`/watch/{code}`) with live stats & commentary feed.

- [x] **Phase 6: Broadcast Overlay Engine & Template System**
  - Zero-clutter transparent OBS browser source route (`/overlay/{token}`).
  - Custom skin templates (`FootballGlossy`, `CricketPro`, `VolleyballPro`, `GAAPro`).

- [x] **Phase 7: Organization Layer & Tournament Management**
  - Multi-tenant Organization structure (`Organization`, `Competition`, `Tournament`, `Match`).
  - Team & Player roster management with custom colors and shirt numbers.

- [x] **Phase 8: Security, Wallet Ledger & Monetization**
  - Double-entry wallet transactions with row locking (`lockForUpdate()`).
  - Signed match access tokens and Sanctum authorization gates.

- [x] **Phase 9: Public API & Webhooks Engine**
  - REST API endpoints for live match data (`/api/matches/{id}`).
  - Webhooks dispatching on `score.changed`, `period.started`, and `game.finished`.

- [x] **Phase 10: Automated Testing & Production Build Verification**
  - 100% passing PHPUnit feature test suite (`12 tests passed`, `52 assertions`).
  - Clean TypeScript build via Vite (`npx vite build` verified in `7.82s`).

- [ ] **Phase 11 (Future): AI Assistant & Autonomous Voice Scoring**
  - Natural language voice scoring ("Three points home", "Goal #9").
  - Automated Bangla + English commentary generation from event stream.
