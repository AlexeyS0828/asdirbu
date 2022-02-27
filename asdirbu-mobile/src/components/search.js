import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import images from '../config/images'
const { width, height } = Dimensions.get('window')
const SearchBar = ({ search, style, clear, onChangeText,getresult }) => (
    <View style={[styles.container, style]}>
        <TouchableOpacity onPress={getresult}>
            <Image source={images.search} style={styles.searchIcon}/>
        </TouchableOpacity>
        <TextInput
            placeholder='Type location or service...'
            placeholderTextColor='#bfbfbf'
            underlineColorAndroid='transparent'
            value={search}
            onChangeText={onChangeText}
            style={styles.input}
            autoCapitalize='none'
            autoCorrect={false}
        />
        {search !== '' &&
            <TouchableOpacity activeOpacity={0.8} onPress={clear} style={styles.clear}>
                <Icon name='md-close-circle' color='#bfbfbf' size={20} />
            </TouchableOpacity>}
    </View>
)

const styles = StyleSheet.create({
    container: {
        width: width *0.8,
        height: 45,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',   
        paddingLeft: 13     
    },
    searchIcon:{
        width: 30,
        height: 30
    },
    input: {
        width: width * 0.656 - 80,
        fontSize: 14,
        color: 'rgba(45,45,45,0.5)',
        letterSpacing: 0.24,
        marginLeft: 10
    },
    clear: {
        position: 'absolute',
        right: 10
    }
})

export default SearchBar
