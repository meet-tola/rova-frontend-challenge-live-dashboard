# Live Dispatch Dashboard

A real-time delivery monitoring and management system built with Next.js, React, Tailwind CSS, Zustand, and shadcn/ui.

## Features

### Core Requirements Met

1. **Active Delivery Grid**
   - Displays 500+ deliveries with key data: Delivery ID, Client Name, Driver Name, Status, and ETA
   - Clean, minimalist design with responsive layout
   - Sorting-ready table structure

2. **Real-Time Status Simulation**
   - Mock data service that generates 500 initial delivery records
   - Simulator runs every 5 seconds, randomly updating 1-3 deliveries
   - Updates reflected instantly without page refresh or UI freezing
   - Statuses: Pending, In Transit, Delivered, Exception

3. **Status Handling(Exception)**
   - Exception rows highlighted with red left border
   - "Intervene" button appears only for Exception status deliveries
   - Opens modal with delivery details and action buttons

4. **Role-Based Access Control Framework**
   - Prepared roles:
     - **Admin**: Full access to all deliveries and all intervention actions
     - **Driver**: Can only view their deliveries
   - Framework architecture ready in the Zustand store for upcoming features:
     - `setUserRole()`: Action to set the current user's role
     - Role-based filtering inside `getFilteredDeliveries()`
     - Permission checks in `InterveneModal` for specific actions

5. **Virtualized Delivery Row List (Performance Optimization)**
   - New **DeliveryRowList** component designed to efficiently handle large delivery datasets.
   - **Non-Virtualized Mode (Default)**: Renders all filtered deliveries for stability and easier debugging.
   - **Virtualized Mode**: Integrates `@tanstack/react-virtual` to only render visible rows, supporting 1000+ deliveries without performance degradation.
   - **Easy Toggle**: Actively enabled by setting `enableVirtualization={true}` in `DeliveryGrid`.

---

### Dashboard Components

- **DashboardHeader**: Live metrics showing Total Deliveries, In Transit count, and Exception count
- **FilterBar**: Uses shadcn `Select` and `Input` components for status filter and text search by Delivery ID or Driver Name
  - Select component for smooth dropdown UX
  - Input component with search icon for text filtering
  - Role filter dropdown ready to be enabled
- **DeliveryGrid**: Main data table with responsive grid layout and virtualization support
- **DeliveryRowList**: Efficient row rendering component with optional virtual scrolling
  - Default mode: Renders all filtered deliveries (currently active)
  - Virtualized mode: Available by setting `enableVirtualization={true}` for 1000+ rows
  - Supports real-time updates while maintaining performance
- **DeliveryRow**: Memoized row component using CSS Grid for performance
- **InterveneModal**: Modal for exception handling with "Re-assign Driver" and "Cancel Delivery" actions
- **Toast Notifications**: Real-time feedback for actions using Sonner

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: Zustand with custom hooks
- **Icons**: Lucide React
- **Virtualization**: @tanstack/react-virtual (available for optimization)
- **Notifications**: Sonner

## Architecture & Design Decisions

### State Management
Chose **Zustand** for its:
- Simple, lightweight API perfect for high-frequency updates
- Minimal boilerplate compared to Context API
- Built-in devtools for debugging
- Excellent performance with selective subscriptions

### Performance
- Memoized filtered deliveries using `useMemo` to prevent unnecessary recalculations
- Selective Zustand subscriptions to avoid component re-renders on unrelated state changes
- Memoized `DeliveryRow` component to prevent re-rendering on parent updates
- Virtualization ready (can be enabled for 1000+ rows)

### Data Flow
1. On mount, fetch deliveries from API
2. Generate 500 mock deliveries if API returns fewer
3. Start simulation that randomly updates 1-3 deliveries every 5 seconds
4. Filter deliveries client-side based on status and search term
5. Display in responsive grid with fixed-height scroll container

## API Integration

- Fetches from: `https://6a31b0c57bc5e1c612661564.mockapi.io/api/v1/deliveries`
- Normalizes API data to application schema
- Falls back to generating 500 mock deliveries if API insufficient or fails
- API responses normalized to match: Delivery ID, Tracking Number, Client Name, Driver Name, Status, ETA, Origin, Destination, Weight, Last Updated

## Future Improvements (2+ Weeks)

1. **Virtualization**: Implement full @tanstack/react-virtual for 1000+ rows
2. **Real Backend**: Replace simulation with WebSocket real-time updates
3. **Database**: Add persistent storage for delivery history and audit logs
4. **Analytics**: Add delivery metrics dashboard and KPI tracking
5. **Advanced Filtering**: Multi-select filters, date range picker, advanced search
6. **Role-Based Access**: Admin, Manager, and Viewer roles with different permissions
7. **Export**: CSV/Excel export of delivery data
8. **Mobile Optimization**: Improved touch interactions and smaller screen layouts

## Running Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

## File Structure

```
├── app/
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Tailwind config
├── components/
│   ├── DashboardHeader.tsx    # Live metrics display
│   ├── FilterBar.tsx          # Status filter & search
│   ├── DeliveryGrid.tsx       # Main table component
│   ├── DeliveryRow.tsx        # Individual row (memoized)
│   └── InterveneModal.tsx     # Exception handling modal
├── store/
│   └── useDeliveryStore.ts    # Zustand store with simulation logic
├── hooks/
│   └── useVirtualizer.ts      # Virtual scrolling hook
└── README.md
```

## Key Decisions Explained

### Why Zustand over Redux or Context?
- Redux adds unnecessary complexity for this use case
- Context re-renders every component with the piece of the data 
- Zustand's simpler API allows faster development
- Better performance with selective updates
- Easier to test individual functions

### Why CSS Grid over Table Elements?
- More flexible styling with Tailwind
- Better control over responsive behavior
- Easier to implement custom row heights
- Simpler virtualization implementation

### Why Mock Simulation over Real API?
- Real-time data streaming would require WebSocket setup
- Mock simulation demonstrates the UI's ability to handle frequent updates
- Showcases state management capabilities
- Can be swapped with real WebSocket with minimal changes

## Performance Considerations

- **No Waterfalls**: Deliveries loaded in parallel with UI render
- **Memoization**: Filtered results cached to prevent recalculation
- **Selective Subscriptions**: Components only re-render on relevant state changes
- **Efficient Filtering**: Client-side filtering prevents unnecessary API calls
- **Virtual Scrolling Ready**: Infrastructure in place to handle 1000+ rows

## Testing the Dashboard

1. **See all deliveries**: Filter shows "Showing 500 of 500 deliveries"
2. **Filter by status**: Use dropdown to filter by Pending, In Transit, Delivered, or Exception
3. **Search**: Type delivery ID or driver name in shadcn Input to filter results
4. **Watch simulation**: Metrics update automatically every 5 seconds
5. **Test intervention**: Click "Intervene" on any Exception row
6. **Test modal**: See delivery details and action options
7. **Test actions**: Click "Re-assign Driver" to see success toast
8. **Stop simulation**: Use "Stop Simulation" button to pause updates

## Enabling Virtual Scrolling (For 1000+ Rows)

To enable virtual scrolling for better performance with large datasets:

1. **Open `components/DeliveryGrid.tsx`** 
2. **Change `enableVirtualization={false}` to `enableVirtualization={true}`**
3. **Reload the dashboard** - Virtual scrolling is now active

The DeliveryRowList component will automatically switch to rendering only visible rows, supporting unlimited delivery records with smooth performance.

---

Built as a modern, scalable delivery management system demonstrating React best practices, state management, and real-time UI updates.
