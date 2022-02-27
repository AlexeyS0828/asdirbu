import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header'
import Logo from '../../../components/logo'
import styles from './style';
import images from '../../../config/images';
import ToggleSwitch from 'toggle-switch-react-native'

const { width } = Dimensions.get('window')

function Itemdetails({ navigation, route }) {
    const gotoLogin = () => navigation.navigate('Login');
    const [active, setActive] = React.useState(null)
    const goBack = () => navigation.goBack();
    const { item } = route.params;
    return (
        <SafeAreaView style={styles.container} >
            <Header back={goBack} title='Santechnikas' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />
            <View>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <Text style={styles.font12}>{item.name}</Text>
            </View>
           
            <View style={styles.price}>
                <Text style={styles.font18}>{item.price}</Text>
                <Text style={styles.font16}>Valandinis atlyginimas</Text>
            </View>
            <View style={styles.activebutton}>
                <ToggleSwitch
                    isOn={active}
                    onColor="green"
                    offColor="red"
                    size="large"
                    onToggle={isOn => setActive(isOn)}
                    />
            </View>
            <Button title='Kreiptis' style={{ width: width - 100, marginTop: 40 }} />
        </SafeAreaView>
    )
}

export default Itemdetails;
