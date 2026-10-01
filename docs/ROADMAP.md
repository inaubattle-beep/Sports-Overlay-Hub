# Sports Overlay Hub - Engineering Roadmap

## Phases & Progress
- [x] **Phase 1**: Technical Foundation & Architecture Docs
- [x] **Phase 2**: Laravel 11 Backend & DB Migrations (14 Migration files, 24 Database Tables)
- [x] **Phase 3**: Authentication, RBAC, Models & Seeders (Sanctum Tokens, Seeded Admin & Demo Match)
- [x] **Phase 4**: Immutable Score Event Engine & Timer Calculation Logic (`ScoreEngineService`, Event Replay & Undo)
- [x] **Phase 5**: Real-Time Broadcast Layer & Public OBS Overlay Engine (`/overlay/{token}`)
- [x] **Phase 6**: Modular Scoreboards (`FootballGlossy`, `CricketPro`, `VolleyballPro`)
- [x] **Phase 7**: Ledger-backed Wallet System & Payment Gateway Abstraction (`WalletService` with `lockForUpdate`, `MockPaymentGateway`)
- [x] **Phase 8**: Mobile Remote Controller Application (Touch-first UI with Haptic Feedback)
- [x] **Phase 9**: Template Studio & Marketplace Frontend (Coin Unlocks & Purchases)
- [x] **Phase 10**: Admin Panel & User Dashboard (Governance, Metrics & User Management)
- [x] **Phase 11**: Automated Testing (PHPUnit Feature Suite - 7 Tests Passed, 24 Assertions)
- [x] **Phase 12**: Containerization & Production Build Verification (`Dockerfile`, `docker-compose.yml`, Vite Bundle Build)

## Detailed Phase Breakdown

### Phase 1 - 3: Core Foundation & Database
- Laravel 11 framework structure initialized with PHP 8.4 compatibility.
- Created schemas for `users`, `roles`, `sports`, `teams`, `matches`, `score_events`, `scoreboard_templates`, `wallets`, `wallet_transactions`, `coin_packages`, `payments`, `broadcast_outputs`, and `audit_logs`.
- Database seeded with initial super admin, demo broadcaster, sports, teams, templates, and a live Dhaka vs Saver match (`2-1` score, 911s timer).

### Phase 4 - 6: Score Engine & Broadcast Overlay
- Built `ScoreEngineService` providing immutable event generation for every goal, run, wicket, card, and period change.
- Created zero-clutter public OBS browser source route `/overlay/{token}` with transparent background canvas.
- Implemented SVG-first responsive scoreboards: `FootballGlossy` matching the signature Dhaka (Glossy Blue) / Saver (Glossy Red) visual reference, `CricketPro`, and `VolleyballPro`.

### Phase 7 - 10: SaaS Capabilities & Remote Controller
- Double-entry coin wallet ledger with DB row locking to prevent double-spending.
- `MockPaymentGateway` integration for purchasing coin packages and template unlocks.
- Mobile Remote Controller with tactile scoring buttons and device vibration support (`navigator.vibrate`).
- Admin Web Panel for user role assignments, system metrics, and audit trail inspection.

### Phase 11 - 12: Testing & Production Hardening
- Written and verified PHPUnit feature tests (`AuthTest`, `MatchTest`, `WalletTest`).
- Vite production assets built in 3.63 seconds.
- Docker environment configured for production deployment.
