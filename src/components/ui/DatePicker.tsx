import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { AppButton } from './AppButton';
import { theme } from '../../theme/tokens';

interface DatePickerProps {
    value?: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    label?: string;
    style?: any;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const DatePicker = ({ value, onChange, label, style }: DatePickerProps) => {
    const [visible, setVisible] = useState(false);

    // Parse the input or default to today
    const today = new Date();
    const defaultY = today.getFullYear();
    const defaultM = today.getMonth();
    const defaultD = today.getDate();

    let selY = defaultY, selM = defaultM, selD = defaultD;
    if (value && value.includes('-')) {
        const parts = value.split('-');
        selY = parseInt(parts[0], 10);
        selM = parseInt(parts[1], 10) - 1;
        selD = parseInt(parts[2], 10);
    }

    const [viewYear, setViewYear] = useState(selY);
    const [viewMonth, setViewMonth] = useState(selM);

    const openPicker = () => {
        setViewYear(selY);
        setViewMonth(selM);
        setVisible(true);
    };

    const handleNext = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handlePrev = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const onSelectDay = (d: number) => {
        const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        onChange(formatted);
        setVisible(false);
    };

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();

    const blankDays = Array.from({ length: firstDay }, (_, i) => i);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const displaySelected = value || `${selY}-${String(selM + 1).padStart(2, '0')}-${String(selD).padStart(2, '0')}`;

    return (
        <View style={style}>
            {label && <AppText weight="bold" style={styles.label}>{label}</AppText>}
            <TouchableOpacity style={styles.inputBox} onPress={openPicker} activeOpacity={0.7}>
                <AppText color={theme.colors.text.primary} weight="medium" style={{ flex: 1 }}>{displaySelected}</AppText>
                <Icon name="calendar" size={20} color={theme.colors.text.secondary} library="feather" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handlePrev} style={styles.arrowBtn}>
                                <Icon name="chevron-left" size={24} color={theme.colors.text.primary} library="feather" />
                            </TouchableOpacity>
                            <AppText weight="bold" size="l">{MONTHS[viewMonth]} {viewYear}</AppText>
                            <TouchableOpacity onPress={handleNext} style={styles.arrowBtn}>
                                <Icon name="chevron-right" size={24} color={theme.colors.text.primary} library="feather" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.daysHeader}>
                            {DAYS.map(day => (
                                <View key={day} style={styles.dayBox}>
                                    <AppText size="s" color={theme.colors.text.secondary} weight="bold">{day}</AppText>
                                </View>
                            ))}
                        </View>

                        <View style={styles.grid}>
                            {blankDays.map(b => <View key={`blank-${b}`} style={styles.dayBox} />)}
                            {monthDays.map(d => {
                                const isSelected = viewYear === selY && viewMonth === selM && d === selD;
                                const isToday = viewYear === defaultY && viewMonth === defaultM && d === defaultD;
                                return (
                                    <TouchableOpacity
                                        key={d}
                                        style={[
                                            styles.dayBox,
                                            isToday && !isSelected && styles.todayBox,
                                            isSelected && styles.selectedDayBox
                                        ]}
                                        onPress={() => onSelectDay(d)}
                                    >
                                        <AppText
                                            weight={isSelected ? 'bold' : 'medium'}
                                            color={isSelected ? '#FFF' : (isToday ? theme.colors.primary[600] : theme.colors.text.primary)}
                                        >
                                            {d}
                                        </AppText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <AppButton
                            title="Cancel"
                            variant="ghost"
                            onPress={() => setVisible(false)}
                            style={{ alignSelf: 'flex-end', marginTop: 16 }}
                            textStyle={{ fontSize: 14 }}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: theme.colors.text.primary,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    arrowBtn: {
        padding: 6,
        backgroundColor: theme.colors.surface.background,
        borderRadius: 12,
    },
    daysHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayBox: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    todayBox: {
        backgroundColor: theme.colors.primary[50],
    },
    selectedDayBox: {
        backgroundColor: theme.colors.primary[600],
    }
});
