import React, {useRef, useState, useEffect} from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity,DismissKeyboard, TextInput, Dimensions, Platform } from 'react-native';
import Back from '../../../components/backButton'
import styles from './style';
import {Update} from '../../../reducers/session/action'
import images from '../../../config/images';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import RNFS from 'react-native-fs'
import PhotoUpload from 'react-native-photo-upload'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';

const { width } = Dimensions.get('window')

function EditProfile({ navigation,route }) {
    const { user, Id } = route.params;
    const goBack = () => navigation.goBack();
    const [name, setname] = React.useState('');
    const [imagedata, setImage] =React.useState('');
    const [descrition, setDescrition] =React.useState('');
    const _handlename = name => setname(name);
    const _handledescription =  descrition =>setDescrition(descrition);
    const next = () =>{
        const data = {title: name,
        subtitle: descrition,
        illustration: imagedata}
        update(data)
    }
    const update = Update();

    return (
            <SafeAreaView style={styles.container} >
                <View style={styles.back}>          
                    <Back onPress={goBack}/>
                </View>
                <View style={styles.upload}>
                <PhotoUpload
                    onPhotoSelect={avatar => {
                        if (avatar) {
                            const image = {uri: `data:image/gif;base64,${avatar}`}
                            setImage(image)
                           
                        }
                    }}
                    >
                    <Image
                        style={{
                        paddingVertical: 30,
                        width: width* 0.6,
                        height: width* 0.6,
                        borderRadius: 20
                        }}
                        resizeMode='cover'
                        source={user.illustration}
                    />
                </PhotoUpload>
                </View>
                <Text style={styles.fontsize}>{user.title}</Text>
                <View style={styles.inputfiled}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type here to translate!"
                        onChangeText={_handlename}
                        defaultValue={name}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Type here to translate!"
                        onChangeText={_handledescription}
                        defaultValue={descrition}
                    />
                </View>
                <TouchableOpacity style={styles.callrow}>
                    <Text style={styles.callname} onPress={next}>Patvirtink</Text>
                </TouchableOpacity>
            </SafeAreaView>
    )
}

export default EditProfile;
