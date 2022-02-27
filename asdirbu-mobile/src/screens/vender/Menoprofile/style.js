import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    doctext:{
        textAlign:"left",
        fontSize:12,
        fontWeight: 'bold',
        paddingLeft: 40,
        marginTop: 15
    },
    
    registerButtonView:{
        flex: 1,
        alignItems: 'center',
        width: width
    },
    approvaltext:{
        marginTop: 30,
        fontSize:12,
        fontWeight: 'bold',
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
})