import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window')

const Button = ({style, onPress, title, addtitle, titleStyle, disable}) => (
    <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.container, {backgroundColor: disable?'#dfdfdf':'#E57D33'},  style]}
        onPress={disable?void(0):onPress}
    >
        {!addtitle ?
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        :<Text style={[styles.addtitle, titleStyle]}>{addtitle}</Text>}
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        width: width - 88,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#E57D33',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 14,
        zIndex: 10
    },
    addtitle: {
        fontSize: 30,
        color: 'black',
        letterSpacing: 1.3
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1.3
    }
})

export default Button;