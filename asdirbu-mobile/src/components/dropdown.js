import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
const { width } = Dimensions.get('window')



function DropDown(props) {


    const [country, setCountry] = React.useState('uk')
    const data = [
        {label: 'USA', value: 'usa'},
        {label: 'UK', value: 'uk'},
        {label: 'France', value: 'france'},
    ];

    return (
        <DropDownPicker
            items={data}
            defaultValue={country}
            containerStyle={[styles.container, props.style]}
            style={styles.additionalstyle}
            dropDownStyle={{ backgroundColor: '#fff' }}
            onChangeItem={item => console.log(item)}
            arrowStyle={styles.arrowStyle}
            labelStyle={styles.labelStyle}
            zIndex={100}
            arrowColor='#bfbfbf'
        />
    )
}
const styles = StyleSheet.create({
    container: {
        height: 45,
        width: width - 70,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    additionalstyle: {
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderColor: '#dfdfdf',
        borderWidth: 2,
        // justifyContent: 'center'
    },
    arrowStyle: {
        position: 'relative',
    },
    labelStyle: {
        fontSize: 16,
        lineHeight: 24,
        color: '#2d2d2d',
        alignSelf: 'center',
        textAlign: 'center',
        marginLeft: 15
    }
})
export default DropDown