/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Helper to generate sample tracking numbers 
function generateTrackingNumber(id: string): string {
    return `TRK${100000 + parseInt(id, 10) || Math.floor(100000 + Math.random() * 900000)}`;
}

// Initialize store supporting remote API data 
async function initializeStore() {
    if (initialized) return;

    try {
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
                    trackingNumber: d.trackingNumber || generateTrackingNumber(customId),
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

            // If external API has fewer than 500 items, pad it up to 500
            if (deliveryStore.size < 500) {
                const extraNeeded = 500 - deliveryStore.size;
                const mockPaddings = generateBaseDeliveries(500); 
                
                mockPaddings.forEach((d) => {
                    if (!deliveryStore.has(d.id) && deliveryStore.size < 500) {
                        deliveryStore.set(d.id, d);
                    }
                });
            }
        } else {
            throw new Error('Empty or invalid API data format');
        }
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

// Generate 500 mock delivery records with structural determinism to avoid visual shifting errors
export function generateBaseDeliveries(count: number = 500): Delivery[] {
    const fallbackStatuses: Delivery['status'][] = ['scheduled', 'in_transit', 'delivered', 'pending'];
    const deliveries: Delivery[] = [];

    for (let i = 1; i <= count; i++) {
        const status = fallbackStatuses[i % fallbackStatuses.length];

        let progress = 0;
        if (status === 'delivered') progress = 100;
        else if (status === 'in_transit') progress = 40;
        else if (status === 'pending') progress = 10;

        const etaDate = new Date(Date.now() + (i % 7) * 24 * 60 * 60 * 1000);

        deliveries.push({
            id: String(i),
            trackingNumber: generateTrackingNumber(String(i)),
            clientName: clients[i % clients.length],
            status,
            pickup: cities[i % cities.length],
            delivery: cities[(i + 2) % cities.length],
            expectedDelivery: etaDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            eta: etaDate.toISOString(),
            currentLocation: cities[i % cities.length],
            driver: drivers[i % drivers.length],
            vehicle: vehicles[i % vehicles.length],
            progress,
        });
    }
    return deliveries;
}

// Simulator changes status and progress at random for the first 3 items continuously
function startSimulator() {
    if (simulatorRunning) return;
    simulatorRunning = true;

    const simulateUpdate = () => {
        const deliveryIds = Array.from(deliveryStore.keys());
        if (deliveryIds.length === 0) return;

        // Target only the first 3 items
        const chosenIds = deliveryIds.slice(0, 3);

        /**
         * Randomly selects between 1–3 delivery IDs from the dataset fit the implies to that
         */
        // const chosenIds = Array.from(
        //     { length: Math.floor(Math.random() * 3) + 1 },
        //     () => deliveryIds[Math.floor(Math.random() * deliveryIds.length)]
        // );

        // Prevents logically inconsistent transitions logic like "delivered → in_transit".
        const transitions: Record<Delivery['status'], Delivery['status'][]> = {
            scheduled: ['pending', 'in_transit'],
            pending: ['in_transit'],
            in_transit: ['delivered', 'exception'],
            delivered: ['delivered'],
            exception: ['in_transit']
        };

        chosenIds.forEach((id) => {
            const delivery = deliveryStore.get(id);
            if (!delivery) return;

            const possibleNextStates = transitions[delivery.status];
            const randomStatus =
                possibleNextStates[Math.floor(Math.random() * possibleNextStates.length)];

            let randomProgress = Math.floor(Math.random() * 90) + 1;

            if (randomStatus === 'delivered') randomProgress = 100;
            if (randomStatus === 'scheduled') randomProgress = 0;

            deliveryStore.set(id, {
                ...delivery,
                status: randomStatus,
                progress: randomProgress
            });
        });
    };

    setInterval(simulateUpdate, 5000);
}

// API to fetch paginated deliveries (handles search/filter mapping)
export async function fetchDeliveries(
    page: number = 1,
    limit: number = 50,
    search: string = "",
    status: string = "all"
): Promise<{
    data: Delivery[];
    total: number;
    page: number;
    totalPages: number;
}> {
    await initializeStore();
    await new Promise((resolve) => setTimeout(resolve, 150));

    let allDeliveries = Array.from(deliveryStore.values());

    if (status !== "all") {
        allDeliveries = allDeliveries.filter(d => d.status === status);
    }

    const cleanQuery = search.toLowerCase().trim();
    if (cleanQuery !== "") {
        allDeliveries = allDeliveries.filter(d =>
            d.id.toString().toLowerCase().includes(cleanQuery) ||
            d.trackingNumber.toLowerCase().includes(cleanQuery) ||
            d.driver.toLowerCase().includes(cleanQuery)
        );
    }

    const total = allDeliveries.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = allDeliveries.slice(start, end);
    const totalPages = Math.ceil(total / limit) || 1;

    return { data, total, page, totalPages };
}

export async function fetchDeliveryById(id: string): Promise<Delivery | null> {
    await initializeStore();
    await new Promise((resolve) => setTimeout(resolve, 200));
    return deliveryStore.get(id) || null;
}

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