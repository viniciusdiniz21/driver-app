import { User, Position, Viagem, Coordinate } from '../mocks/data';

const currentUser: User = {
    name: 'Motorista',
    email: 'motorista@driverapp.com',
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

/**
 * Agrupa as posições em viagens baseadas na ignição ou apenas divide a trajetória em blocos.
 */
const getMockViagens = (trajectory: Position[]): Viagem[] => {
    const viagens: Viagem[] = [];
    const pointsPerTrip = 25; // Dividir os 150 pontos em 6 viagens de 25 pontos

    for (let i = 0; i < trajectory.length; i += pointsPerTrip) {
        const tripPoints = trajectory.slice(i, i + pointsPerTrip);
        if (tripPoints.length < 2) continue;

        const startTime = tripPoints[0].timestamp;
        const endTime = tripPoints[tripPoints.length - 1].timestamp;

        const distance = tripPoints.reduce((acc, p) => acc + (p.distance_from_last || 0), 0) / 1000;
        const maxSpeed = Math.max(...tripPoints.map(p => p.speed));

        const path: Coordinate[] = tripPoints.map(p => ({
            latitude: p.latitude,
            longitude: p.longitude
        }));

        viagens.push({
            id: `v-${i}`,
            startTime,
            endTime,
            distance: parseFloat(distance.toFixed(1)),
            maxSpeed,
            path
        });
    }

    return viagens.reverse(); // Mais recentes primeiro
};

const mockTrajectory = generateTrajectory(3, 50);
const mockViagens = getMockViagens(mockTrajectory);

export const MockDataService = {
    getUser: () => currentUser,
    getViagens: () => mockViagens,
    getTrajectory: () => mockTrajectory,
    getTrajectoryByDate: (date: Date) => {
        return mockTrajectory.filter((pos: Position) => {
            const posDate = new Date(pos.timestamp);
            return posDate.getFullYear() === date.getFullYear() &&
                posDate.getMonth() === date.getMonth() &&
                posDate.getDate() === date.getDate();
        });
    },
    getLastPosition: () => mockTrajectory[mockTrajectory.length - 1],
};
