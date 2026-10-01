# AGENTS.md - Sports Overlay Hub AI & Engineering Guidelines

## Overview
Sports Overlay Hub is a production-ready SaaS platform for sports scoreboard management and OBS broadcast graphics built with Laravel 11 (PHP 8.4), React 18, TypeScript, Tailwind CSS, and Reverb WebSockets.

---

## Architectural Rules for AI Agents

1. **Immutable Score Event Ledger**:
   - Never overwrite match score history destructively. Every point, goal, run, wicket, or penalty must generate a `ScoreEvent` record.
   - Event reversals must append a compensating `score_reverted` event type rather than deleting database rows.

2. **OBS Studio Browser Overlay Isolation**:
   - The `/overlay/{token}` route must remain 100% isolated from dashboard UI elements.
   - Always ensure `html` and `body` set `background: transparent !important;` for OBS browser source transparency.
   - Canvas resolution target is ~900x200 pixels.

3. **Server-Authoritative Timer**:
   - Do NOT store a continuously changing timer value every second in the database.
   - Store `started_at`, `paused_at`, `elapsed_seconds`, and `status`. Calculate live display time on client-side render loops.

4. **Double-Spending Prevention**:
   - Wallet transactions must execute inside a database transaction with `lockForUpdate()` on the user's wallet record.
   - Always log transaction entries in `wallet_transactions` for auditability.

5. **Server-Side Authorization & Security**:
   - Do NOT rely on frontend UI hiding for access control.
   - Enforce Laravel Policy Gates (`GameMatchPolicy`, `WalletPolicy`) on all match control and wallet endpoints.

---

## Command Reference

### Development & Build
```bash
# Run Database Migrations & Seeders
php artisan migrate:fresh --seed

# Run Feature Tests
php artisan test

# Build Frontend Assets
npx vite build
```
