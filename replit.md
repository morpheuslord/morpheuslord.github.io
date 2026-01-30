# chiranjeevi.dev Portfolio

## Overview
A personal portfolio website built with React, TypeScript, and Vite. The site showcases professional experience, skills, projects, research, services, articles, and contact information.

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query
- **UI Components**: Radix UI primitives, Lucide icons
- **Analytics**: Vercel Analytics
- **Email**: EmailJS for contact form

## Project Structure
```
src/
├── components/     # Reusable UI components
│   └── ui/        # shadcn/ui components
├── pages/         # Route pages (Index, Articles, NotFound)
├── data/          # Static data files
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── assets/        # Static assets
└── test/          # Test files
```

## Development
- Run `npm run dev` to start the development server on port 5000
- Run `npm run build` to build for production
- Run `npm run test` to run tests

## Deployment
Configured for static deployment with the built `dist` folder.

## Recent Changes
- 2026-01-30: Redesigned Experience section layout
  - Changed from vertical list to 2-column grid layout for highlights
  - Added ScrollArea for better content management with many items
  - Added dynamic category icons based on highlight content
  - Compact card design for each highlight with hover effects
  - Added highlight counter in header
- 2026-01-30: Migrated from Lovable to Replit environment
  - Updated Vite config to use port 5000 with allowedHosts for Replit proxy
  - Removed lovable-tagger plugin dependency from vite config
  - Configured static deployment
