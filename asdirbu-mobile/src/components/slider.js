import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Slider } from '@miblanchard/react-native-slider';
const { width } = Dimensions.get('window');

const SliderComponent = ({ value, title, unit, clear, onValueChange, max, min, style }) => (
    <View style={[styles.container, style]}>
        <View style={[styles.flexDirection, { justifyContent: 'space-between' }]}>
            <Text style={styles.font16}>{title}</Text>
            <View style={styles.flexDirection}>
                <Text style={[styles.font16, { color: '#e80606', fontWeight: '400', marginRight: 8 }]}>{value + unit}</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={clear}>
                    <Icon name='md-close-circle' color='#bfbfbf' size={20} />
                </TouchableOpacity>
            </View>
        </View>
        <Slider
            maximumValue={max} minimumValue={min}
            maximumTrackTintColor='#bfbfbf' minimumTrackTintColor='#e80606'
            value={value} onValueChange={onValueChange}
            thumbStyle={{backgroundColor: 'white',borderWidth: 2, borderColor: '#dfdfdf', width: 30, height: 30, borderRadius: 20}}
            step={1}
        />
    </View>
)

const styles = StyleSheet.create({
    container: {
        width: width - 88,
    },
    flexDirection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    font16: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d2d2d',
        letterSpacing: 0.24
    }
})

export default SliderComponent