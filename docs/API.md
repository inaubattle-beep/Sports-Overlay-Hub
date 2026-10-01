# Sports Overlay Hub - API Specification

## Base URL
`/api/v1`

## Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create user account
- `POST /api/v1/auth/login` - Obtain Sanctum bearer token
- `POST /api/v1/auth/logout` - Revoke current token
- `GET  /api/v1/auth/me` - Get active user details

### Matches & Score Control
- `GET    /api/v1/matches` - List user matches
- `POST   /api/v1/matches` - Create new match
- `GET    /api/v1/matches/{id}` - Fetch single match & full current state
- `PUT    /api/v1/matches/{id}` - Update match settings
- `POST   /api/v1/matches/{id}/score` - Emit score event (goal, point, run, wicket, etc.)
- `POST   /api/v1/matches/{id}/undo` - Revert last score event
- `POST   /api/v1/matches/{id}/start` - Start match timer
- `POST   /api/v1/matches/{id}/pause` - Pause match timer
- `POST   /api/v1/matches/{id}/reset` - Reset match timer/scores
- `GET    /api/v1/matches/{id}/events` - List event history (audit feed)

### OBS Overlay Engine
- `GET /overlay/{token}` - Public OBS Browser Source viewport
- `GET /api/v1/overlay/{token}/state` - Fetch current match state by overlay token

### Wallet & Marketplace
- `GET  /api/v1/wallet` - View balance & summary
- `GET  /api/v1/wallet/transactions` - View transaction ledger
- `GET  /api/v1/templates` - List templates marketplace
- `POST /api/v1/templates/{id}/purchase` - Purchase template with coins
- `POST /api/v1/payments/checkout` - Create coin purchase payment session
