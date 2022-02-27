import React from 'react';
import { View, Text, SafeAreaView, Image, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Form, Item, Label } from 'native-base';
import Input from '../../../components/input';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import BorderButton from '../../../components/borderButton';
import Button from '../../../components/Button';
import Facebook from '../../../components/facebook';
import DismissKeyboard from '../../../components/dismissKeyboard';
import { Register } from '../../../reducers/session/action';
import Loader from '../../../components/load'
import styles from './style';

function PersonalRegister(props) {
    const { navigation } = props;
    const rigister = Register()
    const result = useSelector(state => state.session.data);
    const [error, setError] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const [email, setEmail] = React.useState('test123@gmail.com');
    const [password, setPassword] = React.useState('123456');
    const [comfirmpassword, setComfirmpassword] = React.useState('');
    const [name, setVardas] = React.useState("");
    const [lastname, setPavarde] = React.useState("");
    const [dob, setGimimo] = React.useState("01/01/1997");
    const [userType, setuserType] = React.useState("1");
    const _handleEmail = email => setEmail(email);
    const _handlePassword = number => setPassword(number);
    const _handlecomfirmPassword = comfirmpassword => setComfirmpassword(comfirmpassword);
    const _handleVardas = vardas => setVardas(vardas);
    const _handlePavardė = Pavardė => setPavarde(Pavardė);
    const [date, setDate] = React.useState(new Date(1598051730000));
    const [mode, setMode] = React.useState('date');
    const [show, setShow] = React.useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
      };
    
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const _handleGimimo = () => {
        showMode('date');
      };

    const register = async () => {
        if (email === '' || password === '' || password !==comfirmpassword) {
            setError(true);
            return;
        }
        setLoad(true);
        await rigister({name, lastname,  email,dob, password ,userType});

        setLoad(false);
        return;

    }
    if (result) {
        if (result.success) {
            navigation.navigate('Home');
        }
    }
    return (

        <DismissKeyboard>
            <ScrollView style={styles.scrollview}>
                <SafeAreaView style={styles.container}>

                    <Text style={styles.headertitle}>Registracija</Text>
                    <View style={styles.maincontainer}>
                        <Label View style={styles.labelText}>El. paštas</Label>
                        <Input
                            placeholder='El. paštas'
                            onChangeText={_handleEmail}
                            value={email}
                            keyboardType='email-address'
                            error={error && email === ''}
                            autoCapitalize='none'
                        />
                        <Label View style={styles.labelText}>Slaptažodis</Label>
                        <Input
                            placeholder='Slaptažodis'
                            onChangeText={_handlePassword}
                            value={password}
                            secureTextEntry
                            textContentType='password'
                            blurOnSubmit={false}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            error={error && password === ''||password!==comfirmpassword }
                        />
                        <Label View style={styles.labelText}>Pakartoti slaptažodį</Label>
                        <Input
                            placeholder='Pakartoti slaptažodį'
                            onChangeText={_handlecomfirmPassword}
                            value={comfirmpassword}
                            secureTextEntry
                            textContentType='password'
                            blurOnSubmit={false}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            error={error && comfirmpassword === ''||password!==comfirmpassword }
                        />
                        <Label View style={styles.labelText}>Vardas</Label>
                        <Input
                            placeholder='Vardas'
                            onChangeText={_handleVardas}
                            value={name}
                            blurOnSubmit={false}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            error={error && name === ''}
                        />
                        <Label View style={styles.labelText}>Pavardė</Label>
                        <Input
                            placeholder='Pavardė'
                            onChangeText={_handlePavardė}
                            value={lastname}
                            blurOnSubmit={false}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            error={error && lastname === ''}
                        />
                        <Label View style={styles.labelText}>Gimimo diena</Label>
                        <Input
                            placeholder='Gimimo diena'
                            onChangeText={_handleGimimo}
                            value={dob}
                            blurOnSubmit={false}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            error={error && dob === ''}
                        />
                        {show && (
                            <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            />
                        )}
                        <View style={styles.registerButtonView}>
                            <Button title='Registracija' onPress={register} />
                        </View>
                    </View>
                    <Loader visible={load} />

                </SafeAreaView>
            </ScrollView>
        </DismissKeyboard>
    )
}

export default PersonalRegister