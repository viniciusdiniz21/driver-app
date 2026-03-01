import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ChevronLeft, ChevronRight, ArrowLeft, Activity, Maximize } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { MockDataService } from '../services/MockDataService';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HistoryScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const trajectory = useMemo(() => MockDataService.getTrajectoryByDate(selectedDate), [selectedDate]);

    const stats = useMemo(() => {
        if (trajectory.length === 0) return { totalDistance: 0, maxSpeed: 0 };

        const totalDistance = trajectory.reduce((acc, pos) => acc + (pos.distance_from_last || 0), 0) / 1000;
        const maxSpeed = Math.max(...trajectory.map(pos => pos.speed));

        return {
            totalDistance: totalDistance.toFixed(1),
            maxSpeed: maxSpeed.toFixed(0)
        };
    }, [trajectory]);

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const initialRegion = useMemo(() => {
        if (trajectory.length === 0) {
            const lastPos = MockDataService.getLastPosition();
            return {
                latitude: lastPos.latitude,
                longitude: lastPos.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };
        }
        return {
            latitude: trajectory[Math.floor(trajectory.length / 2)].latitude,
            longitude: trajectory[Math.floor(trajectory.length / 2)].longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        };
    }, [trajectory]);

    return (
        <View style={styles.container}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={initialRegion}
                userInterfaceStyle={isDark ? 'dark' : 'light'}
            >
                {trajectory.length > 0 && (
                    <>
                        <Polyline
                            coordinates={trajectory.map(p => ({ latitude: p.latitude, longitude: p.longitude }))}
                            strokeColor="#FE8330"
                            strokeWidth={4}
                        />
                        {/* Start Marker */}
                        <Marker
                            coordinate={{
                                latitude: trajectory[0].latitude,
                                longitude: trajectory[0].longitude,
                            }}
                            title="Início"
                            pinColor="green"
                        />
                        {/* End Marker */}
                        <Marker
                            coordinate={{
                                latitude: trajectory[trajectory.length - 1].latitude,
                                longitude: trajectory[trajectory.length - 1].longitude,
                            }}
                            title="Fim"
                            pinColor="red"
                        />
                    </>
                )}
            </MapView>

            {/* Header with Date Navigation */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.dateSelector}>
                    <TouchableOpacity onPress={() => changeDate(-1)}>
                        <ChevronLeft size={28} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.dateText, { color: colors.text }]}>
                        {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </Text>
                    <TouchableOpacity onPress={() => changeDate(1)}>
                        <ChevronRight size={28} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Stats Card */}
            <View style={[styles.statsCard, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Activity size={20} color={colors.primary} />
                        <View style={styles.statLabelContainer}>
                            <Text style={[styles.statLabel, { color: colors.muted }]}>Distância</Text>
                            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalDistance} km</Text>
                        </View>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <Maximize size={20} color={colors.primary} />
                        <View style={styles.statLabelContainer}>
                            <Text style={[styles.statLabel, { color: colors.muted }]}>Vel. Máxima</Text>
                            <Text style={[styles.statValue, { color: colors.text }]}>{stats.maxSpeed} km/h</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    backButton: {
        padding: 5,
    },
    dateSelector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 30, // compensar o backButton
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 15,
    },
    statsCard: {
        position: 'absolute',
        bottom: 0,
        width: width,
        paddingHorizontal: 25,
        paddingVertical: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statLabelContainer: {
        marginLeft: 12,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 15,
    },
});
