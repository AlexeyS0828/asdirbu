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
    textlist:{
       flexDirection:'row',
       paddingTop: 8,
       paddingBottom: 8
    },
    textltem:{
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap'
    },

    textltem_right:{
        fontSize: 16,
        fontWeight: 'bold',
        
    },
    maincontainer:{
        width: width- 40,
        paddingTop: 20,
        backgroundColor:"#ECF0F1",
        paddingLeft: 20,
        paddingRight: 20,
        height: height
    },
    button_icon:{
        alignItems: 'center',
        marginTop: 10
    },
    sendmessage:{
        flexDirection:'row',
        justifyContent:"space-between",
        marginTop: height* 0.2,
        borderTopWidth: 1,
        padding: 20,
        borderTopColor: "#E57D33"
    },
    sendmessagetext:{
        fontSize:19
    }
})