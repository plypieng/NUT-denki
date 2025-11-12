# Project Context

## Purpose
This is a student directory web application for Nagaoka University of Technology's Electrical and Electronic Information Engineering major. The app manages detailed student profiles including personal information, academic background, hobbies, and social media links. It provides search and filtering capabilities for students to find and connect with each other, with administrative features for managing student data.

Key goals:
- Create a comprehensive student directory for the Electrical and Electronic Information Engineering major
- Enable easy discovery and networking among students
- Provide a platform for students to showcase their profiles and interests
- Maintain data privacy and security in compliance with personal information protection laws

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, React 19
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth 2.0
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components with Lucide React and Heroicons
- **Image Management**: Cloudinary
- **Charts**: Chart.js with react-chartjs-2
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics
- **Development**: ESLint, Jest, TypeScript

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled, no explicit `any` types allowed
- **Linting**: ESLint with Next.js core web vitals and TypeScript recommended rules
- **Imports**: Path aliases using `@/*` for `src/*` directory
- **Naming**: PascalCase for components, camelCase for variables/functions, UPPER_SNAKE_CASE for constants
- **Font**: Noto Sans JP for Japanese text support
- **Unused Variables**: Flagged as errors (with underscore prefix allowed for intentional unused vars)
- **File Structure**: Feature-based organization under `src/` with clear separation of concerns

### Architecture Patterns
- **Next.js App Router**: File-based routing with server and client components
- **Component Architecture**: Reusable UI components with clear prop interfaces
- **Provider Pattern**: Context providers for authentication, theming, and app state
- **API Routes**: RESTful API endpoints under `/api/` for data operations
- **Layout Components**: Consistent page layouts with Header/Footer structure
- **Custom Hooks**: Business logic extracted into reusable hooks
- **Type Safety**: Comprehensive TypeScript types and Zod schemas for data validation

### Testing Strategy
- **Framework**: Jest with jsdom environment for DOM testing
- **Testing Library**: React Testing Library for component testing
- **Coverage**: Collect coverage from all source files in `src/`
- **Test Files**: Located in `__tests__/` directories or as `*.test.*` files
- **Setup**: Custom setup file for test configuration and utilities
- **Mocking**: Module mocking for external dependencies

### Git Workflow
- **Branching**: Feature branches from main, with descriptive branch names
- **Commits**: Clear, descriptive commit messages in English
- **Ignore Patterns**: Standard Next.js and Node.js ignores, plus environment files
- **Deployment**: Automatic deployment to Vercel on main branch pushes

## Domain Context
This application operates in a Japanese university environment for engineering students. Key domain concepts:

- **Academic Structure**: Students progress through B1-B4 years, with specialty courses in Electrical/Electronic/Information Engineering
- **Student IDs**: Unique identifiers following university format
- **Specialties**: Engineering course specializations (Energy Control, Device/Optical, Communication, etc.)
- **Cultural Context**: Japanese naming conventions, academic terminology, and social norms
- **Privacy**: Strict compliance with Japanese personal information protection laws
- **Authentication**: Restricted to university email domain (@stn.nagaokaut.ac.jp)

## Important Constraints
- **Security**: Authentication limited to university email domain only
- **Privacy**: Must comply with Japanese Personal Information Protection Law
- **Scope**: Internal university use only, not for public access
- **Data Sensitivity**: Student personal information requires careful handling
- **Performance**: Optimized for Vercel's hobby plan limitations
- **Language**: Primarily Japanese interface with English technical documentation

## External Dependencies
- **Google OAuth**: Authentication via Google accounts (restricted domain)
- **Cloudinary**: Image upload and management service
- **PostgreSQL**: Primary database hosted externally
- **Vercel**: Hosting and deployment platform with analytics
- **Chart.js**: Data visualization library (CDN or bundled)
