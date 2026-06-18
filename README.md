# Live Dispatch Dashboard

A real-time delivery monitoring and management system built with **Next.js**, **React**, **Tailwind CSS**, **TanStack Query**, **Zustand**, and **shadcn/ui**.

---

## Overview

The Live Dispatch Dashboard provides logistics teams with a centralized interface for monitoring active deliveries, managing delivery exceptions, and performing role-based interventions in real time.

The application is designed to handle delivery datasets efficiently while maintaining a responsive user experience through caching, background synchronization, and optimized state management.

---

## Features

### 1. Active Delivery Grid with Pagination

* Displays **500+ deliveries** fetched from a live API endpoint.
* Shows key delivery information:

  * Delivery ID
  * Client Name
  * Driver Name
  * Status
  * ETA
* Built with a responsive table/grid layout.
* Pagination support for smooth navigation through large datasets.
* Powered by **TanStack Query** for:

  * Server-state caching
  * Background updates
  * Efficient pagination management

---

### 2. Auto-Refresh Data Management

The dashboard continuously refreshes delivery data to provide a real-time operational experience.

#### Capabilities

* Automatic polling using TanStack Query.
* Seamless background data synchronization.
* No page reloads or UI interruptions.
* Simulates live logistics operations through MockAPI.

#### Supported Delivery Statuses

* Pending
* In Transit
* Delivered
* Exception

---

### 3. Status Handling & Intervention

#### Exception Detection

Deliveries marked as **Exception** are visually highlighted with:

* Red left border indicators
* Elevated visibility for operational review

#### Delivery Actions

Available for all users:

* View Details

Available only for authorized users:

* Re-assign Driver
* Cancel Delivery

Intervention actions are executed through a dedicated modal workflow.

---

### 4. Role-Based Access Control (RBAC)

RBAC is managed through a centralized Zustand store.

#### Authentication Flow

Users are routed to:

```text
/app/auth/login
```

to select their operational role.

#### Roles

##### Admin

Full access to:

* Delivery monitoring
* Dashboard metrics
* Delivery details
* Driver reassignment
* Delivery cancellation

##### Viewer

Read-only access to:

* Dashboard overview
* Delivery details
* Delivery status monitoring

Viewers cannot execute intervention actions.

---

# Technology Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| UI Library       | React                   |
| Styling          | Tailwind CSS v4         |
| State Management | Zustand                 |
| Server State     | TanStack Query          |
| Components       | shadcn/ui               |
| Icons            | Lucide React            |
| Notifications    | Sonner                  |

---

# Project Architecture

## Component Structure

### Core Components

| Component              | Purpose                            |
| ---------------------- | ---------------------------------- |
| deliveries-table       | Main delivery grid with pagination |
| delivery-details-modal | Delivery information viewer        |
| intervene-action-modal | Admin intervention workflow        |
| session-warning-modal  | Session lifecycle management       |
| sidebar                | Dashboard navigation               |
| providers              | Global application providers       |

---

## Folder Structure

```text
├── app/
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── input.tsx
│   │
│   ├── deliveries-table.tsx
│   ├── delivery-details-modal.tsx
│   ├── intervene-action-modal.tsx
│   ├── providers.tsx
│   ├── session-warning-modal.tsx
│   └── sidebar.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useDeliveries.ts
│   ├── useIntervene.ts
│   └── useSessionManager.ts
│
└── lib/
    └── mockApi.ts
```

---

# State Management Strategy

## Zustand (`useAuth`)

Used exclusively for client-side global state.
Responsibilities:
* User authentication state
* Role management
* Access control permissions

---

## TanStack Query (`useDeliveries`)

Used for server-state management.
Responsibilities:
* Fetching delivery data
* Caching API responses
* Background synchronization
* Auto-refetching
* Pagination support
* Mutation handling

---

## Data Flow

1. **Login Page**
   - Role selection handled in `app/auth/login`
   - User selects a role (Admin / Driver) from the login screen

2. **Dashboard Routing**
   - After authentication, user is redirected to `app/dashboard`

3. **Data Fetching Layer**
   - `useDeliveries` hook initializes data fetching logic

4. **API + Fallback Layer**
   - Attempts to fetch deliveries from MockAPI
   - If API fails or returns insufficient data:
     - Generates 500 synthetic delivery records

5. **Query Cache**
   - TanStack Query manages caching and synchronization of server state

6. **Processing Layer**
   - Applies:
     - Role-based filtering
     - Status filtering
     - Search logic
     - Pagination

7. **UI Rendering Layer**
   - Processed data is rendered in the dashboard table/grid
   - Background updates keep data fresh without page reloads

---

# API Integration

## Delivery Endpoint

```text
https://6a31b0c57bc5e1c612661564.mockapi.io/api/v1/deliveries
```

### Implementation

Located in:

```text
lib/mockApi.ts
```

### Query Hooks

```text
hooks/useDeliveries.ts
hooks/useIntervene.ts
```

### Resilience Layer

If the API:
* Becomes unavailable
* Hits rate limits
* Returns invalid responses

the application automatically generates a standardized set of **500 fallback delivery records** to maintain dashboard functionality and prevent UI failures.

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd rova-frontend-challenge-live-dashboard
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

## Open Application

```text
http://localhost:3000
```

---

# Testing the Dashboard

## 1. Authentication Route

1. Launch the application.
2. You will be redirected to:

```text
/app/auth/login
```

3. Select one of the available roles:
   * Admin
   * Viewer

---

## 2. Review Paginated Grid

Navigate through the delivery table and verify:
* Stable pagination
* Responsive performance
* Consistent rendering across large datasets

---

## 3. Verify Real-Time Updates

Observe the dashboard while data refreshes automatically.

Expected behavior:
* No page refreshes
* No loading interruptions
* Updated delivery information appears seamlessly
* Change of status, to show expection status

---

## 4. Test Interventions

### Admin User

1. Locate an Exception delivery.
2. Open the intervention modal.
3. Perform:
   * Driver reassignment
   * Delivery cancellation

### Viewer User

Verify that:
* Delivery details remain accessible.
* Intervention controls are hidden or disabled.

---

# Design Principles

### Scalability

Supports large delivery datasets without degrading user experience.

### Separation of Concerns

Clear distinction between:
* Client state (Zustand)
* Server state (TanStack Query)

### Resilience

Fallback data generation ensures dashboard availability during API failures.

### Real-Time Experience

Background polling keeps operational data synchronized without disrupting user workflows.

---

# Future Improvements (2+ Weeks)

* Search and advanced filtering
* Delivery analytics dashboard
* WebSocket-based live updates
* Audit logging for interventions
* Driver performance metrics
* Admin, Manager, and Viewer roles with different permissions
* Notification center
* Export to CSV and PDF

---

## License

This project is provided for assessment and demonstration.
