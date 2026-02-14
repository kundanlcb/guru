import { Platform } from 'react-native';

export const colors = {
    primary: {
        600: '#5A53D6', // Brand Primary
        500: '#6A63E8',
        200: '#D6D3F5',
        100: '#E9E7FB',
        50: '#F5F7FF',
    },
    surface: {
        app: '#F3F4F6',   // App background
        card: '#FFFFFF',  // Card background
        soft: '#F7F8FB',  // Secondary blocks
        default: '#FFFFFF',
        background: '#F3F4F6',
        overlay: 'rgba(0, 0, 0, 0.5)',
    },
    status: {
        success: '#20A56F',
        danger: '#EC6B57',
        warning: '#F2B457',
        info: '#3DB9BE',
    },
    text: {
        primary: '#1F2533',
        secondary: '#6E7583',
        inverse: '#FFFFFF',
        tertiary: '#9CA3AF',
        disabled: '#9CA3AF',
    },
    border: {
        soft: '#E4E7EC',
        default: '#E0E0E0',
        focused: '#5A53D6',
    },
    // Premium theme additions
    premium: {
        background: '#FFFFFF',
        border: '#E0E0E0',
        textTitle: '#B4922B',
        badge: 'gold',
        badgeText: '#FFF',
        card: '#FFF'
    },
    today: {
        background: '#FFF8E1',
        border: '#FFE082',
    }
} as const;

export const spacing = {
    none: 0,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
    '3xl': 48,
    '4xl': 64,
} as const;

export const radius = {
    none: 0,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    full: 9999,
} as const;

export const shadows = {
    sm: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
} as const;

export const typography = {
    fontFamily: {
        primary: {
            regular: 'Inter-Regular',
            medium: 'Inter-Medium',
            semibold: 'Inter-SemiBold',
            bold: 'Inter-Bold',
        }
    },
    weight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    } as const,
    size: {
        xs: 12,
        s: 14,
        m: 16,
        l: 18,
        xl: 24,
        xxl: 32,
    } as const,
} as const;

export const theme = {
    colors,
    spacing,
    radius,
    shadows,
    typography,
};
