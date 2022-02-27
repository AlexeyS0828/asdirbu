import React from 'react';
import { ActivityIndicator, View, StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const Loader = ({visible}) => (
    visible ? 
    <View style={styles.container}>
        <ActivityIndicator size='large' color='#e80606'/>
    </View>:
    null
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
        zIndex: 100
    }
});

export default Loader