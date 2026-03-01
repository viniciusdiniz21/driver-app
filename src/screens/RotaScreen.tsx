import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Alert,
    Keyboard,
    Dimensions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { StatusBar } from 'expo-status-bar';

// Mock de MapViewDirections pois não temos API Key
// import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');

const RotaScreen = () => {
    const { colors, isDark } = useTheme();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(true);
    const [routing, setRouting] = useState(false);
    const [destCoords, setDestCoords] = useState<{ latitude: number, longitude: number } | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos da sua localização para traçar a rota.');
                setLoading(false);
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            setLoading(false);
        })();
    }, []);

    const handleTraceRoute = () => {
        if (!destination) return;

        Keyboard.dismiss();
        setRouting(true);

        // Simulação de busca de endereço e traçado de rota
        setTimeout(() => {
            if (location) {
                // Mock: coloca o destino 2km ao norte do usuário
                setDestCoords({
                    latitude: location.coords.latitude + 0.015,
                    longitude: location.coords.longitude + 0.01,
                });
            }
            setRouting(false);
        }, 1500);
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Buscando sua localização...</Text>
            </View>
        );
    }

    const initialRegion = {
        latitude: location?.coords.latitude || -18.9113,
        longitude: location?.coords.longitude || -48.2622,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View style={styles.container}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                userInterfaceStyle={isDark ? 'dark' : 'light'}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Você está aqui"
                    >
                        <View style={[styles.markerContainer, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                            <MapPin size={24} color={colors.primary} fill={colors.primary} />
                        </View>
                    </Marker>
                )}

                {destCoords && (
                    <Marker
                        coordinate={destCoords}
                        title="Destino"
                        pinColor="red"
                    />
                )}

                {/* 
                {location && destCoords && (
                    <MapViewDirections
                        origin={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                        destination={destCoords}
                        apikey="SUA_API_KEY_AQUI"
                        strokeWidth={3}
                        strokeColor={colors.primary}
                    />
                )}
                */}
            </MapView>

            {/* Overlay Search Card */}
            <View style={[styles.searchCard, { backgroundColor: colors.card }]}>
                <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}>
                    <Search size={20} color={colors.muted} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Para onde vamos?"
                        placeholderTextColor={colors.muted}
                        value={destination}
                        onChangeText={setDestination}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.routeButton, { backgroundColor: colors.primary }]}
                    onPress={handleTraceRoute}
                    disabled={routing || !destination}
                >
                    {routing ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Navigation size={20} color="#FFF" />
                            <Text style={styles.routeButtonText}>Traçar Rota</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RotaScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '500',
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
    searchCard: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        borderRadius: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 12,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    routeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 12,
        gap: 10,
    },
    routeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
