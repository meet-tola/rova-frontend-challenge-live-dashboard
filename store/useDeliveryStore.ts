/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

export type DeliveryStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Exception';
export type UserRole = 'Admin' | 'Viewer';

export interface Delivery {
  id: string;
  trackingNumber: string;
  clientName: string;
  driverName: string;
  status: DeliveryStatus;
  eta: string;
  origin: string;
  destination: string;
  weight: number;
  lastUpdated: string;
}

interface DeliveryStore {
  deliveries: Delivery[];
  filters: {
    status: DeliveryStatus | 'All';
    searchTerm: string;
    userRole: UserRole;
  };
  isLoading: boolean;
  isSimulating: boolean;

  // Actions
  fetchDeliveries: () => Promise<void>;
  generateMockDeliveries: () => void;
  setFilterStatus: (status: DeliveryStatus | 'All') => void;
  setSearchTerm: (term: string) => void;
  setUserRole: (role: UserRole) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  getFilteredDeliveries: () => Delivery[];
}

const STATUSES: DeliveryStatus[] = ['Pending', 'In Transit', 'Delivered', 'Exception'];

const generateDelivery = (id: number): Delivery => {
const clients = ['Dangote', 'BUA Group', 'Innoson', 'Jumia', 'Konga', 'GIGL', 'Flour Mills', 'MainOne', 'Chisco Plc', 'Olam'];
const drivers = ['Emeka Okafor', 'Tunde Bakare', 'Musa Ibrahim', 'Chinedu Okoye', 'Olumide Awosika', 'Abubakar Umar', 'Blessing Akpan', 'Segun Adebayo', 'Uche Nwosu', 'Garba Yusuf'];
const origins = ['Apapa, LA', 'Tin Can, LA', 'Ikeja, LA', 'Aba, AB', 'PH Wharf, RV', 'Kano FTZ, KN', 'Agbara, OG'];
const destinations = ['Onitsha, AN', 'Wuse, FCT', 'Dugbe, IB', 'Central, KD', 'Oil Mill, PH', 'Ring Rd, ED', 'Enugu, EN', 'Uyo, AK', 'Asaba, DE', 'Ilorin, KW'];

  const randomStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];

  return {
    id: `DEL-${String(id).padStart(5, '0')}`,
    trackingNumber: `TRK${Math.random().toString().slice(2, 9)}`,
    clientName: clients[Math.floor(Math.random() * clients.length)],
    driverName: drivers[Math.floor(Math.random() * drivers.length)],
    status: randomStatus,
    eta: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    origin: origins[Math.floor(Math.random() * origins.length)],
    destination: destinations[Math.floor(Math.random() * destinations.length)],
    weight: Math.round((Math.random() * 50 + 1) * 10) / 10,
    lastUpdated: new Date().toISOString(),
  };
};

export const useDeliveryStore = create<DeliveryStore>((set, get) => {
  let simulationInterval: NodeJS.Timeout | null = null;

  return {
    deliveries: [],
    filters: {
      status: 'All',
      searchTerm: '',
      userRole: 'Admin',
    },
    isLoading: false,
    isSimulating: false,

    fetchDeliveries: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch('https://6a31b0c57bc5e1c612661564.mockapi.io/api/v1/deliveries');
        const data = await response.json();
        
        // Normalize API data to match our Delivery interface
        const normalizedData: Delivery[] = data.map((item: any, idx: number) => ({
          id: `DEL-${String(idx + 1).padStart(5, '0')}`,
          trackingNumber: item.trackingNumber,
          clientName: item.clientName,
          driverName: item.driverName,
          status: ['Pending', 'In Transit', 'Delivered', 'Exception'].includes(item.status) 
            ? (item.status as DeliveryStatus)
            : (STATUSES[Math.floor(Math.random() * STATUSES.length)] as DeliveryStatus),
          eta: item.eta,
          origin: item.origin,
          destination: item.destination,
          weight: item.weight,
          lastUpdated: item.lastUpdated,
        }));

        // If we have fewer than 500 deliveries, generate additional mock ones
        if (normalizedData.length < 500) {
          const additionalMocks = Array.from(
            { length: 500 - normalizedData.length },
            (_, i) => generateDelivery(normalizedData.length + i + 1)
          );
          set({ deliveries: [...normalizedData, ...additionalMocks] });
        } else {
          set({ deliveries: normalizedData });
        }
      } catch (error) {
        console.error('Failed to fetch deliveries:', error);
        // Generate mock data if API fails
        get().generateMockDeliveries();
      } finally {
        set({ isLoading: false });
      }
    },

    generateMockDeliveries: () => {
      const mockDeliveries = Array.from({ length: 500 }, (_, i) => generateDelivery(i + 1));
      set({ deliveries: mockDeliveries });
    },

    setFilterStatus: (status) => {
      set((state) => ({
        filters: { ...state.filters, status },
      }));
    },

    setSearchTerm: (term) => {
      set((state) => ({
        filters: {
          ...state.filters,
          searchTerm: term,
        },
      }));
    },

    // Implement role-based filtering
    setUserRole: (role) => {
      set((state) => ({
        filters: {
          ...state.filters,
          userRole: role,
        },
      }));
    },
    


    updateDeliveryStatus: (id, status) => {
      set((state) => ({
        deliveries: state.deliveries.map((delivery) =>
          delivery.id === id
            ? { ...delivery, status, lastUpdated: new Date().toISOString() }
            : delivery
        ),
      }));
    },

    startSimulation: () => {
      if (simulationInterval) return;
      set({ isSimulating: true });

      simulationInterval = setInterval(() => {
        const { deliveries, updateDeliveryStatus } = get();
        const count = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < count; i++) {
          const randomDelivery = deliveries[Math.floor(Math.random() * deliveries.length)];
          if (randomDelivery) {
            const newStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
            updateDeliveryStatus(randomDelivery.id, newStatus);
          }
        }
      }, 5000);
    },

    stopSimulation: () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      set({ isSimulating: false });
    },

    getFilteredDeliveries: () => {
      const { deliveries, filters } = get();
      if (deliveries.length === 0) return [];
      
      return deliveries.filter((delivery) => {
        const statusMatch = filters.status === 'All' || delivery.status === filters.status;
        const searchMatch =
          filters.searchTerm === '' ||
          delivery.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          delivery.driverName.toLowerCase().includes(filters.searchTerm.toLowerCase());
        return statusMatch && searchMatch;
      });
    },
  };
});
