# ANTIGRAVITY MASTER DEVELOPMENT INSTRUCTION

## Project: Real-Time Multi-Sport Scoring, Statistics & Broadcast Platform

You are the principal software architect, senior full-stack engineer, UI/UX engineer, realtime-systems engineer, DevOps engineer, QA engineer, and technical product engineer for this project.

Build a production-ready browser-first sports platform inspired by the capabilities commonly found in products such as:

* SCOREBOARD.BEST
* KeepTheScore
* Score Cast
* OBScoreboard
* ScoreboardMax
* Scoreboardly
* Scoreboard Studio

Do NOT copy their branding, source code, proprietary assets, or UI designs.

Study the product concepts only as functional inspiration.

The goal is to build a substantially more extensible platform.

---

# 1. PRODUCT VISION

Build a browser-based platform for:

> Real-time sports scoring + statistics + live display + spectator viewing + broadcast overlays + tournament management + APIs.

The fundamental concept is:

# ONE GAME → ONE REAL-TIME GAME STATE → EVERY SCREEN

A single game must be able to connect:

* Controller
* TV display
* Projector
* LED screen
* Spectator browser
* Mobile browser
* OBS
* Streamlabs
* vMix
* Other broadcast systems
* External API consumers

All clients must receive the same authoritative game state in real time.

---

# 2. CORE PRODUCT PRINCIPLE

Do NOT build a collection of independent scoreboard pages.

Build a:

# SPORTS EVENT PLATFORM

The architecture must be centered around:

```text
Organization
    ↓
Competition
    ↓
Tournament / League / Event
    ↓
Game
    ↓
Event Stream
    ↓
Game State
    ↓
Display / Controller / Spectator / Overlay / API
```

The Game Engine is the source of truth.

---

# 3. CORE ARCHITECTURE

Use this conceptual architecture:

```text
                         ┌─────────────────────┐
                         │     AI ASSISTANT    │
                         └──────────┬──────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────┐
│                         SPORTS PLATFORM                              │
│                                                                      │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐ │
│  │ GAME ENGINE │ │ SPORT ENGINE │ │  BROADCAST  │ │  STATISTICS  │ │
│  │             │ │              │ │   ENGINE    │ │    ENGINE    │ │
│  └──────┬──────┘ └──────┬───────┘ └──────┬──────┘ └──────┬───────┘ │
│         └────────────────┴────────────────┴───────────────┘         │
│                              │                                       │
│                         EVENT STREAM                                 │
│                              │                                       │
│              ┌───────────────┼────────────────┐                     │
│              │               │                │                     │
│              ▼               ▼                ▼                     │
│         Controller        Display         Spectator                  │
│              │               │                │                     │
│              └───────────────┼────────────────┘                     │
│                              ▼                                       │
│                     Overlay / Public API                             │
└──────────────────────────────────────────────────────────────────────┘
```

---

# 4. TECHNOLOGY DIRECTION

Prefer a modern TypeScript-first architecture.

Recommended:

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui where appropriate
* PWA
* Responsive design

### Backend

* TypeScript
* Node.js
* Next.js server capabilities or dedicated backend where appropriate
* REST API
* WebSocket realtime communication

### Database

* PostgreSQL

### Realtime

* WebSocket
* Redis
* Redis Pub/Sub where required

### Authentication

Use a modular authentication architecture.

Support:

* Email/password
* OAuth where appropriate
* Organization membership
* Roles
* Permissions
* Device/session management

### Storage

Object storage abstraction for:

* Logos
* Team images
* Player images
* Sponsor assets
* Broadcast assets
* Template assets

Do not hard-code a single cloud vendor into the domain layer.

---

# 5. MONOREPO

Use a clean monorepo.

Suggested structure:

```text
sports-platform/
│
├── apps/
│   ├── web/
│   ├── controller/
│   ├── display/
│   ├── spectator/
│   ├── broadcast/
│   └── admin/
│
├── packages/
│   ├── game-engine/
│   ├── sport-engine/
│   ├── realtime/
│   ├── database/
│   ├── auth/
│   ├── api/
│   ├── statistics/
│   ├── broadcast-engine/
│   ├── template-engine/
│   ├── ui/
│   ├── types/
│   └── config/
│
├── sports/
│   ├── generic/
│   ├── basketball/
│   ├── soccer/
│   ├── tennis/
│   ├── cricket/
│   ├── volleyball/
│   ├── badminton/
│   ├── baseball/
│   ├── hockey/
│   ├── rugby/
│   ├── table-tennis/
│   ├── pickleball/
│   ├── darts/
│   ├── snooker/
│   └── ...
│
├── docs/
├── scripts/
├── tests/
├── docker/
└── infrastructure/
```

