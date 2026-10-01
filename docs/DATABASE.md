# Sports Overlay Hub - Database Schema & Data Dictionary

## 1. Primary Tables
- `users`: ID, name, email, password, role, avatar, status, timestamps.
- `roles`: ID, name, display_name, description.
- `permissions`: ID, name, guard_name.
- `sports`: ID, name, code (football, cricket, volleyball), rules_config (json), icon, is_active.
- `teams`: ID, user_id, name, short_name, logo_path, primary_color, secondary_color, text_color.
- `matches`: ID, sport_id, user_id, name, slug, status, scheduled_at, started_at, ended_at, home_team_id, away_team_id, current_state (json), created_at.
- `match_participants`: ID, match_id, team_id, role (home, away).
- `score_events`: ID, match_id, team_id, event_type, value, previous_state (json), new_state (json), event_time, created_by, metadata (json), created_at.
- `scoreboard_templates`: ID, sport_id, name, slug, description, category, aspect_ratio, default_width, default_height, preview_image, is_premium, price_coins, config_schema (json).
- `template_versions`: ID, template_id, version, assets (json), markup_schema (json).
- `user_template_purchases`: ID, user_id, template_id, price_paid, transaction_id, created_at.
- `wallets`: ID, user_id, balance_coins, created_at, updated_at.
- `wallet_transactions`: ID, wallet_id, type (credit, debit, refund), amount, description, reference_id, reference_type, created_at.
- `coin_packages`: ID, name, coins, bonus_coins, price_usd, is_popular, is_active.
- `payments`: ID, user_id, gateway, transaction_id, amount, currency, status, payload (json).
- `broadcast_outputs`: ID, match_id, user_id, token, expires_at, is_active, permissions (json).
- `audit_logs`: ID, user_id, action, resource_type, resource_id, payload_before (json), payload_after (json), ip_address, user_agent, created_at.
