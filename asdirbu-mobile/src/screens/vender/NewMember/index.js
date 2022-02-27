import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet,FlatList, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header'
import Logo from '../../../components/logo'
import styles from './style';
import images from '../../../config/images';
import { stubArray } from 'lodash';

const { width } = Dimensions.get('window')
const memberlist = [
    {
        id :1,
        image: 'https://i.imgur.com/UYiroysl.jpg',
        name: 'Santechnikas',
        horuly : "Per valandą"
    },
    {
        id :2,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        horuly : "Per valandą"
    },
    {
        id :3,
        image: 'https://i.imgur.com/MABUbpDl.jpg',
        name: 'Santechnikas',
        horuly : "Per valandą"
    },
    {
        id :4,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        horuly : "Per valandą"
    },
    {
        id :5,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        horuly : "Per valandą"
    },
    {
        id :6,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        horuly : "Per valandą"
    },
    {
        id :7,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        horuly : "Per valandą"
    }
]

function NewMember({ navigation }) {
  const member = useSelector(state => state.session.member.data.newMemberList);
  console.log(member);
  const goBack = () => navigation.goBack();
  const renderItem = ({ item, index }) => (
    <TouchableOpacity activeOpacity={0.8} style={[styles.flexDirection, styles.item]} 
    onPress={() => navigation.navigate('Itemdetails', {
        item: item
    })  }> 
        
        <View style={styles.imagecontainer}>
            <View style={styles.avatar_name}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <Text style={styles.font12}>{item.name}</Text>
            </View>
            <View style={styles.hourly_content}>
                <Text style={styles.font18}>{item.hourrate}</Text>
            </View>
            
        </View>
    </TouchableOpacity>
)
  return (
    <SafeAreaView style={styles.container} >
      <View>
        <Header back={goBack}  title='Nauji nariai' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />

        <FlatList
                data={member}
                renderItem={renderItem}
                horizontal={false}
                keyExtractor={item => item.id.toString()}
            />
      </View>
    </SafeAreaView>
  )
}

export default NewMember;
