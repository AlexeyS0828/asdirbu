import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header'
import styles from './style';
import images from '../../../config/images';

const { width } = Dimensions.get('window')

function Details({ navigation,route }) {
  const { title, image } = route.params;
  const gotoLogin = () => navigation.navigate('Login');
  const goBack = () => navigation.goBack();
  return (
    <SafeAreaView style={styles.container} >
      <Header back={goBack}  title='Žinutės' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />
      <View style={styles.maincontainer}>
        <View style={styles.itemlist}>
            <Image source={{ uri: image }}  style={{ width: 50, height: 50 }} />
            <Text style={styles.list_text}>{title}</Text>
        </View>
        <View style={styles.textlist}>
            <Text style={styles.textltem}>Skelbimo pavadinimas :</Text>
            <Text style={styles.textltem_right}>Reikia it pagalbos</Text>
        </View>
        <View style={styles.textlist}>
            <Text style={styles.textltem}>Paslaugos priemimo laikas :</Text>
            <Text style={styles.textltem_right}>11:30</Text>
        </View>
        <View style={styles.textlist}>
            <Text style={styles.textltem}>Papasakok plačiau :</Text>
            <Text style={styles.textltem_right}>reik it pagalbos</Text>
        </View>
        <View style={styles.textlist}>
            <Text style={styles.textltem}>Paslaugos kaina</Text>
            <Text style={styles.textltem_right}>9</Text>
        </View>
        <View style={styles.textlist}>
            <Text style={styles.textltem}>Paslaugos priėmimo data :</Text>
            <Text style={styles.textltem_right}>2020-06-25</Text>
        </View>
        <View style={styles.textlist}>
            <Text style={styles.textltem}>Paslaugos suteikimo vieta</Text>
            <Text style={styles.textltem_right}>Kaun</Text>
        </View>
        <View style={styles.button_icon}>
            <Button title='Mokėti 9 €' style={{width: width-120}}/>
        </View>

        <View style={styles.sendmessage}>
            <Text style={styles.sendmessagetext}>Rašyti žinutę</Text>
            <Image source={images.playbutton} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Details;
