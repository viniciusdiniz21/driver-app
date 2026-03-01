export interface Vehicle {
    id: string;
    license_plate: string;
}

export interface User {
    name: string;
    email: string;
    photo: string;
    carModel: string;
    licensePlate: string;
}

export interface Position {
    id: string;
    vehicle_id: string;
    latitude: number;
    longitude: number;
    speed: number;
    distance_from_last: number; // em metros
    ignition: boolean;
    timestamp: string;
}

export interface Event {
    id: string;
    vehicle_id: string;
    start_position_id: string;
    end_position_id: string;
    travel_time: number; // em minutos
    distance: number; // em km
    idle_time: number; // em minutos
}

export const mockVehicles: Vehicle[] = [
    { id: 'v1', license_plate: 'ABC-1234' },
];

// Rota simulada (coordenadas sequenciais para gerar o rastro no mapa)
export const mockPositions: Position[] = [
    { id: 'p1', vehicle_id: 'v1', latitude: -18.9128, longitude: -48.2755, speed: 0, distance_from_last: 0, ignition: true, timestamp: '2023-10-01T10:00:00Z' },
    { id: 'p2', vehicle_id: 'v1', latitude: -18.9135, longitude: -48.2760, speed: 30, distance_from_last: 100, ignition: true, timestamp: '2023-10-01T10:02:00Z' },
    { id: 'p3', vehicle_id: 'v1', latitude: -18.9145, longitude: -48.2770, speed: 45, distance_from_last: 150, ignition: true, timestamp: '2023-10-01T10:05:00Z' },
    { id: 'p4', vehicle_id: 'v1', latitude: -18.9155, longitude: -48.2785, speed: 50, distance_from_last: 200, ignition: true, timestamp: '2023-10-01T10:08:00Z' },
    { id: 'p5', vehicle_id: 'v1', latitude: -18.9165, longitude: -48.2795, speed: 0, distance_from_last: 120, ignition: false, timestamp: '2023-10-01T10:15:00Z' }, // Posição atual / Final da viagem
];

export const mockEvents: Event[] = [
    {
        id: 'e1',
        vehicle_id: 'v1',
        start_position_id: 'p1',
        end_position_id: 'p5',
        travel_time: 15,
        distance: 3.2,
        idle_time: 5,
    },
];