import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import images from '../config/images';
const { width, height } = Dimensions.get('window')
const Header = ({ left, title, right, back, style, leftStyle, smallTitle, titleColor, smallColor, rightStyle, upsmall, close }) => (
    <View style={[styles.header, style]}>
        {
            left &&
            <TouchableOpacity onPress={back} style={[styles.left, leftStyle]}>
                <Image source={images.Back} style={styles.backIcon}/>
            </TouchableOpacity>
        }
        {
            React.isValidElement(title) ? title :
                upsmall ?
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.font16, smallColor && { color: smallColor }]}>{smallTitle}</Text>
                        <Text style={[styles.font23, titleColor && { color: titleColor }]}>{title}</Text>
                    </View> :
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.font23, titleColor && { color: titleColor }]}>{title}</Text>
                        <Text style={[styles.font16, smallColor && { color: smallColor }]}>{smallTitle}</Text>
                    </View>
        }
        {
            right &&
            <TouchableOpacity style={[styles.right, rightStyle]} onPress={close}>
                <Icon name='md-close' color='#bfbfbf' size={35} />
            </TouchableOpacity>
        }

    </View>
)

const styles = StyleSheet.create({
    header: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    left: {
        position: 'absolute',
        left: 29
    },
    font23: {
        fontSize: 23,
        fontWeight: 'bold',
        lineHeight: 24,
        color: '#e80606',
        letterSpacing: 0.24,
        marginVertical: 5,
        textAlign: 'center'
    },
    backIcon:{
        marginTop: 5,
        width: 15
    },
    font16: {
        fontSize: 16,
        lineHeight: 24,
        color: '#2d2d2d',
        letterSpacing: 0.25
    },
    right: {
        position: 'absolute',
        right: 29
    }
});

export default Header