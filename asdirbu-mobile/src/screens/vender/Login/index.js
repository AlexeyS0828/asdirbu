import React from 'react';
import { View, Text, SafeAreaView, Image, Keyboard, ScrollView, AsyncStorage , TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Form, Item, Label } from 'native-base';
import Input from '../../../components/input';
import { useSelector } from 'react-redux';
import BorderButton from '../../../components/borderButton';
import Button from '../../../components/Button';
import Facebook from '../../../components/facebook';
import DismissKeyboard from '../../../components/dismissKeyboard';
import { Login } from '../../../reducers/session/action';
import Loader from '../../../components/load'
import styles from './style';


function LoginPage(props) {
    const { navigation } = props;
    const login = Login()
    const result = useSelector(state => state.session.data);
    const [error, setError] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const [email, setEmail] = React.useState('test123@gmail.com');
    const [password, setPassword] = React.useState('123456');
    const _handleEmail = email => setEmail(email);
    const _handlePassword = number => setPassword(number);
    const gotoregister =()=>{
        navigation.navigate('MainRegister');
    }
    const register = async () => {
        if (email === '' || password === '') {
            setError(true);
            return;
        }
        setLoad(true);
        await login({ email, password });

        setLoad(false);
        return;

    }
    if (result) {
        if (result.data) {
            if (result.data.success) {
                AsyncStorage.setItem("Token", result.data.data._token);
                navigation.navigate('Home');
            }
        }
    }
    return (

        <DismissKeyboard>
            <SafeAreaView style={styles.container}>
                <Text style={styles.headertitle}>Prisijungimas</Text>
                <View style={styles.maincontainer}>
                    <Label View style={styles.labelText}>El. paštas</Label>
                    <Input
                        placeholder='El. paštas'
                        onChangeText={_handleEmail}
                        value={email}
                        keyboardType='email-address'
                        textContentType='emailAddress'
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
                        error={error && password === ''}
                    />
                   
                    <View style={styles.registerButtonView}>
                        <Button title='Registracija' onPress={register} />
                        <Button title='Neturi paskyros?' onPress={gotoregister} />
                    </View>
                </View>
                <Loader visible={load} />
            </SafeAreaView>
        </DismissKeyboard>
    )
}

export default LoginPage