import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Config from '../../Config.json'
import { useEffect } from "react"

export default NavBar = ({focus, navigation}) => {
    useEffect(()=>{
    },[focus])
    const onPressProfil = () =>{
        navigation.navigate("/profile")
    }
    const onPressVTC = () =>{
        navigation.navigate("/vtc")
    }
    const onPressWorkspace = () =>{
        navigation.navigate("/workspace")
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{...styles.third, borderTopWidth:(focus === "1")?2:0, borderTopColor:Config.darkBlue}} onPress={onPressWorkspace}>
                <View style={styles.button}>
                    <View
                        style={{
                            ...styles.round,
                            backgroundColor:focus ==="1"? Config.darkBlue :Config.darkGrey
                        }}
                    ></View>
                    <Text
                        style={{
                            ...styles.textStyle,
                            color:focus ==="1"? Config.darkBlue :Config.darkGrey
                        }}>Workspace</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.third, borderTopWidth:(focus === "2")?2:0, borderTopColor:Config.darkBlue}} onPress={onPressVTC}>
                <View style={styles.button}>
                    <View
                        style={{
                            ...styles.round,
                            backgroundColor:focus ==="2"? Config.darkBlue :Config.darkGrey
                        }}
                    ></View>
                    <Text
                        style={{
                            ...styles.textStyle,
                            color:focus ==="2"? Config.darkBlue :Config.darkGrey
                        }}>VTC</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.third, borderTopWidth:(focus === "3")?2:0, borderTopColor:Config.darkBlue}} onPress={onPressProfil}>
                <View style={styles.button}>
                    <View
                        style={{
                            ...styles.round,
                            backgroundColor:focus ==="3"? Config.darkBlue :Config.darkGrey
                        }}
                    ></View>
                    <Text
                        style={{
                            ...styles.textStyle,
                            color:focus ==="3"? Config.darkBlue :Config.darkGrey
                        }}>Profil</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

var styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        backgroundColor:"#fff",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    button:{
        width:"100%",
        height:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:5
    },
    third:{
        height:"100%",
        flex:1,
    },
    textStyle:{
        width:"100%",
        textAlign:"center",
        fontSize:15
    },
    round:{
        width:15,
        height:15,
        alignSelf:"center",
        borderRadius:10,
    },
})