import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Switch,
    ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { MockDataService } from '../services/MockDataService';
import { StatusBar } from 'expo-status-bar';
import { User as UserIcon, Mail, Car, CreditCard, LogOut, Moon, Sun, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const navigation = useNavigation();
    const user = MockDataService.getUser();

    const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
        <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Icon size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Meu Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Pic & Name */}
                <View style={styles.profileHeader}>
                    <Image source={{ uri: user.photo }} style={[styles.avatar, { borderColor: colors.primary }]} />
                    <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.email, { color: colors.muted }]}>{user.email}</Text>
                </View>

                {/* Info Section */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <InfoItem icon={UserIcon} label="Nome Completo" value={user.name} />
                    <InfoItem icon={Mail} label="E-mail" value={user.email} />
                    <InfoItem icon={Car} label="Modelo do Carro" value={user.carModel} />
                    <InfoItem icon={CreditCard} label="Placa" value={user.licensePlate} />
                </View>

                {/* Settings Section */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelContainer}>
                            {isDark ? <Moon size={22} color={colors.primary} /> : <Sun size={22} color={colors.primary} />}
                            <Text style={[styles.settingLabel, { color: colors.text }]}>Modo Escuro</Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: colors.primary + '80' }}
                            thumbColor={isDark ? colors.primary : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={[styles.logoutButton, { borderColor: '#FF4444' }]}
                    onPress={logout}
                >
                    <LogOut size={20} color="#FF4444" />
                    <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        marginTop: 4,
    },
    section: {
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 20,
        overflow: 'hidden',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        borderRadius: 15,
        borderWidth: 1,
        marginTop: 10,
    },
    logoutText: {
        color: '#FF4444',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
});
