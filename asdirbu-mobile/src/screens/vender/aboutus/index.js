import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import Button from '../../../components/Button'
import { useSelector } from 'react-redux';
import Header from '../../../components/header'
import Logo from '../../../components/logo'
import styles from './style';
import images from '../../../config/images';

const { width } = Dimensions.get('window')

function AboutUS({ navigation }) {
    const goBack = () => navigation.goBack();
    return (
        <SafeAreaView style={styles.container} >
            <Header back={goBack} title='Apie mus' titleColor='#E57D33' left smallColor='rgba(45,45,45,0.5)' />
            <ScrollView style={styles.scrollview}>
                <View>
                    <Text style={styles.title}>Aš dirbu. O tu?</Text>
                    <Text style={styles.text}>Oficialios statistikos, kiek kartų prireikė pagalbos sutaisyti gendančią skalbimo mašiną, užnešti spintą į viršutinį namo aukštą ar išvesti po kiemą pavedžioti šunį, kol kas nėra.</Text>
                    <Text style={styles.text}>Tačiau yra kiti skaičiai. Lietuvoje registruoti keli šimtai tūkstančių ieškančiųjų darbo, o jų gretos nuolat auga. Mūsų šalyje taip pat yra virš šimto tūkstančių individualią veiklą vykdančių darbuotojų, o darbingų lietuvių skaičius viršija milijoną.</Text>
                    <Text style={styles.text}>Ir už kiekvieno šio statistinio rodiklio gali būti patyręs, patikimas, paslaugus ir savo amatą puikiai išmanantis specialistas. Savo srities profesionalas ar jaunas talentas, darbštus meistras ar kūrybingas senjoras.</Text>
                    <Text style={styles.text}>Todėl svetainė „Aš dirbu“ skirta paslaugų pirkėjams rasti geriausius bei arčiausiai esančius specialistus. Vykdantiems individualią veiklą – prisistatyti ir reklamuoti save bei savo talentą. Visiems – dirbti, užsidirbti ir burtis į bendruomenę, kurioje vertinama kokybė, patogumas, greitis bei saugumas. Kodėl?</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dotstyle}>{'\u2022'}</Text>
                        <Text style={styles.textlist}>Aš dirbu“ siūlo greitą darbą. Prireikus nagingo santechniko, ištvermingo krovėjo ar patikimo padėjėjo buityje, jį galima rasti akimirksniu.</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dotstyle}>{'\u2022'}</Text>
                        <Text style={styles.textlist}>Aš dirbu“ pristato ir paimti / nuvežti paslaugą. Jūsų prekės saugiai atsidurs patikimo bei greito pervežėjo automobilyje, kuris krovinį reikiamu maršrutu pristatys per valandą nuo užsakymo gavimo.</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dotstyle}>{'\u2022'}</Text>
                        <Text style={styles.textlist}>Aš dirbu“ bendruomenė vertinama. Svetainės paslaugų pirkėjų ir tiekėjų patikimumas reitinguojamas, o atsiliepimai užtikrina kokybę bei pasitikėjimą.</Text>
                    </View>
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={styles.dotstyle}>{'\u2022'}</Text>
                        <Text style={styles.textlist}>Aš dirbu“ atsiskaitoma saugiai. Pirkėjui užsakius paslaugas, pinigai rezervuojami sistemoje ir teikėjui išmokami tik po darbo atlikimo bei įvertinimo.</Text>
                    </View>
                    <Text style={styles.text}>Todėl nesvarbu, ar prireikė specialisto, ar papildomo uždarbio. Čia yra vieta rasti ir atrasti, dirbti ir užsidirbti. „Aš dirbu“ vienija profesionalus, profesijas bei poreikius, kurie – visiškai šalia.</Text>
                    <Text style={styles.text}>O tu?</Text>
                    <Text style={styles.bottomtext}>Karolis Čepukas.</Text>
                    <Text style={styles.bottomtext}>“Aš dirbu” įkūrėjas</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AboutUS;
