import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:"row",
    },
    profilecontainer:{ 
        width:width,
        flexDirection:"row",
        justifyContent:'space-between',
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom:10,
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:"#E57D33",
        height:60,
        borderRadius:4
    },
    lastprofilecontainer:{
        width:width,
        flexDirection:"row",
        justifyContent:'space-between',
        paddingTop: 15,
        paddingBottom:10,
        paddingLeft: 20,
        paddingRight: 20,
        borderTopWidth:1,
        borderBottomWidth:2,
        borderColor:"#E57D33",
        height:60,
        borderRadius:4
    },
    text:{
        fontSize: 22,
        color: "#666666",
        textAlign:"left"
    }
})