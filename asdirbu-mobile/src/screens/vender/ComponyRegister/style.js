import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    headertitle:{
        fontSize:30,
        color:"#E57D33",
        fontWeight: "bold",
        marginTop:height * 0.05
    },
    maincontainer :{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    socialButton:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 88,
        marginTop: 14,
        zIndex: 10
    },
    registerButtonView:{
        marginTop: 40,
        marginBottom: 40,
    },
    labelText:{
        fontSize: 19,
        color:"#666666",
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 10
    }
})