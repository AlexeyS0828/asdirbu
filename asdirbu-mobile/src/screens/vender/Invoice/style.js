import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    subtext:{
        fontSize: 19,
        marginBottom: 30
    },
    imagecontainer:{
        width:width,
        flexDirection:"row",
        justifyContent:"space-around",
        marginTop: 15
    },
    font:{
        fontSize: 19
    },
    avatar_name:{
        marginTop: 10
    }
})