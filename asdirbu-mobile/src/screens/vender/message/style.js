import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    itemlist:{
        width: width-80,
        flexDirection:"row",
        height: 70
    },
    list_text:{
        fontSize: 19,
        marginLeft: 30,
        marginTop: 10
    },
    registerButtonView:{
        marginBottom: 50

    }
})