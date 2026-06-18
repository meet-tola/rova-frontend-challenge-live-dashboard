export interface Delivery {
    id: string;
    trackingNumber: string;
    status: 'scheduled' | 'in_transit' | 'delivered' | 'pending' | 'exception';
    clientName: string;
    pickup: string;
    delivery: string;
    expectedDelivery: string;
    eta: string;
    currentLocation: string;
    driver: string;
    vehicle: string;
    progress: number;
}

const deliveryStore = new Map<string, Delivery>();
let initialized = false;
let simulatorRunning = false;

const cities = ['Toronto, ON', 'Vancouver, BC', 'Calgary, AB', 'Montreal, QC', 'Ottawa, ON', 'Winnipeg, MB', 'Quebec City, QC', 'Hamilton, ON'];
const drivers = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson', 'Robert Brown', 'Jessica Lee'];
const vehicles = ['T-001', 'T-002', 'T-003', 'T-004', 'T-005', 'V-001', 'V-002'];
const clients = ['Lynette Harris', 'James Smith', 'Maria Garcia', 'David Miller', 'Linda Martinez'];

const STATUSES: Delivery['status'][] = ['scheduled', 'in_transit', 'delivered', 'pending', 'exception'];

// Helper to generate random tracking numbers matching your format
function generateTrackingNumber(): string {
    return `TRK${Math.floor(100000 + Math.random() * 900000)}`;
}

