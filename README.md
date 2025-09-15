# Clicka Co-working Space Management System
## Overview

The Clicka Management System is a comprehensive platform designed to manage all aspects of a co-working space in Bnei Brak that serves women entrepreneurs.
The system replaces manual, file-based processes with an integrated digital solution for managing:

Workspace allocation and occupancy

Customer and lead lifecycle management

Meeting room and lounge booking

Billing, payments, and expenses

Reporting and analytics

Integration with Google Workspace (Drive, Calendar, Gmail, OAuth)


## Key Features
### Core & Integration

Core & Integration PRD

Google OAuth authentication

User management and role-based access

Google Drive integration for document storage

Gmail integration for notifications and communication

Google Calendar integration for scheduling

Shared UI component library

Cross-team reporting framework

### Lead & Customer Management

Lead & Customer PRD

Lead registration, tracking, and conversion

Communication history and interaction logging

Customer profiles with contracts and documents

Contract lifecycle management (draft, signed, renewal, termination)

Customer search, filtering, and status tracking

### Workspace Management

Workspace PRD

Workspace inventory and allocation

Interactive visual workspace map

Real-time availability and occupancy tracking

Meeting room and lounge booking system

Google Calendar synchronization

Space assignment and historical utilization reporting

### Billing & Finance

Billing PRD

Automated billing and invoicing

Pricing tiers and prorated calculations

Payment tracking and receipts

Expense and vendor management

Financial reporting dashboard

Document generation (invoices, receipts, tax documents)


## Technical Architecture

Frontend: React 18 + TypeScript, React Router, Zustand, Tailwind CSS, i18next (Hebrew/English support)

Backend: Node.js + Express, RESTful APIs

Database: PostgreSQL with Supabase

Integrations: Google Workspace APIs (Drive, Calendar, Gmail, OAuth)

Deployment: Vercel (frontend), Render (backend), GitHub Actions (CI/CD)

Security: OAuth 2.0 with PKCE, JWT, HTTPS, input validation, CSP headers

## Users & Roles

Manager (Nechama): Full access to all functions, dashboards, approvals

Administrative Assistant (Rachel): Customer communication, booking, invoice tracking

System Administrator: Technical maintenance, user accounts, backups

Customers & Leads: External access via booking forms, invoices, and notifications

מסמך איפיון - שוקי

## Project Timeline

The project is structured into 8 weeks of development, including planning, API/UI foundations, core feature development, integration, testing, and deployment.
Each team (Core, Lead & Customer, Workspace, Billing) delivers features iteratively with clear dependencies



## Deliverables

Authentication & integrations (Google Workspace)

Lead & customer management module

Workspace management and booking system

Automated billing and expense management

Reporting & analytics dashboards

Deployment-ready production system

Installation & Setup

Clone repository

Install dependencies:

npm install


Setup environment variables:

Google API credentials

Supabase database URL & keys

Deployment configuration (Vercel/Render)

Run locally:

npm run dev


Deployment handled via CI/CD with GitHub Actions

License

This project is proprietary and intended for use by the Clicka Co-working Space management team.
