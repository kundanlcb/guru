import React from 'react';
import { StyleProp, ViewStyle, Text, TextStyle } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../theme/tokens';

export type IconLibrary = 'feather' | 'material' | 'material-community' | 'ionicons';

interface IconProps {
    name: string;
    size?: number;
    color?: string;
    library?: IconLibrary;
    style?: StyleProp<TextStyle>;
}

export const Icon: React.FC<IconProps> = ({
    name,
    size = 24,
    color = theme.colors.text.primary,
    library = 'feather',
    style,
}) => {
    const iconProps = {
        name,
        size,
        color,
        style,
    };

    try {
        switch (library) {
            case 'material':
                return <MaterialIcon {...iconProps} />;
            case 'material-community':
                return <MaterialCommunityIcon {...iconProps} />;
            case 'ionicons':
                return <IonIcon {...iconProps} />;
            case 'feather':
            default:
                return <FeatherIcon {...iconProps} />;
        }
    } catch (error) {
        console.warn('Vector icon failed to render:', error);
        return null;
    }
};

export const AppIcons = {
    home: { name: 'home', library: 'feather' as IconLibrary },
    homeActive: { name: 'home', library: 'feather' as IconLibrary },

    calendar: { name: 'calendar', library: 'feather' as IconLibrary },

    profile: { name: 'user', library: 'feather' as IconLibrary },

    back: { name: 'arrow-left', library: 'feather' as IconLibrary },
    close: { name: 'x', library: 'feather' as IconLibrary },
    menu: { name: 'menu', library: 'feather' as IconLibrary },

    notifications: { name: 'bell', library: 'feather' as IconLibrary },
    logout: { name: 'log-out', library: 'feather' as IconLibrary },

    success: { name: 'check-circle', library: 'feather' as IconLibrary },
    error: { name: 'alert-circle', library: 'feather' as IconLibrary },
};