Adapt the structure when necessary, but preserve strong separation of concerns.

---

# 6. GAME AS THE PRIMARY DOMAIN OBJECT

Create a robust Game model.

A Game should contain:

```text
Game
├── id
├── publicCode
├── sport
├── competition
├── venue
├── status
├── scheduledAt
├── startedAt
├── endedAt
├── teams
├── players
├── officials
├── ruleset
├── gameState
├── currentPeriod
├── clock
├── events
├── statistics
├── branding
├── sponsors
├── displaySettings
├── overlaySettings
└── accessControl
```

---

# 7. GAME CODE

Every game receives a unique human-friendly code.

Example:

```text
ABC7X9
```

The code can be used to discover/connect to a game.

Support:

```text
/game/ABC7X9
/watch/ABC7X9
/display/ABC7X9
/control/ABC7X9
/overlay/ABC7X9
```

Do not expose private controller credentials through public game URLs.

Use appropriate signed tokens/session authorization.

---

# 8. EVENT-SOURCED GAME ENGINE

Do NOT make the current score the only source of truth.

Use an event-based architecture.

Example:

```json
{
  "id": "evt_123",
  "gameId": "game_123",
  "sequence": 182,
  "type": "SCORE",
  "actorId": "user_123",
  "timestamp": "2026-10-02T10:00:00Z",
  "payload": {
    "team": "HOME",
    "value": 3,
    "playerId": "player_17"
  }
}
```

Every game-changing action must produce an event.

Examples:

```text
GAME_CREATED
GAME_STARTED
PERIOD_STARTED
PERIOD_ENDED
SCORE
FOUL
CARD
TIMEOUT
SUBSTITUTION
PLAYER_ADDED
PLAYER_REMOVED
CLOCK_STARTED
CLOCK_STOPPED
CLOCK_RESET
POSSESSION_CHANGED
WICKET
GOAL
SET_WON
POINT_SCORED
GAME_PAUSED
GAME_RESUMED
GAME_ENDED
```

Sport-specific events may be added.

---

# 9. EVENT REQUIREMENTS

Every event should contain:

```text
eventId
gameId
sequence
type
version
actorId
clientId
timestamp
serverTimestamp
payload
metadata
```

The system must support:

* Event validation
* Idempotency
* Ordering
* Replay
* Audit history
* Undo
* Redo where safe
* Rebuilding state
* Conflict handling

Never silently mutate historical events.

---

# 10. SPORT ENGINE SDK

Sports must be plugins/modules.

Define a common interface similar to:

```typescript
interface SportEngine {
  id: string;
  version: string;

  createGame(config: GameConfig): GameState;

  validateEvent(
    state: GameState,
    event: GameEvent
  ): ValidationResult;

  applyEvent(
    state: GameState,
    event: GameEvent
  ): GameState;

  getAvailableActions(
    state: GameState
  ): SportAction[];

  getStatistics(
    state: GameState
  ): Statistics;

  getDisplayData(
    state: GameState
  ): DisplayData;

  getControllerLayout(
    state: GameState
  ): ControllerLayout;

  getRules(): RuleDefinition;
}
```

The Game Engine must not contain sport-specific scoring logic.

---

# 11. INITIAL SPORTS

Build the architecture for all sports, but implement production-quality rules incrementally.

Initial MVP:

1. Basketball
2. Soccer/Football
3. Tennis
4. Generic

Architecture must allow:

* Baseball
* Volleyball
* Cricket
* Badminton
* Hockey
* Rugby
* Table Tennis
* Pickleball
* Darts
* Snooker
* Squash
* Handball
* American Football
* AFL
* NRL
* GAA
* Padel
* Esports

to be added as independent modules.

---

# 12. CONTROLLER

Create a mobile-first controller.

Requirements:

* Large touch targets
* Fast scoring
* Minimal navigation
* Sport-specific controls
* Undo
* Confirmation for dangerous actions
* Connection indicator
* Game status
* Clock controls
* Player selection
* Event history
* Operator identity
* PIN/session protection

