import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    middlecontainer:{
      flex: 1,
      alignItems: 'center',
      marginTop: height* 0.15
    },
    rask:{
      fontSize:32,
      fontWeight:"bold",
      color:"#E57D33",
      textAlign:'center',
      marginBottom: 30,
      marginTop: 60
    },
    tabtitle:{
        flexDirection: 'row',
        width: width * 0.8,
        backgroundColor: 'white',
        paddingTop: 7,
        paddingBottom: 7,
        zIndex: 11,
        justifyContent: 'space-evenly'
    },
    tabtext:{
        width: width * 0.4,
        fontSize: 15,
        color:"#E57D33",
        textAlign:'center',
        fontWeight:"600"
    },
    button:{
        width: width * 0.8
    }
})