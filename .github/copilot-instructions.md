# Copilot Instructions for VPS Server Dashboard

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a VPS server dashboard application built with Next.js and TypeScript. The project integrates with Linode's API for server management, billing, and provisioning.

## Key Technologies

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Regular CSS (no Tailwind CSS)
- **API Integration**: Linode API v4
- **Package Manager**: npm

## Code Style Guidelines

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use regular CSS modules for styling
- Follow Next.js App Router conventions
- Keep API logic separate in dedicated service files
- Use proper error handling for all API calls

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and API clients
- `/src/styles` - Global CSS and component styles
- `/src/types` - TypeScript type definitions

## Linode API Integration

- Use the official Linode API v4 endpoints
- Implement proper authentication with API tokens
- Handle rate limiting and error responses
- Focus on billing, server provisioning, and management features
