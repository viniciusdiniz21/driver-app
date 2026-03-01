export const colors = {
    primary: '#FF8C00', // Laranja
    light: {
        background: '#FFFFFF',
        text: '#1A1A1A',
        secondary: '#F5F5F5',
        border: '#E0E0E0',
        muted: '#757575',
        card: '#FFFFFF',
    },
    dark: {
        background: '#121212',
        text: '#F5F5F5',
        secondary: '#1E1E1E',
        border: '#333333',
        muted: '#9E9E9E',
        card: '#1E1E1E',
    },
};

export type ThemeColors = typeof colors.light & { primary: string };
