import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RastroListScreen from '../screens/RastroListScreen';
import RastroDetailScreen from '../screens/RastroDetailScreen';
import { Viagem } from '../mocks/data';

export type RastroStackParamList = {
    RastroList: undefined;
    RastroDetail: { viagem: Viagem };
};

const Stack = createNativeStackNavigator<RastroStackParamList>();

const RastroStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="RastroList" component={RastroListScreen} />
            <Stack.Screen name="RastroDetail" component={RastroDetailScreen} />
        </Stack.Navigator>
    );
};

export default RastroStack;
