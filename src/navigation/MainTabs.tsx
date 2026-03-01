import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Map, History, User } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';

import HomeScreen from '../screens/HomeScreen';
import RotaScreen from '../screens/RotaScreen';
import RastroStack from './RastroStack';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabParamList = {
    Home: undefined;
    Rota: undefined;
    Rastro: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
    const { colors, isDark } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                    tabBarLabel: 'Início',
                }}
            />
            <Tab.Screen
                name="Rota"
                component={RotaScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Rastro"
                component={RastroStack}
                options={{
                    tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
                    tabBarLabel: 'Rastro',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                    tabBarLabel: 'Perfil',
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;
