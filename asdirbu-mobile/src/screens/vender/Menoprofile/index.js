import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header';
import Input from '../../../components/input';
import ImagePicker from 'react-native-image-crop-picker';
import styles from './style';
import images from '../../../config/images';

const { width } = Dimensions.get('window')

function MemoProfile({ navigation }) {
    const [firstname, setFristName] = React.useState('');
    const [secondname, setSecondName] = React.useState('');
    const [phonenumber, setPhonenumber] = React.useState('');
    const [city, setCity] = React.useState('')
    const [address, setAddress] = React.useState('');
    const [photo, setPhoto] = React.useState(null)
    const [bankaccount, setBankaccount] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const _handleFristName = firstname => setFristName(firstname);
    const _handleSecondName = secondname => setSecondName(secondname);
    const _handlephonenumber = phonenumber => setPhonenumber(phonenumber);
    const _handlecity = city => setCity(city);
    const _handleaddress = address => setAddress(address);
    const goBack = () => navigation.goBack();
    const _handlebankaccount = bankaccount => setBankaccount(bankaccount);
    const _handleTime = time => setTime(time);
    function selectImage() {
        ImagePicker.openPicker({
            width: width - 100,
            height: width - 100,
            cropping: true
        }).then(image => {
            setPhoto(image.path);
        });
    }
    return (
        <SafeAreaView style={styles.container} >

            <Header back={goBack}  title='Mano profilis' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />
            <ScrollView style={styles.scrollview}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={selectImage}>
                        {photo ?
                         <Image source={{ uri: photo}}
                         style={{ width: 100, height: 100 }} />:
                        <Image source={{ uri: 'https://reactjs.org/logo-og.png' }}
                        style={{ width: 100, height: 100 }} />
                        }
                    </TouchableOpacity>
                    <Input
                        placeholder="Vardas"
                        onChangeText={_handleFristName}
                        value={firstname}
                        textContentType='name'
                        autoCapitalize='words'
                    />
                    <Input
                        placeholder="Pavardė"
                        onChangeText={_handleSecondName}
                        value={secondname}
                        textContentType='name'
                        autoCapitalize='words'
                    />
                    <Input
                        placeholder="Telefono numeris"
                        onChangeText={_handlephonenumber}
                        value={phonenumber}
                        textContentType='name'
                        autoCapitalize='words'
                    />

                    <Input
                        placeholder="Miestas"
                        onChangeText={_handlecity}
                        value={city}
                        textContentType='name'
                        autoCapitalize='words'
                    />

                    <Input
                        placeholder="Adresas"
                        onChangeText={_handleaddress}
                        value={address}
                        textContentType='name'
                        autoCapitalize='words'
                    />

                    <Input
                        placeholder="bankaccount"
                        onChangeText={_handlebankaccount}
                        value={bankaccount}
                        textContentType='name'
                        autoCapitalize='words'
                    />

                </View>
                <Text style={styles.doctext}>Pridėk dokumentus</Text>
              
                <View style={styles.registerButtonView}>
                    <Button title='Išsaugoti' style={{width: width-50}}/>
                    <Text style={styles.approvaltext}>Laukiama patvirtinimo</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MemoProfile;