The controller UI must be dynamically generated from the Sport Engine.

For example Basketball can expose:

```text
+1
+2
+3
FOUL
TIMEOUT
POSSESSION
CLOCK
SHOT CLOCK
UNDO
```

Cricket:

```text
+1
+2
+3
+4
+6
WICKET
WIDE
NO BALL
BYE
LEG BYE
```

Do not hard-code these buttons into a universal controller.

---

# 13. DISPLAY

Build a dedicated full-screen Display application.

Support:

* TV
* Projector
* LED wall
* Browser
* Mobile
* Desktop

Requirements:

* Full screen
* Large typography
* High contrast
* Low latency
* No unnecessary browser chrome
* Automatic reconnect
* Display identification
* QR pairing
* Template selection
* Sponsor support
* Animation support

---

# 14. SPECTATOR

Create a public read-only spectator view.

Example:

```text
https://domain.com/watch/ABC7X9
```

It should display:

* Live score
* Teams
* Players
* Clock
* Period/set/inning
* Important events
* Basic statistics
* Game status

Spectators must never be able to modify game state.

---

# 15. REAL-TIME SYSTEM

All connected clients must synchronize through the authoritative Game Engine.

Architecture:

```text
Controller
    ↓
Command/API
    ↓
Validation
    ↓
Game Engine
    ↓
Persist Event
    ↓
Redis/Event Bus
    ↓
WebSocket Gateway
    ↓
Display
Spectator
Overlay
Other Controllers
```

Do not allow clients to directly overwrite authoritative game state.

---

# 16. RECONNECTION

Every client must support:

* Disconnect detection
* Automatic reconnect
* State resynchronization
* Event sequence tracking
* Missed event recovery
* Connection status indicator

Client should track:

```text
lastReceivedSequence
```

On reconnect:

```text
Client
 ↓
lastSequence = 182
 ↓
Server
 ↓
events after 182
 ↓
replay
 ↓
current state
```

---

# 17. OFFLINE-FIRST CONTROLLER

Prepare architecture for temporary internet loss.

Controller should be able to:

```text
ONLINE
 ↓
Realtime

OFFLINE
 ↓
Local Event Queue
 ↓
Continue safe operations
 ↓
Reconnect
 ↓
Synchronize
```

Implement this carefully and only allow offline operations that can be reconciled safely.

---

# 18. BROADCAST OVERLAY ENGINE

Create transparent browser-source overlays.

Support:

* OBS
* Streamlabs
* vMix
* Browser Source
* Other systems supporting web overlays

Example:

```text
/overlay/ABC7X9
```

Requirements:

* Transparent background
* 16:9
* 9:16
* 1:1 where useful
* Responsive
* Low latency
* Animations
* Team colors
* Team logos
* Sponsor logos
* Live indicators

---

# 19. OVERLAY TYPES

Implement an extensible graphics system.

Initial types:

```text
Score Bug
Lower Third
Full Scoreboard
Player Card
Team Lineup
Starting XI
Formation
Goal
Foul
Timeout
Substitution
Half Time
Full Time
Sponsor
Announcement
Statistics
```

Do not hard-code layouts.

---

# 20. TEMPLATE ENGINE

Templates should be data-driven.

Example:

```text
Template
├── id
├── name
├── sport
├── version
├── layout
├── dataBindings
├── typography
├── colors
├── animations
├── aspectRatio
├── assets
└── configuration
```

Example data bindings:

```text
{{game.home.name}}
{{game.home.score}}
{{game.away.name}}
{{game.away.score}}
{{game.period}}
{{game.clock}}
{{player.name}}
{{player.number}}
```

Allow future custom templates without changing core code.

---

# 21. SPONSOR SYSTEM

Create a sponsor system.

Support:

* Sponsor assets
* Sponsor campaigns
* Game sponsors
* Competition sponsors
* Rotation
* Duration
* Placement
* Display rules

Example:

```text
Sponsor A → 10 seconds
Sponsor B → 10 seconds
Sponsor C → 10 seconds
```

---

# 22. STATISTICS ENGINE

Statistics must be generated from events whenever possible.

Example:

```text
Events
 ↓
Statistics Engine
 ↓
Team Statistics
Player Statistics
Game Statistics
Competition Statistics
Historical Statistics
```

