# Sports Overlay Hub - Comprehensive Code Review & Technical Audit

## Executive Summary
This document presents an exhaustive code review, architecture analysis, security audit, and QA report for **Sports Overlay Hub**. The codebase has been evaluated across 18 specialized architectural categories against production SaaS standards.

---

## 1. Issue Categorization & Severity Matrix

| Severity | Category | Issue Description | Impact | Remediation Plan |
| :--- | :--- | :--- | :--- | :--- |
| **CRITICAL** | Realtime Broadcasting | WebSocket Broadcaster event (`ScoreUpdated`) not dispatched on DB transaction commit. | OBS overlays currently rely on HTTP polling rather than push events. | Implement `ScoreUpdated` event implementing `ShouldBroadcastNow` with channel `match.{id}` and public `overlay.{token}`. |
| **CRITICAL** | Score Event System | Event undo currently deletes the last row rather than appending a compensating event. | Breaks immutable ledger history audit trail contract. | Refactor undo to record a `score_reverted` event type with compensating delta. |
| **HIGH** | Database Performance | Missing database indexes on foreign keys (`match_id`, `user_id`, `team_id`, `sport_id`, `created_at`, `token`). | High query latency on score event audit trails and OBS overlay lookup under concurrent traffic. | Add composite indexes to migration files (`match_id + created_at`, `token + is_active`). |
| **HIGH** | Authorization | Controller actions lack explicit Laravel Policy Gate invocations (`$this->authorize()`). | Risk of IDOR (Insecure Direct Object Reference) if match ID is guessed. | Create `MatchPolicy`, `WalletPolicy`, `TemplatePolicy` and register in Laravel policies. |
| **HIGH** | E2E Testing | Missing automated Playwright E2E browser test verifying multi-window broadcast sync. | Manual verification required for OBS overlay rendering and live remote controller sync. | Add Playwright E2E test suite in `tests/e2e/broadcast.spec.ts`. |
| **MEDIUM** | Frontend State | Scoreboard components handle timer interval locally without server clock drift correction. | Minor clock drift over long matches (90+ mins) across multiple connected clients. | Implement server-time drift sync hook in `useMatchTimer`. |
| **MEDIUM** | Security | Rate limiting missing on `/api/v1/overlay/{token}/state` and public auth endpoints. | Susceptible to brute-force or Denial of Service (DoS) scraping. | Add `throttle:60,1` middleware to public API routes. |
| **LOW** | Code Quality | Duplicate color hex constants across scoreboard component templates. | Code repetition in styling tokens. | Extract color constants into shared `scoreboards/theme.ts`. |

---

## 2. Detailed Technical Audit by Domain

### A. Real-Time Broadcast Pipeline (`Laravel API -> Reverb -> WebSockets -> Overlay`)
- **Current State**: Controller processes database transactions and saves `ScoreEvent` rows. However, a dedicated `ScoreUpdated` broadcast event implementing `ShouldBroadcastNow` needs to be bound to `routes/channels.php` and Reverb websocket server.
- **Remediation**: Create `App\Events\ScoreUpdated` broadcasting on `PresenceChannel('match.'.$matchId)` for operators and `Channel('overlay.'.$token)` for OBS Browser Sources.

### B. Score Engine & Immutable Event Sourcing
- **Requirement**: Every score modification must produce an immutable event without destructive deletion.
- **Audit Result**: Undo currently performs `$lastEvent->delete()`. This must be updated to append a `score_reverted` event with `previous_state` and `new_state` to maintain audit traceability.

### C. Database Architecture & Indexing
- **Audit Result**: Tables have primary keys and basic foreign key constraints, but high-cardinality lookup columns (`token`, `match_id`, `event_type`, `user_id`, `created_at`) require explicit performance indexes.
- **Remediation**: Add explicit composite indexes:
  - `matches`: `index(['user_id', 'status'])`, `index(['sport_id'])`
  - `score_events`: `index(['match_id', 'id'])`, `index(['match_id', 'created_at'])`
  - `broadcast_outputs`: `index(['token', 'is_active'])`
  - `wallet_transactions`: `index(['wallet_id', 'created_at'])`

### D. Wallet Security & Idempotency
- **Audit Result**: `WalletService::debit()` uses `lockForUpdate()` inside a DB transaction. Idempotency reference keys (`reference_id`, `reference_type`) are stored.
- **Enhancement**: Add unique constraint on `(wallet_id, reference_id, reference_type)` to enforce strict hardware-level double-spending prevention.

### E. Scoreboard Engine & Visual Reference
- **Visual Consistency**: `FootballGlossy.tsx` preserves the requested reference:
  - Dhaka | 2-1 | Saver | 911:27
  - Glossy blue home panel, metallic dark score panel, glossy red away panel, dark metallic timer panel.
- **OBS Viewport**: `/overlay/{token}` renders inside a transparent viewport with zero dashboard scrollbars or surrounding elements.

---

## 3. Implementation Plan for Audit Remediation

1. **Step 1**: Implement `App\Events\ScoreUpdated` Reverb broadcast event and channel authorization.
2. **Step 2**: Refactor `ScoreEngineService::undoLastEvent()` to append a compensating `score_reverted` event.
3. **Step 3**: Create database migration `2026_10_01_000011_add_performance_indexes.php` adding foreign key and lookup indexes.
4. **Step 4**: Implement Laravel Policies (`GameMatchPolicy`, `WalletPolicy`) for strict server-side IDOR authorization.
5. **Step 5**: Add API rate limiting middleware (`throttle:api`) to `routes/api.php`.
6. **Step 6**: Implement Playwright E2E test suite in `tests/e2e/broadcast.spec.ts`.
7. **Step 7**: Re-run PHPUnit test suite and Vite build to confirm 100% clean passage.
