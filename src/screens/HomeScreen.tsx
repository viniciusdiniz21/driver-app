import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Car, History, User as UserIcon, LogOut } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { MockDataService } from '../services/MockDataService';
import { StatusBar } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const { colors, isDark } = useTheme();
    const { logout } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const lastPos = MockDataService.getLastPosition();
    const user = MockDataService.getUser();

    const initialRegion = {
        latitude: lastPos.latitude,
        longitude: lastPos.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };

    return (
        <View style={styles.container}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

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
                    title="Sua Posição"
                    description={`${user.carModel} - ${user.licensePlate}`}
                >
                    <View style={[styles.markerContainer, { backgroundColor: '#FFF' }]}>
                        <Car size={30} color="#FE8330" fill="#FE8330" />
                    </View>
                </Marker>
            </MapView>

            {/* Floating Buttons */}
            <View style={styles.floatingButtons}>
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: colors.card }]}
                    onPress={logout}
                    activeOpacity={0.7}
                >
                    <LogOut size={24} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: colors.card }]}
                    onPress={() => navigation.navigate('History')}
                    activeOpacity={0.7}
                >
                    <History size={24} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: colors.card }]}
                    onPress={() => navigation.navigate('Profile')}
                    activeOpacity={0.7}
                >
                    <UserIcon size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Bottom Info Card */}
            <View style={[styles.bottomCard, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                <View style={styles.cardIndicator} />
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={[styles.address, { color: colors.text }]}>Av. Afonso Pena, 1200</Text>
                        <Text style={[styles.city, { color: colors.muted }]}>Uberlândia, MG</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.statusText, { color: colors.primary }]}>Online</Text>
                    </View>
                </View>

                <View style={styles.cardDetails}>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: colors.muted }]}>Última atualização</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>
                            {new Date(lastPos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: colors.muted }]}>Velocidade</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>{lastPos.speed} km/h</Text>
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
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
        padding: 8,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#FE8330',
    },
    floatingButtons: {
        position: 'absolute',
        right: 20,
        top: 60,
        gap: 15,
    },
    fab: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        width: width,
        paddingHorizontal: 25,
        paddingTop: 10,
        paddingBottom: 40,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    cardIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    address: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    city: {
        fontSize: 14,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
    },
});
