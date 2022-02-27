import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AllBooking from '../screens/customer/Calendar/allBooking';
const { width } = Dimensions.get('window')
const BookingCard = ({ date, title, name, cancel, expired, bookAgain, review }) => (
    <View style={[styles.flexDirection, { backgroundColor: expired ? '#2d2d2d' : '#e80606' }]}>
        <View>
            <Text style={styles.font14}>{date}</Text>
            <Text style={[styles.font21, { color: 'white' }]}>{title}</Text>
            <Text style={[styles.font14, { fontWeight: '600' }]}>{name}</Text>
            {expired &&
                <View style={styles.expireView}>
                    <TouchableOpacity activeOpacity={0.8} onPress={bookAgain}>
                        <Text style={styles.font12}>BOOK AGAIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={review}>
                        <Text style={styles.font12}>LEAVE A REVIEW</Text>
                    </TouchableOpacity>
                </View>}
        </View>
        {!expired &&
            <TouchableOpacity activeOpacity={0.8} onPress={cancel} >
                <Text style={styles.font12}>CANCEL</Text>
            </TouchableOpacity>}
    </View>
);

const styles = StyleSheet.create({
    flexDirection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 40,
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: '#e80606',
        borderRadius: 17,
        marginTop: 20
    },
    font14: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 24,
        letterSpacing: 0.24,
        fontWeight: '300'
    },
    font21: {
        fontSize: 21,
        fontWeight: '700',
        color: '#e80606',
        lineHeight: 24
    },
    font12: {
        fontSize: 12,
        color: 'rgba(255,255,255,1)',
        lineHeight: 24,
        letterSpacing: 0.24,
        fontWeight: '600'
    },
    expireView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: width - 88
    }
});

export default BookingCard