import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import { useSelector } from 'react-redux';
import styles from './style';
import images from '../../../config/images';

const { width } = Dimensions.get('window')

function Profile({ navigation }) {
    const [username, setUsername] = React.useState("Kęstutis Dimša");
    const viewProfile = () => { navigation.navigate('viewProfile') };
    const GidasProfile = () => { navigation.navigate('GidasProfile') };
    const Message = () => { navigation.navigate('Message') };
    const Aboutus = () => { navigation.navigate("Aboutus") };
    const Invoice =() =>{navigation.navigate("Invoice")};
    return (
        <SafeAreaView style={styles.container} >
            <View>
                <TouchableOpacity onPress={viewProfile}>
                    <View style={styles.profilecontainer}>
                        <Text style={styles.text}>{username}</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={GidasProfile}>
                    <View style={styles.profilecontainer}>
                        <Text style={styles.text}>Gidas</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={GidasProfile}>
                    <View style={styles.profilecontainer}>
                        <Text style={styles.text}>Mano darbai</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={Invoice}>
                    <View style={styles.profilecontainer}>
                        <Text style={styles.text}>Piniginė</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={GidasProfile}>
                    <View style={styles.profilecontainer}>
                        <Text style={styles.text}>Pasirinkimai</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={Message}>
                    <View style={styles.profilecontainer}>
                        <Text style={styles.text}>Žinutės</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={GidasProfile}>
                    <View style={styles.profilecontainer}>
                        <Text style={styles.text}>Pagalbos centras</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={Aboutus}>
                    <View style={styles.profilecontainer}>
                        <Text style={styles.text}>Apie mus</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={GidasProfile}>
                    <View style={styles.lastprofilecontainer}>
                        <Text style={styles.text}>Nustatymai</Text>
                        <Image source={Images.navigation} />
                    </View>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

export default Profile;
