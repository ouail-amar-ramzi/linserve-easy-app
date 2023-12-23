import { View, StyleSheet, Text } from "react-native"
import { Button } from "react-native-paper"

const CustomButton = ({fill, text, onPress, textColor, fontSize, disabled}) => {
    return (
        <View style={styles.ButtonView}>
            <Button style={styles.ButtonStyle} mode="contained" disabled={disabled} buttonColor={fill} onPress={onPress} textColor={textColor} labelStyle={{fontSize:fontSize}}>{text}</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    ButtonView:{
        width:"100%",
    },
    ButtonStyle:{
        width:"100%",
        height:50,
        justifyContent:"center",
        borderRadius:10
    }
})
export default CustomButton