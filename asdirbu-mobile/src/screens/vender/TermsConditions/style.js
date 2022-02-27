import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#0E4E85",
        width:width
    },
    header: {
        width:width,
        flexDirection:"row",
        justifyContent:"space-between" 
    },
    fontsize :{
        fontSize:25,
        color: "white",
        marginTop:30,
        position:"absolute",
        left: width*0.25
    },list :{
        marginTop: 40,
        marginBottom: 40,
        height: height,
        flex: 1,
        flexDirection:"column",
        justifyContent: "space-around",
    },
    itemlist:{
        flexDirection: "row",
        marginLeft: width* 0.2,
        width: width,
        marginTop:40
    },
    titleImage:{
        width: 81,
        height: 109
    },
    titles :{
        marginLeft:30,
        marginTop: 15
    },
    tilte:{
        color:"white",
        fontSize:16
    },
    subtitle:{
        color:"white",
        fontSize:12
    },
    destailscontent:{
        marginLeft:40,
        marginRight: 30,
      
    },
    detailstext:{
        color: "white",
        fontSize: 12,
    }
});