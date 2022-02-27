import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    cut: {
        width: width* 0.7,
        height: height*0.15,
        marginTop: width* 0.8
    },
    middlecontainer:{
      flex: 1,
      alignItems: 'center',
      marginTop: height* 0.25
    },
    rask:{
      fontSize:25,
      fontWeight:"bold",
      color:"#000000",
      textAlign:'center',
      marginBottom: 60
    },
    button1:{
        backgroundColor: '#395FB2',
        borderRadius: 30
    },
    button:{
        borderRadius: 30
    }
})