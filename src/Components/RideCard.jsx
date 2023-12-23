import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native'
import Config from "../../Config.json"
import CustomButton from './CustomButton'

export default RideCard = ({profilePic, userName, fullName, rating, depart, arrivee, temps, prix, onPress, loading}) => {
    return (
        <View style={styles.container}>
            <View style={styles.userInfoView}>
                <Image source={profilePic} style={styles.image} resizeMode='center' />
                <View style={styles.namesView}>
                    <Text numberOfLines={1} style={styles.usernameText}>{userName}</Text>
                    <Text numberOfLines={1} style={styles.fullnameText}>{fullName}</Text>
                </View>
                <View style={styles.ratingView}>
                    <Text style={styles.ratingText}>{rating}</Text>
					<Image
						source={require("../../assets/Star.png")}
						style={[styles.ratingStar]}
						resizeMode="contain"
					/>
                </View>
            </View>
            <View style={styles.itineraireInfoView}>
                <Image source={require("../../assets/Road.png")} style={styles.image} resizeMode='center' />
                <View style={styles.itineraireInfo}>
                    <Text style={styles.iterneraireText} numberOfLines={1}>{depart}</Text>
                    <View style={{backgroundColor:Config.lightGrey, height:3, width:"100%"}}></View>
                    <Text style={styles.iterneraireText} numberOfLines={1}>{arrivee}</Text>
                </View>
            </View>
            <View style={styles.rideInfoView}>
                <View style={styles.rideInfo}>
                    <Text style={styles.tempsText}>{temps} minutes</Text>
                    <Text style={styles.prixText}>Prix : {prix} DA</Text>
                </View>
                <View style={{...styles.buttonView,backgroundColor:loading?Config.lightBlue:null, borderRadius:loading?10:null}}>
                    {
                        loading ?
                        <ActivityIndicator size="large" color="#FFF" />
                        :
                        <CustomButton
                            fontSize={16}
                            text={"Accepter"}
                            fill={Config.lightBlue}
                            onPress={onPress}
                        />
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        backgroundColor:"#fff",
        height:250,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        marginBottom:3
    },
    userInfoView:{
        height:"30%",
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    image:{
        height:"100%",
        width:"17%",
    },
    namesView:{
        height:"100%",
        flex:3,
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:5,
        marginLeft:10
    },
    ratingView:{
        flex:1,
        width:"25%",
        height:"100%",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end"
    },
    ratingText: {
		fontFamily: "Poppins_400Regular",
		color: "#000",
		fontSize: 25,
		width: "auto",
		fontWeight: "700",
	},
	ratingStar: {
		height: 35,
		width: 35,
	},
    usernameText:{
        fontSize:15,
        color:Config.darkGrey
    },
    fullnameText:{
        fontSize:18,
        fontWeight:"600"
    },
    itineraireInfoView:{
        height:"30%",
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    itineraireInfo:{
        flex:1,
        height:"100%",
        display:"flex",
        flexDirection:"column",
        marginLeft:10,
        paddingVertical:2,
        justifyContent:"space-between"
    },
    iterneraireText:{
        fontSize:16,
        width:"95%",
    },
    rideInfoView:{
        height:"30%",
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    rideInfo:{
        flex:1,
        height:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:5
    },
    tempsText:{
        fontSize:18,
        fontWeight:"bold",
    },
    prixText:{
        fontSize:18,
        fontWeight:"bold",
        color:Config.lightBlue
    },
    buttonView:{
        width:"45%",
        height:50,
        display:"flex",
        justifyContent:"center"
    }
})