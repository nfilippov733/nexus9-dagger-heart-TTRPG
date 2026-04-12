# Nexus 9: The Fraying Dark

A web-based digital companion for *Nexus 9: The Fraying Dark*, a Daggerheart-compatible tabletop RPG set aboard a space station at the crossroads of a fractured galaxy — inspired by the diplomatic tension and cosmic drama of Babylon 5.

## Features

- **Digital Rulebook** — Browse the full manuscript across 8 books with persistent sidebar navigation, search, and reading progress tracking
- **Character Builder** — Interactive tool for creating player characters with ancestry, class, and subclass selection
- **Encounter Builder** — GM tool for assembling and managing combat encounters with adversary stat blocks
- **Station Terminal UI** — Diegetic "station computer" interface design with light/dark theme support

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI, Framer Motion
- **Backend:** Express (Node.js)
- **Routing:** Wouter
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build

```bash
pnpm build
```

### Production

```bash
pnpm start
```

## Project Structure

```
client/          # React SPA
  src/
    components/  # UI components (Radix-based)
    contexts/    # Theme context
    pages/       # Home, CharacterBuilder, EncounterBuilder
server/          # Express backend
shared/          # Shared types and utilities
```

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `pnpm dev`      | Start Vite dev server              |
| `pnpm build`    | Build client and server for production |
| `pnpm start`    | Run production server              |
| `pnpm check`    | TypeScript type checking           |
| `pnpm format`   | Format code with Prettier          |

## License

MIT
