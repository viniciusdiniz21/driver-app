import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { MockDataService } from '../services/MockDataService';
import { Viagem } from '../mocks/data';
import { Key, ChevronRight, Clock, Map as MapIcon } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RastroStackParamList } from '../navigation/RastroStack';

const RastroListScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RastroStackParamList>>();
    const viagens = MockDataService.getViagens();

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const renderItem = ({ item }: { item: Viagem }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('RastroDetail', { viagem: item })}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Key size={24} color={colors.primary} />
            </View>

            <View style={styles.cardContent}>
                <View style={styles.dateRow}>
                    <Text style={[styles.dateText, { color: colors.muted }]}>{formatDate(item.startTime)}</Text>
                    <View style={[styles.badge, { backgroundColor: colors.primary + '10' }]}>
                        <Text style={[styles.badgeText, { color: colors.primary }]}>{item.distance} km</Text>
                    </View>
                </View>

                <View style={styles.timeRow}>
                    <View style={styles.timeItem}>
                        <Clock size={14} color={colors.muted} />
                        <Text style={[styles.timeLabel, { color: colors.muted }]}>Início:</Text>
                        <Text style={[styles.timeValue, { color: colors.text }]}>{formatTime(item.startTime)}</Text>
                    </View>
                    <View style={styles.timeDivider} />
                    <View style={styles.timeItem}>
                        <Text style={[styles.timeLabel, { color: colors.muted }]}>Fim:</Text>
                        <Text style={[styles.timeValue, { color: colors.text }]}>{formatTime(item.endTime)}</Text>
                    </View>
                </View>
            </View>

            <ChevronRight size={20} color={colors.border} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Minhas Viagens</Text>
                <Text style={[styles.headerSubtitle, { color: colors.muted }]}>Histórico de rastro por ignição</Text>
            </View>

            <FlatList
                data={viagens}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MapIcon size={60} color={colors.border} />
                        <Text style={[styles.emptyText, { color: colors.muted }]}>Nenhuma viagem encontrada</Text>
                    </View>
                }
            />
        </View>
    );
};

export default RastroListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
    },
    headerSubtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    listContent: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
        marginLeft: 4,
        marginRight: 4,
    },
    timeValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    timeDivider: {
        width: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
    },
});
