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
const joblist = [
    {
        id :1,
        name: 'Santechnikas',
        date : "12/03/2020",
        status  :"done"
    },
    {
        id :2,
        name: 'Santechnikas',
        date : "12/03/2020",
        status  :"pregress"
    },
    {
        id :3,
        name: 'Santechnikas',
        date : "12/03/2020",
        status  :"done"
    },
    {
        id :4,
        name: 'Santechnikas',
        date : "12/03/2020",
        status  :"incomplete"
    }
]
function Invoice({ navigation }) {
  const goBack = () => navigation.goBack();
  const renderItem = ({ item, index }) => (
    <TouchableOpacity activeOpacity={0.8} style={[styles.flexDirection, styles.item]} 
    onPress={() => navigation.navigate('InvoiceContent', {
        item: item
    })  }> 
        
        <View style={styles.imagecontainer}>
            <View style={styles.avatar_name}>
                <Text style={styles.font}>{item.name}</Text>
                <Text style={styles.font}>{item.date}</Text>
            </View>
            {item.status == "done"&&<Button title='Atlikta' style={{backgroundColor:"#10AC1F",width:width/3 -10}}/> }
            {item.status == "pregress"&&<Button title='Vykdoma' style={{backgroundColor:"#E57D33",width:width/3 -10}}/> }
            {item.status == "incomplete"&&<Button title='Nebaigta' style={{backgroundColor:"#FF2020",width:width/3 -10}}/> }
        </View>
    </TouchableOpacity>
)
  return (
    <SafeAreaView style={styles.container} >
      <Header back={goBack}  title='Piniginė' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />
      <Text style={styles.subtext}>Atlikti darbai</Text>
      <View>
      <FlatList
            data={joblist}
            renderItem={renderItem}
            horizontal={false}
            keyExtractor={item => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  )
}

export default Invoice;
