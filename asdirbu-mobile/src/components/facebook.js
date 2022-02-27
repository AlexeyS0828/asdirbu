import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import images from '../config/images'
const { width } = Dimensions.get('window')

const Facebook = (props) => (
    <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.container, props.style]}
        onPress={props.onPress}
    >
        <Image source={images.f_mark} style={styles.f_mark}/>
        <Text style={[styles.title, props.titleStyle]}>Continue With Facebook</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        width: width - 88,
        height: 45,
        borderRadius: 24,
        backgroundColor: '#3b5998',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 40
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1.3
    },
    f_mark: {
        width: 9,
        height: 20
    }
})

export default Facebook;