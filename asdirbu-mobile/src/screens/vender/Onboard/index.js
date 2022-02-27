import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header'
import Logo from '../../../components/logo'
import styles from './style';
import images from '../../../config/images';

const { width } = Dimensions.get('window')

function Onboard({ navigation }) {
  const gotoLogin = () => navigation.navigate('Login')
  return (
    <SafeAreaView style={styles.container} >
      <View>
        <Logo /> 
        <View style={styles.middlecontainer}>
          <Text style={styles.rask}>Rask Paslaugas Lietuvoje!</Text>
          <Button title='Pradėti' style={styles.button} titleStyle={styles.buttonTitle} onPress={gotoLogin}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Onboard;
