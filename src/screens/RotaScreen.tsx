import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, Navigation } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';

const { width } = Dimensions.get('window');

const EXPO_PUBLIC_GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY;

const RotaScreen = () => {
    const { colors, isDark } = useTheme();
    const mapRef = useRef<MapView>(null);

    const [origin, setOrigin] = useState<{ latitude: number, longitude: number } | null>(null);
    const [destination, setDestination] = useState<{ latitude: number, longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos da sua localização para traçar a rota.');
                setLoading(false);
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setOrigin({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Obtendo localização...</Text>
            </View>
        );
    }

    const initialRegion = {
        latitude: origin?.latitude || -18.9113,
        longitude: origin?.longitude || -48.2622,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                userInterfaceStyle={isDark ? 'dark' : 'light'}
            >
                {origin && (
                    <Marker coordinate={origin} title="Você está aqui">
                        <View style={[styles.markerContainer, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                            <Navigation size={22} color={colors.primary} fill={colors.primary} />
                        </View>
                    </Marker>
                )}

                {destination && (
                    <Marker coordinate={destination} title="Destino">
                        <View style={[styles.markerContainer, { backgroundColor: colors.card, borderColor: '#FF4444' }]}>
                            <MapPin size={22} color="#FF4444" fill="#FF4444" />
                        </View>
                    </Marker>
                )}

                {origin && destination && (
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={EXPO_PUBLIC_GOOGLE_MAPS_APIKEY}
                        strokeWidth={4}
                        strokeColor={colors.primary}
                        onReady={(result) => {
                            mapRef.current?.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    top: 100,
                                    right: 50,
                                    bottom: 100,
                                    left: 50,
                                },
                            });
                        }}
                        onError={(errorMessage) => {
                            console.error('Directions Error:', errorMessage);
                        }}
                    />
                )}
            </MapView>

            {/* Overlay Search - Google Places Autocomplete */}
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Para onde vamos?"
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        if (details) {
                            setDestination({
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng,
                            });
                        }
                    }}
                    query={{
                        key: EXPO_PUBLIC_GOOGLE_MAPS_APIKEY,
                        language: 'pt-BR',
                    }}
                    styles={{
                        container: styles.autocompleteContainer,
                        textInput: [styles.input, { backgroundColor: colors.card, color: colors.text }],
                        listView: [styles.listView, { backgroundColor: colors.card }],
                        row: { backgroundColor: colors.card, padding: 13, height: 44, flexDirection: 'row' },
                        separator: { height: 0.5, backgroundColor: colors.border },
                        description: { color: colors.text },
                        predefinedPlacesDescription: { color: colors.primary },
                    }}
                    enablePoweredByContainer={false}
                    minLength={2}
                    keyboardShouldPersistTaps="handled"
                    nearbyPlacesAPI="GooglePlacesSearch"
                />
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
        flex: 1,
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
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    searchContainer: {
        position: 'absolute',
        top: 60,
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    autocompleteContainer: {
        flex: 0,
    },
    input: {
        borderRadius: 15,
        height: 55,
        fontSize: 16,
        fontWeight: '500',
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    listView: {
        borderRadius: 15,
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 20,
    },
});