// Initialize store supporting remote API data 
async function initializeStore() {
    if (initialized) return;

    try {
        // Attempt fetching from external API with a 5-second timeout safety guard
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://6a31b0c57bc5e1c612661564.mockapi.io/api/v1/deliveries', {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Network response issues');

        const externalData = await response.json();

        if (Array.isArray(externalData) && externalData.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            externalData.forEach((d: any) => {
                const customId = String(d.id);

                // Dynamic translation map to sync your backend statuses to UI expected states
                const statusMap: Record<string, Delivery['status']> = {
                    'delivered': 'delivered',
                    'in_transit': 'in_transit',
                    'scheduled': 'scheduled',
                    'pending': 'pending',
                    'exception': 'exception'
                };

                const mappedStatus = statusMap[d.status] ||
                    (STATUSES.includes(d.status) ? d.status : STATUSES[Math.floor(Math.random() * STATUSES.length)]);

                deliveryStore.set(customId, {
                    id: customId,
                    trackingNumber: d.trackingNumber || generateTrackingNumber(),
                    clientName: d.clientName || clients[Math.floor(Math.random() * clients.length)],
                    status: mappedStatus,
                    pickup: d.origin || d.pickup || cities[Math.floor(Math.random() * cities.length)],
                    delivery: d.destination || d.delivery || cities[Math.floor(Math.random() * cities.length)],
                    expectedDelivery: d.expectedDelivery || (d.eta ? new Date(d.eta).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US')),
                    eta: d.eta || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    currentLocation: d.currentLocation || d.origin || d.pickup || 'Unknown',
                    driver: d.driverName || d.driver || drivers[Math.floor(Math.random() * drivers.length)],
                    vehicle: d.vehicle || vehicles[Math.floor(Math.random() * vehicles.length)],
                    progress: typeof d.progress === 'number' ? d.progress : (mappedStatus === 'delivered' ? 100 : 0),
                });
            });
        } else {
            throw new Error('Empty or invalid API data format');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        const fallbackDeliveries = generateBaseDeliveries(500);
        fallbackDeliveries.forEach((d) => deliveryStore.set(d.id, d));
    } finally {
        initialized = true;
        if (!simulatorRunning) {
            startSimulator();
        }
    }
}

// Generate 500 mock delivery records with the new format
export function generateBaseDeliveries(count: number = 500): Delivery[] {
    const fallbackStatuses: Delivery['status'][] = ['scheduled', 'in_transit', 'delivered', 'pending'];
    const deliveries: Delivery[] = [];

    for (let i = 1; i <= count; i++) {
        const status = fallbackStatuses[Math.floor(Math.random() * fallbackStatuses.length)];

        let progress = 0;
        if (status === 'delivered') progress = 100;
        else if (status === 'in_transit') progress = Math.floor(Math.random() * 80) + 20;
        else if (status === 'pending') progress = Math.floor(Math.random() * 30);

        const etaDate = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000);

        deliveries.push({
            id: String(i),
            trackingNumber: `TRK${Math.floor(100000 + Math.random() * 900000)}`,
            clientName: clients[Math.floor(Math.random() * clients.length)],
            status,
            pickup: cities[Math.floor(Math.random() * cities.length)],
            delivery: cities[Math.floor(Math.random() * cities.length)],
            expectedDelivery: etaDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            eta: etaDate.toISOString(),
            currentLocation: cities[Math.floor(Math.random() * cities.length)],
            driver: drivers[Math.floor(Math.random() * drivers.length)],
            vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
            progress,
        });
    }
    return deliveries;
}

// Simulator randomly updates 1-3 deliveries every 5 seconds
function startSimulator() {
    simulatorRunning = true;

    const simulateUpdate = () => {
        const numToUpdate = Math.floor(Math.random() * 3) + 1;
        const deliveryIds = Array.from(deliveryStore.keys());
        if (deliveryIds.length === 0) return;

        for (let i = 0; i < numToUpdate; i++) {
            const randomId = deliveryIds[Math.floor(Math.random() * deliveryIds.length)];
            const delivery = deliveryStore.get(randomId);

            if (delivery) {
                if (delivery.status === 'delivered') {
                    continue;
                }

                if (Math.random() > 0.7 && delivery.status !== 'exception') {
                    delivery.status = 'exception';
                    delivery.progress = Math.max(delivery.progress - 10, 0);
                }
                else if (Math.random() > 0.6 && delivery.status !== 'exception') {
                    const statusProgression = {
                        'scheduled': 'in_transit',
                        'in_transit': 'delivered',
                        'pending': 'in_transit',
                    };
                    const nextStatus = statusProgression[delivery.status as keyof typeof statusProgression];
                    if (nextStatus) {
                        delivery.status = nextStatus as Delivery['status'];
                    }

                    if (delivery.status === 'in_transit') {
                        delivery.progress = Math.min(100, delivery.progress + Math.random() * 15);
                    } else if (delivery.status === 'delivered') {
                        delivery.progress = 100;
                    }
                }
                else if (Math.random() > 0.8 && delivery.status === 'in_transit') {
                    delivery.currentLocation = cities[Math.floor(Math.random() * cities.length)];
                }

                deliveryStore.set(randomId, delivery);
            }
        }
    };

    setInterval(simulateUpdate, 5000);
}

// API to fetch paginated deliveries
export async function fetchDeliveries(
    page: number = 1,
    limit: number = 20
): Promise<{
    data: Delivery[];
    total: number;
    page: number;
    totalPages: number;
}> {
    await initializeStore();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const allDeliveries = Array.from(deliveryStore.values());
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = allDeliveries.slice(start, end);
    const total = allDeliveries.length;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, totalPages };
}

// API to fetch single delivery by ID
export async function fetchDeliveryById(id: string): Promise<Delivery | null> {
    await initializeStore();
    await new Promise((resolve) => setTimeout(resolve, 200));
    return deliveryStore.get(id) || null;
}

// Intervene action: reassign driver
export async function reassignDriver(id: string, newDriver: string): Promise<Delivery | null> {
    await initializeStore();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const delivery = deliveryStore.get(id);

    if (delivery) {
        delivery.driver = newDriver;
        delivery.status = 'in_transit';
        deliveryStore.set(id, delivery);
        return { ...delivery };
    }
    return null;
}

// Intervene action: cancel delivery
export async function cancelDelivery(id: string): Promise<Delivery | null> {
    await initializeStore();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const delivery = deliveryStore.get(id);

    if (delivery) {
        delivery.status = 'pending';
        delivery.progress = 0;
        deliveryStore.set(id, delivery);
        return { ...delivery };
    }
    return null;
}