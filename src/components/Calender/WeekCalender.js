import React, { useState, useEffect, useRef } from 'react';
import {StyleSheet,Text,TouchableOpacity,View,ScrollView,} from 'react-native';
import { format, isSameDay, addDays, subDays } from 'date-fns';

const MonthCalendar = ({ date, onChange }) => {
    const itemWidth = 60; // Adjust this value based on your item width
    const visibleDays = 31; // Number of days to display in a full month
    const scrollViewRef = useRef(null);
    const [scrollX, setScrollX] = useState(0);

    useEffect(() => {
        // Calculate the initial start date to center on the selected date
        const initialStartDate = subDays(date, Math.floor(visibleDays / 2));
        const initialScrollX = Math.floor(visibleDays / 2) * itemWidth;
        scrollViewRef.current.scrollTo({ x: initialScrollX, animated: false });
        setScrollX(initialScrollX);
    }, [date]);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        setScrollX(contentOffsetX);
    };

    const centeredIndex = Math.round(scrollX / itemWidth);
    const centeredDate = addDays(subDays(date, Math.floor(visibleDays / 2)), centeredIndex);

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                ref={scrollViewRef}
                onScroll={handleScroll}
                snapToInterval={itemWidth}
                decelerationRate="fast"
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsHorizontalScrollIndicator={false}

            >
                {Array.from({ length: visibleDays }, (_, index) => {
                const day = addDays(subDays(date, Math.floor(visibleDays / 2)), index);

                const textStyles = [styles.label];
                const touchable = [styles.touchable];

                const sameDay = isSameDay(day, centeredDate);
                if (sameDay) {
                    textStyles.push(styles.selectedLabel);
                    touchable.push(styles.selectedTouchable);
                }

                return (
                    <View style={{ backgroundColor: "#ffa600" }}>

                    <TouchableOpacity
                        key={format(day, 'yyyy-MM-dd')}
                        onPress={() => onChange(day)}
                        style={touchable}
                    >
                        <Text style={textStyles}>{format(day, 'MMM')}</Text>
                        <Text style={styles.dayText}>{format(day, 'dd')}</Text>
                        <Text style={styles.dayOfWeek}>{format(day, 'EEE')}</Text>
                    </TouchableOpacity>
                    </View>
                );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 25
    },
    scrollView: {
        flexGrow: 0,
    },
    contentContainer: {
        flexDirection: 'row',
    },
    dayText: {
        color: 'black',
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 18,
    },
    dayOfWeek: {
        color: 'gray',
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    selectedLabel: {
        color: 'white',
        fontWeight: 'bold',
    },
    touchable: {
        borderRadius: 15,
        alignItems: 'center',
        width: 60,
        padding: 5,
        marginHorizontal: 5, // Add margin for spacing between items
    },
    selectedTouchable: {
        backgroundColor: '#ffa600',
        borderBottomColor: "green",
        borderBottomWidth: 3

    },
});

export default MonthCalendar;