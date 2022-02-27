import React, { useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Images from '../../../config/images';
import SelectPicker from 'react-native-form-select-picker';
import Button from '../../../components/Button';
import Input from '../../../components/input';
import { useSelector } from 'react-redux';
import styles from './style';
import images from '../../../config/images';
import {Getcitys } from '../../../reducers/session/action';

const { width } = Dimensions.get('window')
const citys1 = ["Miestas", "Bananadff", "Orangedd"];
const industrys = ["Industry", "Banana", "Orange"];
function Services({ navigation,route }) {
    const citys_tem = useSelector(state => state.session.city.data);
    let industrylist =[];
     for (var key in citys_tem) {
        if (citys_tem.hasOwnProperty(key)) {
           citys_tem[key].map(function(val){
            industrylist.push(val);
            });
        }
    }
    const Search = () => navigation.navigate('Login');
    const [keyword, setKeyword] = React.useState("A");
    const _handleKeyword = keyword => {
        setKeyword(keyword);
            const filter = keyword.toUpperCase();
            var keys = [];
            // setCitys(citys_tem.filter)
   

    };
    const [city, setCity] = React.useState('');
    const [industry, setIndusty] = React.useState('Advokatai, teisininkai');
    const next = () => navigation.navigate('Members');
  return (
    <SafeAreaView style={styles.container} >
      <View>
        <Text style={styles.rask}>Rask paslaugas Lietuvoje</Text>
        <View style={styles.middlecontainer}>
            <View style={[styles.flexDirection, styles.tabtitle]}>
                <TouchableOpacity>
                <Text style={[styles.tabtext,{borderRightWidth:1}]}>Greiti darbai</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={next} >
                <Text style={styles.tabtext}>Nauji nariai</Text>
                </TouchableOpacity>
            </View>
            <Input
                placeholder='Raktažodis'
                onChangeText={_handleKeyword}
                value={keyword}
                maxLength={1}
                textContentType='emailAddress'
                autoCapitalize='none'
                style={{width: "80%"}}
            />

            <SelectPicker
                onValueChange={(value) => {
                    setCity(value);
                }}
                selected={city}
                style={{
                    borderWidth:1,
                    borderRadius: 8,
                    width: "80%",
                    marginTop:20}}
                onSelectedStyle ={{fontSize: 16, color:'#252525'}}
                >
                
                {Object.values(citys1).map((val, index) => (
                    <SelectPicker.Item label={val} value={val} key={index} />
                ))}
    
            </SelectPicker>

            <SelectPicker
                onValueChange={(value) => {
                    setIndusty(value);
                }}
                selected={industry}
                style={{
                    borderWidth:1,
                    borderRadius: 8,
                    width: "80%",
                    marginTop:20}}
                onSelectedStyle ={{fontSize: 16, color:'#252525'}}
                >
                
                {Object.values(industrylist).map((val, index) => (
                    <SelectPicker.Item label={val} value={val} key={index} />
                ))}
    
            </SelectPicker>


          <Button title='Paieška' style={styles.button} titleStyle={styles.buttonTitle} onPress={Search}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Services;
