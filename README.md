# Property 4D

Premium real-estate platform centered around a 3D globe interface, user accounts, and personalized dashboards. Built with Angular 18+ and TypeScript.

## Overview

Property 4D visualizes real estate across four dimensions:
- **Space**: 3D globe navigation
- **Time**: Development & ownership phases
- **Value**: Growth, repair, refinement timelines
- **Experience**: Luxury, calm, architectural beauty

Inspired by Kintsukuroi (golden repair) - where fractures become features.

## Tech Stack

- **Angular 18** (Standalone components)
- **TypeScript** (Strict mode)
- **Three.js** (3D globe visualization)
- **RxJS** (Reactive state management)
- **SCSS** (Design system)

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

Navigate to `http://localhost:4200/`

## Build

```bash
npm run build
```

## Project Structure

```
/src
├── app
│   ├── core              # Auth, services, models
│   ├── shared            # Reusable components
│   ├── features          # Feature modules
│   │   ├── landing
│   │   ├── auth
│   │   ├── globe
│   │   ├── properties
│   │   ├── dashboard
│   │   └── about
│   └── layout
├── styles                # SCSS design system
└── environments
```

## Features

✅ Token-based authentication  
✅ Route guards & HTTP interceptors  
✅ 3D globe with Three.js  
✅ Client dashboard  
✅ Property listings & details  
✅ Kintsukuroi design system  
✅ Lazy-loaded routes  
✅ Angular signals for state  

## Design Philosophy

- White × muted gold (Kintsukuroi aesthetic)
- Slow, confident transitions
- Architectural, editorial quality
- Performance-first
- Desktop-first, mobile-capable

## Old React Project

The original React project is preserved in `/old-react/` for reference.
