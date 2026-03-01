import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { colors, ThemeColors } from './colors';

interface ThemeContextType {
    colors: ThemeColors;
    isDark: boolean;
    colorScheme: ColorSchemeName;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ColorSchemeName>(null);

    // Se o usuário não escolheu manualmente, segue o sistema.
    const activeColorScheme = themeMode || systemColorScheme;
    const isDark = activeColorScheme === 'dark';
    const themeColors = isDark ? colors.dark : colors.light;

    const toggleTheme = () => {
        setThemeMode(prev => (prev === 'dark' || (!prev && systemColorScheme === 'dark') ? 'light' : 'dark'));
    };

    const value = {
        colors: {
            primary: colors.primary,
            ...themeColors,
        },
        isDark,
        colorScheme: activeColorScheme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
