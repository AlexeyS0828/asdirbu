import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header'
import Logo from '../../../components/logo'
import styles from './style';
import images from '../../../config/images';
import ProgressCircle from 'react-native-progress-circle'

const { width } = Dimensions.get('window')

function Income({ navigation }) {
  const gotoLogin = () => navigation.navigate('Login')
  return (
    <SafeAreaView style={styles.container} >
      <View>
        <Text style={styles.hearderText}>Pradėk sekti darbo valandas dabar ir gauk apmokėjimą už kiekvieną darbo minutę.</Text>
        <View style={styles.cercleImage} elevation={5}>
          <ProgressCircle
              percent={20}
              radius={width/2 -10}
              borderWidth={8}
              color="#E57D33"
              shadowColor="#707070"
              bgColor="#fff"
          >
            
              <Text style={styles.cercletext}>{'Dirbate'}</Text>
              <Text style={styles.cercletext1}>{'10(eur mark) 55ct'}</Text>
          </ProgressCircle>
        </View>
        <View style={styles.buttonlist}>
          <Button title='Pradėti' style={{backgroundColor:"#10AC1F",width:width/3 -10}}/>
          <Button title='Stabdyti' style={{backgroundColor:"#FF2020",width:width/3 -10}}/>
          <Button title='Baigti' style={{backgroundColor:"#E57D33",width:width/3 -10}}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Income;
