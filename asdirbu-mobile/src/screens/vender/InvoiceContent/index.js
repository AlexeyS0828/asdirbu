import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity,FlatList, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header'
import Logo from '../../../components/logo'
import styles from './style';
import images from '../../../config/images';

const { width } = Dimensions.get('window')

function InvoiceContent({ navigation,route }) {
  const goBack = () => navigation.goBack();
  const { item } = route.params;
  return (
    <SafeAreaView style={styles.container} >
      <Header back={goBack}  title='Piniginė' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />
      <Text style={styles.subtext}>Atlikti darbai</Text>
      <View style={styles.imagecontainer}>
            <View style={styles.avatar_name}>
                <Text style={styles.font}>{item.name}</Text>
                <Text style={styles.font}>{item.date}</Text>
                <Text style={styles.font}>10:00 - 19:00</Text>
                <Text style={styles.font}>Kaunas, Lietuva</Text>
                <Text style={styles.font}>Suma 60 € </Text>
            </View>
            {item.status == "done"&&<Button title='Atlikta' style={{backgroundColor:"#10AC1F",width:width/3 -10}}/> }
            {item.status == "pregress"&&<Button title='Vykdoma' style={{backgroundColor:"#E57D33",width:width/3 -10}}/> }
            {item.status == "incomplete"&&<Button title='Nebaigta' style={{backgroundColor:"#FF2020",width:width/3 -10}}/> }
        </View>
        <View style={styles.invoiceContent}>
            <View style={styles.invoiceImage}>
                <Image source={images.invoice} />
                <Text style={styles.invoicetext}>Sąskaita faktūra</Text>
            </View>
            <Button title='Išrašyti' style={{backgroundColor:"#E57D33",width:width/3 -10}}/>
        </View>
    </SafeAreaView>
  )
}

export default InvoiceContent;
