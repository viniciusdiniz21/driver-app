import { User, Position } from '../mocks/data';

const currentUser: User = {
    name: 'João Motorista',
    email: 'joao.silva@driverapp.com',
    photo: 'https://i.pravatar.cc/150?u=joao',
    carModel: 'Toyota Corolla 2023',
    licensePlate: 'ABC-1234',
};

/**
 * Gera um trajeto fictício baseado em variações aleatórias de lat/long.
 */
const generateTrajectory = (days: number, pointsPerDay: number): Position[] => {
    const positions: Position[] = [];
    const now = new Date();

    // Ponto inicial em Uberlândia, MG (exemplo)
    let lastLat = -18.9128;
    let lastLng = -48.2755;

    for (let d = days - 1; d >= 0; d--) {
        for (let p = 0; p < pointsPerDay; p++) {
            const timestamp = new Date(now);
            timestamp.setDate(now.getDate() - d);
            // Espaçamento de 15 minutos entre pontos para preencher o dia
            timestamp.setMinutes(now.getMinutes() - ((pointsPerDay - p) * 15));

            // Variação leve para simular movimento suave
            const latVariation = (Math.random() - 0.5) * 0.002;
            const lngVariation = (Math.random() - 0.5) * 0.002;

            lastLat += latVariation;
            lastLng += lngVariation;

            const speed = Math.floor(Math.random() * 60) + 20; // 20 a 80 km/h
            const distance = Math.floor(Math.random() * 300) + 50; // 50 a 350 metros

            positions.push({
                id: `gen-${d}-${p}`,
                vehicle_id: 'v1',
                latitude: lastLat,
                longitude: lastLng,
                speed,
                distance_from_last: distance,
                ignition: true,
                timestamp: timestamp.toISOString(),
            });
        }
    }

    // Ordenar por timestamp para garantir cronologia
    return positions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Gera 150 pontos (3 dias * 50 pontos)
const mockTrajectory = generateTrajectory(3, 50);

export const MockDataService = {
    getUser: () => currentUser,
    getTrajectory: () => mockTrajectory,
    getTrajectoryByDate: (date: Date) => {
        return mockTrajectory.filter(pos => {
            const posDate = new Date(pos.timestamp);
            return posDate.getFullYear() === date.getFullYear() &&
                posDate.getMonth() === date.getMonth() &&
                posDate.getDate() === date.getDate();
        });
    },
    getLastPosition: () => mockTrajectory[mockTrajectory.length - 1],
};
