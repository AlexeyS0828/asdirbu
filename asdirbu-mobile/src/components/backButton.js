import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Images from '../config/images';

const Back = (props) => (
    <TouchableOpacity  onPress={props.onPress} style={innerStyle.backcontent}>
        <Image source={Images.Back} style={innerStyle.backButton}/>
    </TouchableOpacity>
);

const innerStyle = StyleSheet.create({
    backButton: {
     
    },
    backcontent:{
       
        marginTop: 30,
        marginLeft:20
    }
});

export default Back