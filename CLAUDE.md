# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MRS Lead Toolkit is a web-based operations tool for Medrunner staff in Star Citizen. It provides three main features:
1. **Ship Assignment** - Manage team ship assignments with Discord-formatted output
2. **After Action Report (AAR)** - Generate structured mission reports
3. **Tip Splitter** - Calculate fair tip distribution accounting for Star Citizen's 0.5% transfer fee

## Architecture

Static HTML/CSS/JS application using Tailwind CSS (CDN). No build step required.

### JavaScript Module Structure

All modules use global functions (not ES6 modules) and share state via global variables.

```
js/
├── constants.js      # Discord emojis, fallback ship list, shared SHIPS array
├── ships-api.js      # FleetYards API integration, ship list caching (24hr localStorage)
├── ship-assignment.js # Ship/crew state, drag-drop, Discord import/export parsing
├── aar.js            # AAR form logic, embedded LOCATIONS_DATABASE, custom dropdowns
├── tip-splitter.js   # Fee-aware tip distribution algorithm
├── ui.js             # Tab switching, cross-module UI coordination
└── main.js           # DOMContentLoaded initialization, conditional field setup
```

### Key Global Variables

- `ships` (ship-assignment.js) - Array of ship objects with crew assignments
- `SHIPS` (constants.js) - Populated from FleetYards API or fallback list
- `PLANETARY_BODIES` / `PLANETARY_BODY_TO_POIS` (aar.js) - Location data for AAR
- `tipRecipients` (tip-splitter.js) - Recipients for tip calculations

### External Dependencies

- **Tailwind CSS** - Loaded via CDN, configured inline in index.html
- **Google Fonts** - Inter and Mohave font families
- **FleetYards API** - `https://api.fleetyards.net/v1/models` for Star Citizen ship data

## Development

Open `index.html` directly in a browser. No server required for basic development.

### Deployment

GitHub Pages auto-deploys on push to `main` branch via `.github/workflows/static.yml`.

### Custom UI Components

The app uses custom dropdown/select components (not native `<select>`) with search functionality. These are initialized via `initializeCustomSelect()`, `initializeAARSelect()`, `initializeAARPlanetSelect()`, `initializeAARPOISelect()`, and `initializeExtractedToSelect()`. When modifying these, note:
- Event listeners are cloned/replaced to prevent duplicates
- Dropdowns close when clicking outside via document-level listeners

### Discord Message Format

Ship assignments output uses custom Discord emoji syntax: `<:EmojiName:EmojiID>`. The emoji mappings are in `EMOJIS` constant (constants.js). Import parsing handles both `<:P5:...>` and `:P5:` formats.

### Tip Splitter Algorithm

The core algorithm in `findEqualTakeHomeAmount()` ensures all recipients receive equal take-home amounts by iteratively finding the maximum share that fits within the total pool after accounting for:
- 0.5% transfer fee (rounded UP per transfer)
- Lead keeps their share fee-free
- Logistics donations pooled into single transfer