Do not duplicate business logic between scoring and statistics.

---

# 23. TOURNAMENT MANAGEMENT

Add:

```text
Organization
 ↓
Competition
 ↓
Tournament
 ↓
Rounds
 ↓
Matches
 ↓
Games
```

Support:

* Teams
* Groups
* Fixtures
* Brackets
* Standings
* Schedule
* Venues
* Officials
* Results

Design this as a separate layer from the Game Engine.

---

# 24. ORGANIZATION SYSTEM

Support:

```text
User
 ↓
Organization
 ↓
Teams
Players
Venues
Competitions
Templates
Sponsors
Games
```

Roles:

```text
Owner
Admin
Producer
Scorekeeper
Official
Display Operator
Viewer
```

Implement permission-based authorization.

---

# 25. PUBLIC API

Build a versioned API.

Example:

```text
/api/v1/games
/api/v1/games/:id
/api/v1/games/:id/events
/api/v1/games/:id/statistics
/api/v1/teams
/api/v1/players
/api/v1/competitions
```

Support:

* Authentication
* API keys
* OAuth where appropriate
* Rate limiting
* Pagination
* Webhooks
* API versioning

---

# 26. WEBHOOKS

Support events such as:

```text
game.created
game.started
score.changed
period.started
period.ended
player.updated
game.finished
```

Allow external systems to subscribe.

---

# 27. PWA

The entire platform must be browser-first.

Requirements:

* Installable PWA
* Mobile optimized
* Desktop optimized
* Offline shell
* Service worker
* App manifest
* Fast startup
* Touch support
* Fullscreen mode

Do not require an app-store installation.

---

# 28. QR PAIRING

Displays should show a QR code.

Example:

```text
DISPLAY
   │
   ▼
┌─────────────┐
│    QR CODE  │
└─────────────┘
       │
       ▼
Scan with phone
       │
       ▼
Authenticate
       │
       ▼
Controller connected
```

QR pairing must not expose privileged credentials permanently.

Use short-lived pairing tokens.

---

# 29. SECURITY

Implement security from the beginning.

Requirements:

* Authentication
* Authorization
* RBAC
* Game access tokens
* Controller PIN
* Signed tokens
* Rate limiting
* Input validation
* CSRF protection where applicable
* XSS protection
* Secure WebSocket authorization
* Audit logging
* API key hashing
* Secret management
* Tenant isolation
* Abuse protection

Never trust client-provided game state.

---

# 30. DATABASE

Design a normalized PostgreSQL schema.

Minimum entities:

```text
users
organizations
organization_members
teams
players
venues
competitions
tournaments
matches
games
game_events
game_snapshots
game_statistics
game_devices
game_sessions
templates
template_versions
overlays
sponsors
sponsor_campaigns
api_keys
webhooks
audit_logs
```

Use migrations.

Do not use destructive schema shortcuts.

---

# 31. GAME SNAPSHOTS

For long games with many events, support snapshots.

Example:

```text
Events 1-1000
      ↓
Snapshot #1

Events 1001-2000
      ↓
Snapshot #2
```

Reconstruct state from:

```text
latest snapshot
+
events after snapshot
```

This improves performance.

---

# 32. PERFORMANCE TARGETS

Target:

```text
Controller → Server
< 100 ms where network allows

Server → Display
< 150 ms where network allows

Normal page load
< 2 seconds on reasonable broadband

Display rendering
60 FPS where animations are active
```

Do not make unrealistic guarantees. Instrument actual latency.

Track:

* command latency
* event persistence latency
* broadcast latency
* WebSocket latency
* reconnect time
* dropped messages

---

# 33. OBS / BROADCAST REQUIREMENTS

The overlay URL must work as a normal browser source.

Test with:

* OBS
* Chromium
* Chrome
* Edge

Overlay must support transparent background.

Avoid requiring a browser extension.

---

# 34. UI/UX

The UI should feel like a modern professional sports product.

Principles:

* Fast
* Clean
* Minimal
* Responsive
* Dark/light modes
* Accessible
* Large controls for operators
* Professional broadcast appearance

Do not overuse animations.

The operator must be able to score a point in one or two taps.

---

# 35. ADMIN DASHBOARD

Create:

