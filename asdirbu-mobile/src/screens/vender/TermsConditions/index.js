import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, DismissKeyboard, TextInput, Dimensions, Platform } from 'react-native';
import Back from '../../../components/backButton'
import styles from './style';
import images from '../../../config/images';
import { Textarea } from 'native-base';

const { width } = Dimensions.get('window')
function TermsConditions({ navigation, route }) {
    const goBack = () => navigation.goBack();

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.header}>
                <Back onPress={goBack} />
                <Text style={styles.fontsize}>Terms and Conditions</Text>
            </View>
            <View style={styles.itemlist}>
                <Image source={images.Ratangle} style={styles.titleImage} />
                <View style={styles.titles}>
                    <Text style={styles.tilte}>Title</Text>
                    <Text style={styles.subtitle}>Text about the topic... . </Text>
                    <Text style={styles.subtitle}>Text about the topic... . </Text>
                    <Text style={styles.subtitle}>Text about the topic... . </Text>
                </View>
            </View>
            <View style={styles.destailscontent}>
                <Text style={styles.detailstext}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Text>
                <Text style={styles.detailstext}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default TermsConditions;