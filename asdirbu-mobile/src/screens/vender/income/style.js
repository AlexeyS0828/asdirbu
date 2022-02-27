import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    hearderText:{
        fontSize:20,
        marginTop: 50,
        textAlign:"center",
        marginBottom:60
    },
    buttonlist:{
        flexDirection:"row",
        justifyContent:"space-around",
        marginTop: 40
    },
    cercleImage:{
        flex: 1,
        alignItems: 'center',
    },
    cercletext:{
        fontSize:25,
        color:"#E57D33"
    },
    cercletext1:{
        fontSize:25,
        color:"#E57D33",
        marginTop:40
    }
})