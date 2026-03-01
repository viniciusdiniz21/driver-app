import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Car, History, User as UserIcon, LogOut, Navigation, Clock, Gauge } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { MockDataService } from '../services/MockDataService';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/MainTabs';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const { colors, isDark } = useTheme();
    const { logout } = useAuth();
    const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

    const lastPos = MockDataService.getLastPosition();
    const user = MockDataService.getUser();

    const initialRegion = {
        latitude: lastPos.latitude,
        longitude: lastPos.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };

    const formatTimestamp = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                    userInterfaceStyle={isDark ? 'dark' : 'light'}
                >
                    <Marker
                        coordinate={{
                            latitude: lastPos.latitude,
                            longitude: lastPos.longitude,
                        }}
                    >
                        <View style={[styles.markerContainer, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                            <Car size={24} color={colors.primary} fill={colors.primary} />
                        </View>
                    </Marker>
                </MapView>
            </View>

            <View style={[styles.panel, { backgroundColor: colors.card }]}>
                <View style={styles.panelContent}>
                    <View style={styles.vehicleHeader}>
                        <Text style={[styles.title, { color: colors.text }]}>{user.carModel}</Text>
                        <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[styles.badgeText, { color: colors.primary }]}>{user.licensePlate}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                            <Navigation size={20} color={colors.primary} />
                            <View style={styles.infoTextContainer}>
                                <Text style={[styles.infoLabel, { color: colors.muted }]}>Localização</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                                    Av. Afonso Pena, 1200 - Uberlândia, MG
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                            <Clock size={20} color={colors.primary} />
                            <View style={styles.infoTextContainer}>
                                <Text style={[styles.infoLabel, { color: colors.muted }]}>Última Atualização</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>
                                    {formatTimestamp(lastPos.timestamp)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Gauge size={20} color={colors.primary} />
                            <View style={styles.infoTextContainer}>
                                <Text style={[styles.infoLabel, { color: colors.muted }]}>Velocidade Atual</Text>
                                <Text style={[styles.infoValue, { color: colors.primary, fontSize: 22, fontWeight: '800' }]}>
                                    {lastPos.speed} <Text style={{ fontSize: 14 }}>km/h</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1, // Ocupa a metade superior
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    panel: {
        flex: 1, // Ocupa a metade inferior
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        marginTop: -30, // Sobreposição leve
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 20,
    },
    panelContent: {
        flex: 1,
        padding: 25,
        justifyContent: 'space-between',
    },
    vehicleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoSection: {
        flex: 1,
        justifyContent: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    infoTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    actionMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        borderTopWidth: 1,
    },
    actionButton: {
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
