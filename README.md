# Personal Profile New Design
A personal portfolio website showcasing cybersecurity engineering work, research, and projects. Built as a modern single-page application with React and TypeScript.

## Overview

This is a portfolio website featuring:
- Hero section with animated computer model
- About section with professional bio
- Experience timeline
- Skills showcase with interactive modals
- Learning achievements and certifications
- Projects portfolio
- Research publications
- Blog articles
- Services offered
- Testimonials
- Contact form

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **shadcn-ui** - UI component library (Radix UI primitives)
- **Anime.js** - Animation library
- **React Query** - Data fetching and caching
- **Vitest** - Testing framework

## Project Structure

```
src/
├── components/
│   ├── layout/          # Navigation, Footer
│   ├── sections/        # Page sections (Hero, About, Projects, etc.)
│   └── ui/              # Reusable UI components (shadcn-ui)
├── data/                # Static data (portfolio, skills, articles)
├── hooks/               # Custom React hooks
├── pages/               # Route pages (Index, Articles, NotFound)
└── lib/                 # Utility functions
```

## Development

### Prerequisites

- Node.js 18+ (check `.nvmrc` for version)
- npm or bun

### Setup

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## Deployment

The project is configured for Vercel deployment (see `vercel.json`). Build output is in the `dist/` directory.

## License

Private project - All rights reserved
