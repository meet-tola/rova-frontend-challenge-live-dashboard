# Live Dispatch Dashboard

A real-time delivery monitoring and management system built with **Next.js**, **React**, **Tailwind CSS**, **TanStack Query**, **Zustand**, and **shadcn/ui**.

## Overview

The Live Dispatch Dashboard provides logistics teams with a centralized interface for monitoring active deliveries, tracking delivery status changes, and managing delivery exceptions in real time.

The application is designed to handle large delivery datasets efficiently while maintaining a responsive user experience through optimized state management, background synchronization, and role-based access control.

---

# Features

## 1. Active Delivery Grid

The dashboard provides a responsive and performant delivery management interface.

### Capabilities

* Displays 500+ delivery records
* Shows:

  * Delivery ID
  * Client Name
  * Driver Name
  * Status
  * ETA
* Responsive table layout
* Pagination support for large datasets
* Powered by TanStack Query for efficient data management

### Filtering & Search

Users can quickly locate deliveries using:

* Status Filter

  * Pending
  * In Transit
  * Delivered
  * Exception

* Search By

  * Delivery ID
  * Driver Name

---

## 2. Real-Time Status Simulation

To simulate live logistics operations without a real-time backend, the application includes a client-side update service.

### Simulation Behavior

Every 5 seconds:

* Randomly selects 1–3 deliveries
* Applies valid status transitions
* Updates application state
* Instantly reflects changes in the UI

### Supported Statuses

* Pending
* In Transit
* Delivered
* Exception

This approach emulates WebSocket-style updates while remaining fully client-side.

---

## 3. Exception Handling & Intervention

### Exception Detection

Deliveries marked as **Exception** are visually highlighted for quick identification.

### Available Actions

All Users:

* View Delivery Details

Admin Users:

* Re-assign Driver
* Cancel Delivery

### Intervention Workflow

When an exception delivery is selected:

1. An intervention modal opens
2. The user selects an action
3. A confirmation notification is displayed
4. The modal closes automatically

---

## 4. Role-Based Access Control (RBAC)

User permissions are managed through a centralized Zustand store.

### Roles

#### Admin

Can:

* View all deliveries
* Access dashboard metrics
* View delivery details
* Re-assign drivers
* Cancel deliveries

#### Viewer

Can:

* View dashboard data
* View delivery details
* Monitor delivery statuses

Cannot:

* Perform intervention actions

---

# Technology Stack

| Category         | Technology           |
| ---------------- | -------------------- |
| Framework        | Next.js (App Router) |
| UI Library       | React                |
| Styling          | Tailwind CSS         |
| State Management | Zustand              |
| Server State     | TanStack Query       |
| Components       | shadcn/ui            |
| Icons            | Lucide React         |
| Notifications    | Sonner               |
| Language         | TypeScript           |

---

# State Management Strategy

## Why Zustand?

Zustand was chosen for client-side state management because it is lightweight, requires minimal boilerplate, and provides efficient subscriptions with minimal re-renders.

It manages:

* Authentication state
* User roles
* Access control permissions

Since these concerns are shared across multiple components but change infrequently, Zustand provides a simple and scalable solution.

---

## Why TanStack Query?

Delivery data is server state rather than client state.

TanStack Query was selected because it provides:

* Automatic caching
* Background refetching
* Request deduplication
* Loading and error handling
* Query synchronization

This allows the dashboard to remain responsive while handling frequent delivery updates.

---

## Separation of Concerns

| Responsibility         | Solution       |
| ---------------------- | -------------- |
| Authentication & Roles | Zustand        |
| Delivery Data          | TanStack Query |

Separating client state from server state keeps the application maintainable and reduces unnecessary complexity.

---

# Project Structure

```text
├── app/
│   ├── auth/
│   │   └── login/
│   ├── dashboard/
│   └── layout.tsx
│
├── components/
│   ├── deliveries-table.tsx
│   ├── delivery-details-modal.tsx
│   ├── intervene-action-modal.tsx
│   ├── sidebar.tsx
│   └── providers.tsx
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

# API Integration

Delivery data is sourced from:

```text
https://6a31b0c57bc5e1c612661564.mockapi.io/api/v1/deliveries
```

### Resilience Strategy

If the API becomes unavailable, returns invalid data, or provides insufficient records, the application automatically generates 500 fallback delivery records to ensure uninterrupted dashboard functionality.

---

# Installation

## Clone the Repository

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

## Open the Application

```text
http://localhost:3000
```

---

# Future Improvements(2weeks)

Given additional development time, the following enhancements would be prioritized:

* Advanced multi-criteria filtering
* WebSocket-based live updates
* Delivery analytics dashboard
* Audit logging for interventions
* Driver performance metrics
* Additional user roles (Manager, Dispatcher, etc.)
* Notification center
* CSV/PDF export functionality
* Grid virtualization for very large datasets

---

## License

This project was created as part of a frontend engineering assessment and is intended for demonstration purposes.
