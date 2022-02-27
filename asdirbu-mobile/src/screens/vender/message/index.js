import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header';
import Input from '../../../components/input';
import styles from './style';
import images from '../../../config/images';

const { width } = Dimensions.get('window')

function Message({ navigation }) {
    const goBack = () => navigation.goBack();
    const [firstname, setFristname] = React.useState('Lorem Ipsum');
    const [secondname, setSecongname] = React.useState('Kęstutis Dimša');
    const [thirdname, setThridname] = React.useState('Lorem Ipsum');
    const [forthname, setForthname] = React.useState('Kęstutis Dimša');
    const [fitthname, setFitthname] = React.useState('Lorem Ipsum');
    const [sixthname, setSixname] = React.useState('Kęstutis Dimša');
    return (
        <SafeAreaView style={styles.container} >
            <Header back={goBack} title='Žinutės' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />

            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('Details', {
                    title: firstname, image: 'https://reactjs.org/logo-og.png'
                })
                }>
                    <View style={styles.itemlist}>
                        <Image source={{ uri: 'https://reactjs.org/logo-og.png' }}
                            style={{ width: 50, height: 50 }} />
                        <Text style={styles.list_text}>{firstname}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Details', {
                    title: secondname, image: 'https://reactjs.org/logo-og.png'
                })
                }>
                    <View style={styles.itemlist}>
                        <Image source={{ uri: 'https://reactjs.org/logo-og.png' }}
                            style={{ width: 50, height: 50 }} />
                        <Text style={styles.list_text}>{secondname}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Details', {
                    title: thirdname, image: 'https://reactjs.org/logo-og.png'
                })
                }>
                    <View style={styles.itemlist}>
                        <Image source={{ uri: 'https://reactjs.org/logo-og.png' }}
                            style={{ width: 50, height: 50 }} />
                        <Text style={styles.list_text}>{thirdname}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Details', {
                    title: forthname, image: 'https://reactjs.org/logo-og.png'
                })
                }>
                    <View style={styles.itemlist}>
                        <Image source={{ uri: 'https://reactjs.org/logo-og.png' }}
                            style={{ width: 50, height: 50 }} />
                        <Text style={styles.list_text}>{forthname}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Details', {
                    title: forthname, image: 'https://reactjs.org/logo-og.png'
                })
                }>
                    <View style={styles.itemlist}>
                        <Image source={{ uri: 'https://reactjs.org/logo-og.png' }}
                            style={{ width: 50, height: 50 }} />
                        <Text style={styles.list_text}>{fitthname}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Details', {
                    title: sixthname, image: 'https://reactjs.org/logo-og.png'
                })
                }>
                    <View style={styles.itemlist}>
                        <Image source={{ uri: 'https://reactjs.org/logo-og.png' }}
                            style={{ width: 50, height: 50 }} />
                        <Text style={styles.list_text}>{sixthname}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.registerButtonView}>
                <Button title='Išsaugoti' style={{ width: width - 50 }} />
            </View>
        </SafeAreaView>
    )
}

export default Message;
