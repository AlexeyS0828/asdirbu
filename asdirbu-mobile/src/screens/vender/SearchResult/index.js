import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, FlatList,TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header'
import Logo from '../../../components/logo'
import styles from './style';
import images from '../../../config/images';

const { width } = Dimensions.get('window')
const tmp = [
    {
        id :1,
        image: 'https://i.imgur.com/UYiroysl.jpg',
        name: 'Santechnikas',
        price: "€40"
    },
    {
        id :2,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        price: "€40"
    },
    {
        id :3,
        image: 'https://i.imgur.com/MABUbpDl.jpg',
        name: 'Santechnikas',
        price: "€40"
    },
    {
        id :4,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        price: "€40"
    }
]
function SearchResult({ navigation,route }) {
    const result = useSelector(state => state.session.data);
    const [joblist, setJoblist] = React.useState(result.data.joblist)
    const renderItem = ({ item, index }) => (
        <TouchableOpacity activeOpacity={0.8} style={[styles.flexDirection, styles.item]} 
        onPress={() => navigation.navigate('Itemdetails', {
            item: item
        })  }> 
            
            <View style={styles.imagecontainer}>
                <Text style={styles.font18}>{item.hourrate}</Text>
                <Text style={styles.font12}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )

    const goBack = () => navigation.navigate('Services');
  return (
    <SafeAreaView style={styles.container} >
      <Header back={goBack}  title='Greiti Darbai' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />
      <View>
        <FlatList
                data={joblist}
                renderItem={renderItem}
                horizontal={false}
                contentContainerStyle={styles.scrollView}
                keyExtractor={item => item.name.toString()}
            />
      </View>
    </SafeAreaView>
  )
}

export default SearchResult;
