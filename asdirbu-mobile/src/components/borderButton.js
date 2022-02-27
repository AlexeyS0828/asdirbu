import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const Button = (props) => (
    <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.container, props.style]}
        onPress={props.onPress}
    >
        <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        width: 134,
        height: 45,
        borderRadius: 12,
        borderColor: '#EDF3F6',
        borderWidth: 0,
        backgroundColor: '#EDF3F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 14
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black'
    }
})

export default Button;