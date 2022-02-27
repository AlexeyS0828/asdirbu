import React from 'react';
import { View, Text, SafeAreaView,TextInput, Image,CheckBox , Keyboard,ScrollView,Dimensions, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Form, Item, Label} from 'native-base';
import Input from '../../../components/input';
import DismissKeyboard from '../../../components/dismissKeyboard';
import SelectPicker from 'react-native-form-select-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {Login} from '../../../reducers/session/action';
import Button from '../../../components/Button';
import Loader from '../../../components/load'
import styles from './style';
const { width } = Dimensions.get('window')
const options = ["Pasirink specialybę", "Banana", "Orange"];
function CreateProfile(navigation) {
    let allow = false;
    const [error, setError] = React.useState(false)
    const [name, setName] = React.useState('');
    const [selected, setSelected] = React.useState('Pasirink specialybę');
    const [Price, setPrice] = React.useState('');
    const [data, setData] = React.useState('');
    const [photo, setPhoto] = React.useState(null)
    const [address, setAddress] = React.useState('');
    const [toggleCheckBox, setToggleCheckBox] = React.useState(false)
    const [place, setPlace] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const _handleName = name => setName(name);
    const _handlePrice = Price => setPrice(Price);
    const _handledata = data => setData(data);
    const _handleaddress = address => setAddress(address);
    const  _handlePlace = place => setPlace(place);
    const  _handleDate = date => setDate(date);
    const  _handleTime = time => setTime(time);
   
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

        <DismissKeyboard>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollview}>
                    <View style={styles.container}>
                        <Text style={styles.headertitle}>Skelbimas</Text>
                        <Input
                            placeholder="Skelbimo pavadinimas"
                            onChangeText={_handleName}
                            value={name}
                            textContentType='name'
                            autoCapitalize='words'
                        />
                        <TextInput
                            placeholder="Skelbimo pavadinimas"
                            multiline={true}
                            numberOfLines={5}
                            style={styles.textinput}
                            textAlignVertical = "top"/>
                        <SelectPicker
                            onValueChange={(value) => {
                                setSelected(value);
                            }}
                            selected={selected}
                            style={{
                                borderWidth:1,
                                borderRadius: 8,
                                width: "100%",
                                marginTop:20}}
                            onSelectedStyle ={{fontSize: 16, color:'#252525'}}
                            >
                            
                            {Object.values(options).map((val, index) => (
                                <SelectPicker.Item label={val} value={val} key={index} />
                            ))}
                
                        </SelectPicker>
                        
                        <Input
                            placeholder="Paslaugos kaina"
                            onChangeText={_handlePrice}
                            value={Price}
                            autoCapitalize='words'
                        />
                        <Input
                            placeholder="Data"
                            onChangeText={_handledata}
                            value={data}
                            autoCapitalize='words'
                        />
                         <Input
                            placeholder="Address"
                            onChangeText={_handleaddress}
                            value={address}
                            autoCapitalize='words'
                        />
                        <View style={styles.addcontainer}>
                        <Button addtitle={"+"} onPress={selectImage} style={{ width: 50, backgroundColor: '#F7F8FC',borderWidth: 1,borderRadius: 5}} />
                        <Text style={styles.addtext}>Nuotrauka</Text>
                        </View>
                        
                        {photo && <Text style={styles.additional}>ADD ADDITIONAL IMAGES</Text>}
                        <Input
                            placeholder="Paslaugos suteikimo vieta"
                            onChangeText={_handlePlace}
                            value={place}
                            autoCapitalize='words'
                        />
                         <Input
                            placeholder="Paslaugos suteikimo vieta"
                            onChangeText={_handleDate}
                            value={date}
                            autoCapitalize='words'
                        />
                        <Input
                            placeholder="Paslaugos suteikimo laikas"
                            onChangeText={_handleTime}
                            value={time}
                            autoCapitalize='words'
                        />
                        <View style={styles.checkbox}>
                            <CheckBox
                                    disabled={false}
                                    value={toggleCheckBox}
                                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                />
                            <Text style={styles.checktext}>Sutinku su taisyklėmis bei privatumo politika</Text>
                        </View>
                        <Button title='Patvirtinti' />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </DismissKeyboard>
    )
}

export default CreateProfile