```text
Dashboard
Games
Live Games
Teams
Players
Competitions
Tournaments
Venues
Templates
Broadcast
Sponsors
Statistics
API
Webhooks
Users
Organization
Settings
```

Dashboard should show:

```text
Live Games
Connected Devices
Active Controllers
Displays
Spectators
Realtime Health
```

---

# 36. OBSERVABILITY

Implement structured logging.

Track:

```text
Game events
WebSocket connections
Errors
Authentication
API requests
Latency
Reconnects
Failed commands
```

Prepare architecture for:

* OpenTelemetry
* Metrics
* Error tracking
* Health checks

---

# 37. TESTING

Testing is mandatory.

Implement:

### Unit tests

Sport rules.

Example:

```text
Basketball:
2 point score
3 point score
free throw
foul
period
clock

Tennis:
point
game
set
tie-break

Soccer:
goal
card
substitution
period
```

### Integration tests

```text
Controller
 → API
 → Game Engine
 → Database
 → WebSocket
 → Display
```

### End-to-end tests

Test:

```text
Create Game
 ↓
Open Controller
 ↓
Score
 ↓
Display updates
 ↓
Spectator updates
 ↓
Overlay updates
```

### Load testing

Test multiple simultaneous games and connected clients.

---

# 38. DEVELOPMENT ORDER

Follow this order.

## Phase 0 — Foundation

* Repository
* Monorepo
* TypeScript
* Linting
* Formatting
* Testing
* Database
* Docker
* Environment configuration
* CI

## Phase 1 — Game Engine

* Game model
* Event model
* Event store
* Game state
* Command validation
* Snapshots
* Undo
* Audit

## Phase 2 — Realtime

* WebSocket gateway
* Redis
* Subscriptions
* Reconnect
* Sequence recovery

## Phase 3 — Generic Sport

Build a generic scoreboard first.

## Phase 4 — Basketball

Implement complete basketball rules.

## Phase 5 — Soccer

Implement complete soccer rules.

## Phase 6 — Tennis

Implement complete tennis rules.

## Phase 7 — Controller

Mobile controller.

## Phase 8 — Display

Fullscreen display.

## Phase 9 — Spectator

Public viewer.

## Phase 10 — Broadcast

OBS/browser overlays.

## Phase 11 — Templates

Template engine.

## Phase 12 — Organization

Teams, players, venues, competitions.

## Phase 13 — Tournament

Brackets, fixtures, standings.

## Phase 14 — API

Public API and webhooks.

## Phase 15 — More Sports

Add sport modules independently.

## Phase 16 — AI

Add AI capabilities only after the deterministic platform is stable.

---

# 39. AI FEATURES — FUTURE

Do NOT make AI responsible for authoritative scoring.

AI can assist with:

### Voice scoring

```text
"Home three points"
```

→ suggested command

### Voice game control

```text
"Start the clock"
```

### Commentary

```text
Game Events
 ↓
AI
 ↓
Live Commentary
```

### Game summary

```text
Final Events
 ↓
AI
 ↓
Match Summary
```

### Statistics analysis

```text
Game Statistics
 ↓
AI
 ↓
Insights
```

AI suggestions must never directly modify authoritative game state without validation and appropriate confirmation.

---

# 40. DESIGN FOR EXTENSIBILITY

The following must be plugins/modules:

```text
Sports
Templates
Overlays
Statistics
Authentication providers
Storage providers
Realtime providers
Payment providers
Broadcast integrations
AI providers
```

Avoid tightly coupling these components.

---

# 41. IMPORTANT ENGINEERING RULES

Always:

* Prefer simple architecture over unnecessary complexity.
* Keep domain logic framework-independent.
* Use TypeScript types throughout.
* Validate all external input.
* Keep APIs versioned.
* Write tests before complicated sport rules.
* Keep migrations reversible where practical.
* Never hard-code secrets.
* Never expose privileged tokens.
* Keep game events immutable.
* Keep current state derived from validated events.
* Make realtime synchronization deterministic.
* Make UI consume domain APIs instead of duplicating business logic.

---

# 42. DOCUMENTATION

Create and continuously maintain:

```text
README.md
ARCHITECTURE.md
ROADMAP.md
CONTRIBUTING.md
SECURITY.md
API.md
REALTIME.md
GAME_ENGINE.md
SPORT_ENGINE.md
BROADCAST.md
TEMPLATES.md
DATABASE.md
DEPLOYMENT.md
TESTING.md
```

