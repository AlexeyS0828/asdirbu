import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#0E4E85"
    },
    image:{
        width:width * 0.5,
        height:width* 0.5,
        marginTop: 0
    },
    fontsize:{
        color: "white"
    },
    input:{
        color: "#83A3C0",
        fontSize:20,
        backgroundColor:"white",
        borderRadius:20,
        width: width* 0.8,
        marginTop: 10,
        textAlign:"center"

    },
    inputfiled:{
        marginTop:20
    },
    callrow:{
        flexDirection: 'row',
        borderColor:"#FFFFFF",
        borderRadius:15,
        width:width * 0.6,
        justifyContent:"space-around",
        borderWidth: 1,
        marginTop:40,
        paddingTop:7,
        paddingBottom:7
      },
      callname:{
        fontSize:20,
        color:"white",
    
      },
      back:{
        width:width,
      },
      upload:{
          height: height* 0.3
      }
});