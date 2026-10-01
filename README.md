# Sports Overlay Hub 🏆
> Sports Scoreboard & Broadcast Graphics SaaS Platform

Sports Overlay Hub is a production-grade SaaS platform designed for live sports broadcasting, stream scorekeeping, OBS Studio browser overlays, and scoreboard template monetization.

---

## 🌟 Key Features

- **Multi-Sport Engine**: Supports Football, Cricket, Volleyball/Badminton, and extensible for future sports.
- **Signature Broadcast Graphics**: 3D Glossy panels (`Dhaka` Glossy Blue | `2-1` Dark Metallic | `Saver` Glossy Red | `911:27` Timer), Minimal Neon Banners, Cricket Pro League, and Volleyball Set Score overlays.
- **Player Scorer Names**: Player scorer lists rendered directly on broadcast panels.
- **OBS Studio Browser Overlay**: Public `/overlay/{token}` transparent viewport (900x200 canvas) with zero scrollbars or UI clutter.
- **Touch Mobile Remote Controller**: Touch-first controller with tactile scoring buttons and device haptic feedback (`navigator.vibrate`).
- **Immutable Score Event Engine**: Immutable event ledger (`score_events`) with instant event undo and state replay.
- **Ledger Wallet & Marketplace**: Double-entry coin balance wallet (`lockForUpdate()`) for purchasing premium templates.
- **Admin Governance & Role Policy**: Server-enforced Role-Based Access Control (RBAC) and policy gates for Super Admin, Admin, Moderator, and User.

---

## 🛠️ Technology Stack

- **Backend**: Laravel 11 (PHP 8.4), Laravel Sanctum, Laravel Reverb WebSockets, SQLite / MySQL.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Zustand.
- **Testing**: PHPUnit feature test suite (9 tests passed, 37 assertions).
- **Containerization**: Docker & `docker-compose.yml`.

---

## 🚀 Quick Start Guide

### Prerequisites
- PHP 8.4+
- Composer 2.8+
- Node.js v20+ & npm

### Setup Steps
```bash
# 1. Install PHP dependencies
composer install

# 2. Install NPM dependencies
npm install

# 3. Setup Environment File
cp .env.example .env
php artisan key:generate

# 4. Run Database Migrations & Seed Data
php artisan migrate:fresh --seed

# 5. Build Frontend Assets
npx vite build

# 6. Start Development Server
php artisan serve
```

---

## 📄 License & Credits
Sports Overlay Hub &copy; 2026. Built with Laravel & React.
