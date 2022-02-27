import React from 'react';
import { View, StyleSheet } from 'react-native';

const Dots = (props) => (
    <View style={[styles.container, props.style]}>
        {
            [0, 1, 2, 3].map(d => (
                <View style={d<=props.dot?styles.dot:styles.unselectDot} key={d} />
            ))
        }
    </View>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 51,
        position: 'absolute',
        bottom: 130
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#e80606'
    },
    unselectDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#dfdfdf'
    }
})

export default Dots