import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, StyleSheet, Pressable } from 'react-native';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { theme } from '../../theme/tokens';

interface DropdownProps {
    label?: string;
    placeholder?: string;
    value: any;
    options: { label: string; value: any }[];
    onSelect: (value: any) => void;
    style?: any;
}

export const Dropdown = ({ label, placeholder = 'Select', value, options, onSelect, style }: DropdownProps) => {
    const [visible, setVisible] = useState(false);
    const selectedOption = options.find(o => o.value === value);

    const handleSelect = (val: any) => {
        onSelect(val);
        setVisible(false);
    };

    return (
        <View style={[styles.container, style]}>
            {label && <AppText size="xs" weight="bold" color={theme.colors.text.secondary} style={styles.label}>{label}</AppText>}
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
            >
                <AppText
                    color={selectedOption ? theme.colors.text.primary : theme.colors.text.tertiary}
                    weight={selectedOption ? 'medium' : 'regular'}
                    numberOfLines={1}
                    style={{ flex: 1 }}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </AppText>
                <Icon name="chevron-down" size={20} color={theme.colors.text.secondary} library="feather" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <AppText weight="bold" size="l">{label || 'Select Option'}</AppText>
                            <TouchableOpacity onPress={() => setVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Icon name="x" size={24} color={theme.colors.text.secondary} library="feather" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={(item, idx) => String(item.value) + idx}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.option, value === item.value && styles.optionSelected]}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <AppText
                                        color={value === item.value ? theme.colors.primary[600] : theme.colors.text.primary}
                                        weight={value === item.value ? 'bold' : 'medium'}
                                    >
                                        {item.label}
                                    </AppText>
                                    {value === item.value && (
                                        <Icon name="check" size={20} color={theme.colors.primary[600]} library="feather" />
                                    )}
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // base container
    },
    label: {
        marginBottom: 6,
        marginLeft: 4,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '60%',
        paddingTop: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.soft,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FC',
    },
    optionSelected: {
        backgroundColor: '#F8FAFC',
    }
});
