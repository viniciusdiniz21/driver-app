import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../theme/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, MapPin, Gauge, Navigation } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RastroStackParamList } from '../navigation/RastroStack';

const { width } = Dimensions.get('window');

const RastroDetailScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RastroStackParamList, 'RastroDetail'>>();
    const { viagem } = route.params;

    const initialRegion = {
        latitude: viagem.path[Math.floor(viagem.path.length / 2)].latitude,
        longitude: viagem.path[Math.floor(viagem.path.length / 2)].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                userInterfaceStyle={isDark ? 'dark' : 'light'}
            >
                <Polyline
                    coordinates={viagem.path}
                    strokeColor={colors.primary}
                    strokeWidth={4}
                />

                {/* Marcador de Início */}
                <Marker coordinate={viagem.path[0]} title="Início">
                    <View style={[styles.marker, { backgroundColor: '#4CAF50' }]}>
                        <MapPin size={16} color="#FFF" />
                    </View>
                </Marker>

                {/* Marcador de Fim */}
                <Marker coordinate={viagem.path[viagem.path.length - 1]} title="Fim">
                    <View style={[styles.marker, { backgroundColor: '#F44336' }]}>
                        <MapPin size={16} color="#FFF" />
                    </View>
                </Marker>
            </MapView>

            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: colors.card }]}
                onPress={() => navigation.goBack()}
            >
                <ChevronLeft size={28} color={colors.text} />
            </TouchableOpacity>

            {/* Detail Panel */}
            <View style={[styles.panel, { backgroundColor: colors.card }]}>
                <View style={styles.indicator} />
                <View style={styles.panelContent}>
                    <Text style={[styles.title, { color: colors.text }]}>Detalhes da Viagem</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Navigation size={22} color={colors.primary} />
                            <View style={styles.statTextContainer}>
                                <Text style={[styles.statLabel, { color: colors.muted }]}>Distância</Text>
                                <Text style={[styles.statValue, { color: colors.text }]}>{viagem.distance} km</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.statItem}>
                            <Gauge size={22} color={colors.primary} />
                            <View style={styles.statTextContainer}>
                                <Text style={[styles.statLabel, { color: colors.muted }]}>Vel. Máxima</Text>
                                <Text style={[styles.statValue, { color: colors.text }]}>{viagem.maxSpeed} km/h</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default RastroDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    marker: {
        padding: 5,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    panel: {
        position: 'absolute',
        bottom: 0,
        width: width,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 20,
    },
    indicator: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 15,
    },
    panelContent: {
        padding: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 20,
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
    statTextContainer: {
        marginLeft: 12,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 15,
    },
});
