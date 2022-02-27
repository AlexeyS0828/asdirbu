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

function MainRegister({ navigation }) {
  const gotoPersonalRegister = () => navigation.navigate('PersonalRegister');
  const gotoComponyRegister = () => navigation.navigate('ComponyRegister');
  return (
    <SafeAreaView style={styles.container} >
      <View>
        <Logo /> 
        <View style={styles.middlecontainer}>
           <Image source={Images.register_icon}/>
          <Text style={styles.rask}>Registracija</Text>
          <Button title='Individualūs' style={styles.button} titleStyle={styles.buttonTitle} onPress={gotoPersonalRegister}/>
          <Button title='Verslo klientai' style={styles.button1} titleStyle={styles.buttonTitle} onPress={gotoComponyRegister}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MainRegister;
