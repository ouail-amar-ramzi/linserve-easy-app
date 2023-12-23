import { View, StyleSheet, Text, Image } from 'react-native'
import Config from "../../Config.json"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';

export default RideCard = ({profilePic, userName, fullName, rating, depart, arrivee, temps, prix, onPressMaps, onPressCall, showCall, showMaps}) => {
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
                <View style={styles.buttonView}>
                    {
                        showMaps?
                        <View style={styles.button} onTouchEnd={onPressMaps}>
                            <Icon style={styles.icon} name="location-arrow"size={28} color={"#fff"} />
                        </View>:null
                    }
                    {
                        showCall?
                        <View style={styles.button} onTouchEnd={onPressCall}>
                            <Icon style={styles.icon} name="phone"size={28} color={"#fff"} />
                        </View>:null
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
        height:260,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        paddingTop:10,
        marginBottom:3,
        borderRadius:20,
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
        height:"100%",
        flex:1,
        display:"flex",
        flexDirection:"column",
        marginLeft:10,
        paddingVertical:2,
        justifyContent:"space-between"
    },
    iterneraireText:{
        fontSize:16,
        width:"100%`",
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
        height:"100%",
        display:"flex",
        flexDirection:"row",
        gap:15,
        justifyContent:"flex-end",
        alignItems:"center"
    },
    button:{
        backgroundColor:Config.lightBlue,
        height:45,
        width:45,
        borderRadius:10,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    icon:{
    },
})