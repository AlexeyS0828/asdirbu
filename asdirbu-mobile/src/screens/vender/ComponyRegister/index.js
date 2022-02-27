import React from 'react';
import { View, Text, SafeAreaView, Image, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Form, Item, Label } from 'native-base';
import Input from '../../../components/input';
import { useSelector } from 'react-redux';
import BorderButton from '../../../components/borderButton';
import Button from '../../../components/Button';
import Facebook from '../../../components/facebook';
import DismissKeyboard from '../../../components/dismissKeyboard';
import { Register } from '../../../reducers/session/action';
import Loader from '../../../components/load'
import styles from './style';

function ComponyRegister(props) {
    const { navigation } = props;
    const comregister = Register()
    const result = useSelector(state => state.session.data);
    const [error, setError] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const [email, setEmail] = React.useState('test123@gmail.com');
    const [companyName, setCompanyName] = React.useState('');
    const [companyCode, setCompanyCode] = React.useState('');
    const [password, setPassword] = React.useState('123456');
    const [comfirmpassword, setComfirmpassword] = React.useState('123456');
    const [userType, setuserType] = React.useState("2");
    const _handleEmail = email => setEmail(email);
    const _handleCompanyName = companyName => setCompanyName(companyName);
    const _handleCompanyCode = companyCode => setCompanyCode(companyCode);
    const _handlePassword = number => setPassword(number);
    const _handlecomfirmPassword = comfirmpassword => setComfirmpassword(comfirmpassword);
    const register = async () => {
        if (email === '' || password === '') {
            setError(true);
            return;
        }
        setLoad(true);
        await comregister({ companyName,companyCode,email, password,userType });

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
                        error={error && email === ''}
                        autoCapitalize='none'
                    />
                    <Label View style={styles.labelText}>Įmonės pavadinimas</Label>
                    <Input
                        placeholder='Įmonės pavadinimas'
                        onChangeText={_handleCompanyName}
                        value={companyName}
                        blurOnSubmit={false}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        error={error && companyName === ''}
                    />
                    <Label View style={styles.labelText}> Įmonės kodas</Label>
                    <Input
                        placeholder='Įmonės kodas'
                        onChangeText={_handleCompanyCode}
                        value={companyCode}
                        blurOnSubmit={false}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        error={error && companyCode === ''}
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
                        error={error && password === ''}
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
                        error={error && comfirmpassword === ''}
                    />
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

export default ComponyRegister