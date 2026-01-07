# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
yarn install        # Install dependencies
yarn dev            # Start development server (http://localhost:3000)
yarn build          # Build for production
yarn start          # Start production server
yarn lint           # Run ESLint
yarn prettier       # Format code with Prettier
```

## Environment Setup

Requires Node.js v20 (specified in `.nvmrc`). Uses Yarn as package manager.

Create `.env` file in project root:
```
NEXT_PUBLIC_MapboxAccessToken=your_mapbox_access_token
DATABASE_URL="file:./dev.db"  # For local SQLite (Prisma)
```

For Prisma database:
```bash
npx prisma generate   # Generate Prisma client
npx prisma db push    # Sync schema to database
```

## Architecture Overview

FlowmapBlue is a Next.js 12 application for visualizing geographic flow data (movements between locations) on interactive maps.

### Core Directory (`/core`)

The main flow map visualization logic:

- **FlowMap.tsx**: Main visualization component (~42KB). Uses deck.gl for WebGL rendering with `@flowmap.gl` libraries for flow visualization. Manages map interactions, tooltips, clustering, and time filtering.
- **FlowMap.state.ts**: Redux-like state management with useReducer. Defines State interface and Action types for viewport, selections, clustering, animation, and visual settings.
- **FlowMap.selectors.ts**: Reselect-based memoized selectors for derived data (location totals, flow filtering, clustering indices, color schemes).
- **types.ts**: Core data types - `Location` (id, name, lat, lon), `Flow` (origin, dest, count, time), `Config`, `ViewportProps`.

### Components Directory (`/components`)

- **GSheetsFlowMap.tsx**: Loads flow map data from Google Sheets. Uses `sheetFetcher.tsx` for fetching/parsing Google Sheets via their visualization API.
- **sheetFetcher.tsx**: Google Sheets integration using `react-refetch`. Converts sheet data to Location/Flow arrays.
- **SchemaMapper.tsx**: UI for mapping CSV columns to required fields (id, name, lat, lon for locations; origin, dest, count for flows).
- **DataImport.tsx**: CSV file upload and parsing component.

### Data Flow Patterns

1. **Google Sheets mode** (`/[id]`): Spreadsheet key in URL -> GSheetsFlowMap fetches locations, flows, and config sheets -> FlowMap renders
2. **In-browser mode** (`/in-browser`): Local CSV data -> DataImport parses -> FlowMap renders
3. **Projects mode** (`/projects`): Prisma/SQLite storage -> API routes -> FlowMap renders with schema mapping

### Key Libraries

- **@flowmap.gl/core, @flowmap.gl/react, @flowmap.gl/cluster**: Flow visualization layers and clustering
- **deck.gl + luma.gl**: WebGL-based map layers
- **react-map-gl + maplibre-gl**: Base map rendering
- **@blueprintjs/core**: UI components
- **d3-\***: Data parsing, scales, colors, time formatting
- **Prisma**: Database ORM for project storage (SQLite)

### Page Routes

- `/`: Landing page with examples
- `/[id]`: Google Sheets-based flow map (id = spreadsheet key)
- `/from-url`: Load flow map from external URLs
- `/in-browser`: Direct CSV upload mode
- `/projects`: Local project management with Prisma storage
- `/geocoding`, `/od-matrix-converter`: Data preparation tools
