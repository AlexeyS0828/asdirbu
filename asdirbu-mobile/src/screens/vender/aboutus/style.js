import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    title:{
        color:"#E57D33",
        textAlign:"center",
        fontSize:25,
        fontWeight:"bold",
        marginBottom: 20
    },
    text:{
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    textlist:{
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    bottomtext:{
        fontSize: 20,
        textAlign: "center",
        paddingLeft: 20,
        paddingRight: 20,
        
    },
    dotstyle:{
        color:"#E57D33",
        fontSize:30,
        left: 10,
        position:'absolute'
    }
})