Also create:

```text
docs/
├── architecture/
├── game-engine/
├── sport-engine/
├── realtime/
├── api/
├── broadcast/
├── templates/
├── deployment/
└── development/
```

---

# 43. DEVELOPMENT WORKFLOW

Before writing substantial code:

1. Inspect the existing repository.
2. Determine current architecture.
3. Do not destroy working functionality.
4. Identify reusable components.
5. Create an implementation plan.
6. Define domain models.
7. Define interfaces.
8. Implement incrementally.
9. Run tests.
10. Fix errors.
11. Run type checking.
12. Run linting.
13. Verify the UI in a real browser.
14. Update documentation.

Do not blindly rewrite the project.

---

# 44. BROWSER VERIFICATION

After creating each major UI surface, verify it in a real browser.

Test:

```text
Home
Dashboard
Create Game
Controller
Display
Spectator
Overlay
Admin
```

Verify:

* No console errors
* No hydration errors
* Responsive layout
* Touch interactions
* Fullscreen display
* WebSocket connection
* Real-time score updates
* QR pairing
* Reconnect behavior

---

# 45. MVP ACCEPTANCE TEST

The MVP is not complete until this scenario works:

```text
1. User opens website.

2. Creates Basketball game.

3. System generates:
   ABC7X9

4. User configures:
   HOME vs AWAY

5. User opens Controller.

6. User opens Display on another browser.

7. User opens Spectator on another browser.

8. User opens OBS overlay.

9. Controller presses +3.

10. Game Engine validates event.

11. Event is persisted.

12. Game state becomes:
    HOME 3
    AWAY 0

13. Display updates.

14. Spectator updates.

15. OBS overlay updates.

16. Event appears in history.

17. User presses Undo.

18. All clients update.

19. User reconnects controller.

20. Controller receives current authoritative state.
```

This complete flow is the core acceptance test.

---

# 46. DEFINITION OF DONE

A feature is not finished when code compiles.

A feature is finished when:

* Implementation exists
* Types are correct
* Tests pass
* UI works
* Browser verification passes
* Error handling exists
* Security is considered
* Documentation is updated
* No obvious console errors remain
* Existing functionality remains intact

---

# 47. FINAL PRODUCT DIRECTION

The final platform should evolve toward:

```text
                 SPORTS EVENT OS
                        │
       ┌────────────────┼─────────────────┐
       │                │                 │
    SCORING          BROADCAST         DATA
       │                │                 │
       ▼                ▼                 ▼
   Game Engine      Graphics Engine   Statistics
       │                │                 │
       └────────────────┼─────────────────┘
                        │
                    REALTIME
                        │
       ┌────────────────┼────────────────┐
       │                │                │
   Controller        Display         Spectator
       │                │                │
       └────────────────┼────────────────┘
                        │
                  API / WEBHOOKS
                        │
       ┌────────────────┼────────────────┐
       │                │                │
     Websites        Broadcast         Mobile
       │                │                │
       └────────────────┼────────────────┘
                        │
                       AI
                        │
       ┌────────────────┼────────────────┐
       │                │                │
 AI Scorekeeper   AI Commentary    AI Analytics
```

Build the platform incrementally, but **design the foundation for this final architecture from day one**.

Do not prematurely implement every feature.

First make the Game Engine + Event System + Realtime Synchronization extremely reliable.

Then build every other capability on top of that foundation.

# START NOW

First inspect the existing repository and environment.

Then:

1. Create an architecture assessment.
2. Identify existing reusable code.
3. Produce an implementation plan.
4. Establish the monorepo/domain structure.
5. Implement the Game Engine and Event model.
6. Implement realtime synchronization.
7. Build the Generic scoreboard.
8. Build Basketball.
9. Build Controller + Display + Spectator.
10. Build the first transparent OBS overlay.
11. Run browser verification.
12. Run tests.
13. Document everything.
14. Continue iteratively until the MVP acceptance test passes.

Do not ask for confirmation for ordinary engineering decisions. Make reasonable engineering decisions, document them, and proceed.

If a decision has major architectural consequences, document the alternatives and choose the most maintainable option.

The priority order is:

**Correctness → Reliability → Extensibility → Security → Performance → UX → Visual polish.**
