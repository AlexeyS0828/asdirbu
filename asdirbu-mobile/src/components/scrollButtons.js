import React from 'react';
import {ScrollView, TouchableOpacity, Text, StyleSheet, View} from 'react-native';

const ScrollButtons = ({array, selectItem, selectedItem, style}) => (
    <View style={[{height: 50},style]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
            {
                array.map(d => (
                    <TouchableOpacity
                        key={d} activeOpacity={0.9}
                        style={[styles.dayView, 
                            { backgroundColor: selectedItem === d ? '#e80606' : '#fff', 
                            borderColor:selectedItem === d ? '#e80606':'#dfdfdf' }]}
                        onPress={() => selectItem(d)}
                    >
                        <Text style={[styles.font15, { color: selectedItem === d ? '#fff' : '#dfdfdf' }]}>{d}</Text>
                    </TouchableOpacity>
                ))
            }
        </ScrollView>
    </View>
)

const styles = StyleSheet.create({
    dayView: {
        height: 37,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#dfdfdf',
        marginRight: 10,
        borderRadius: 12
    },
    scrollView: {
        flexDirection: 'row',
        paddingLeft: 20,        
        height: 50
    },
    font15: {
        fontSize: 15,
        letterSpacing: 0.24,
        lineHeight: 16,
        color: '#fff',
        fontWeight: '900'
    },
})

export default ScrollButtons