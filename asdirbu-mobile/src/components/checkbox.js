import React from 'react';
import {Image, View, TouchableOpacity, StyleSheet} from 'react-native';
import images from '../config/images';

const Checkbox = ({check, onPress}) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {check?
            <View style={styles.checked}>
                <Image source={images.check} style={{width: 10, height: 7}}/>
            </View>:
            <View style={styles.unchecked}/>
        }
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    checked: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#e80606',
        justifyContent: 'center',
        alignItems: 'center'
    },
    unchecked: {
        width: 18,
        height: 18,
        borderRadius: 10,
        borderColor: '#bfbfbf',
        borderWidth: 2
    }
})

export default Checkbox