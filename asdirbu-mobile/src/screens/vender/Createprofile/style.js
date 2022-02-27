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
        marginTop: 40
    },
    labelText:{
        fontSize: 19,
        color:"#666666",
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 10
    },
    textinput:{
        borderWidth:2,
        width: width * 0.85,
        marginTop: 10,
        borderRadius: 8,
        borderColor : "#666666",

    },
    checkbox:{
        flex:1,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginTop:15,
        justifyContent:"space-between"
    },
    checktext:{
        fontSize: 12,
        fontWeight:'bold',
        marginTop: 7

    },
    addtext:{
        fontSize:19,
        marginTop: 25,
        marginLeft: 30
    },
    addcontainer:{
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    additional:{
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
    }
})