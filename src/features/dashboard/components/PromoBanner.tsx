import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme/tokens';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - (theme.spacing.xl * 2); // Screen width minus padding (xl in Guru)

const BANNERS = [
    { title: 'New Teaching\nTools Added!', color: '#5A53D6', icon: '🛠️' },
    { title: 'Upcoming\nStaff Meeting', color: '#F29C4C', icon: '📅' },
    { title: 'Exam Papers\nReview', color: '#20A56F', icon: '📝' },
];

export const PromoBanner = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {BANNERS.map((banner, index) => (
                    <View key={index} style={[styles.container, { backgroundColor: banner.color }]}>
                        <View style={styles.content}>
                            <AppText size="l" weight="bold" color="#FFF" style={styles.title}>
                                {banner.title}
                            </AppText>
                            <TouchableOpacity style={styles.button}>
                                <AppText size="s" weight="bold" color={banner.color}>Check Now</AppText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.illustration}>
                            <AppText size="xxl" style={{ fontSize: 40 }}>{banner.icon}</AppText>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.dotsContainer}>
                {BANNERS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: index === activeIndex ? theme.colors.primary[600] : theme.colors.border.default }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: theme.spacing.l,
    },
    scrollView: {
        borderRadius: theme.radius.l,
        overflow: 'hidden',
    },
    container: {
        width: BANNER_WIDTH,
        backgroundColor: theme.colors.primary[600],
        padding: theme.spacing.l,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 160,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        marginBottom: theme.spacing.l,
        lineHeight: 28,
        fontSize: 22,
    },
    button: {
        backgroundColor: '#FFF',
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.s + 2,
        borderRadius: theme.radius.full,
        alignSelf: 'flex-start',
    },
    illustration: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.s,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
});
