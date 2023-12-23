import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome";
import Config from '../../Config.json'
import CustomButton from './CustomButton';

const ChauffeurRide = ({picChauffeur, userChauffeur, chauffeur, carInfo, matricule, depart, arrivee, prix, temps, rating }) => {
    return (
        <View style={styles.accepterOuRefuserCard}>
            <View style={styles.previewChauffeur}>
                <Image source={picChauffeur} style={styles.image3} resizeMode='center' />
                <View style={styles.chauffeurInfo}>
                    <Text style={styles.chauffeurUser} numberOfLines={1}>{userChauffeur}</Text>
                    <Text style={styles.chauffeurName} numberOfLines={1}>{chauffeur}</Text>
                </View>
                <View style={styles.ratingView}>
                    <Text style={styles.ratingText}>{rating}</Text>
                    <Icon name="star" color="#FFE70F" size={25} />
                </View>
            </View>
            <View style={styles.carInfoView}>
                <Image source={require("../../assets/Car.png")} style={styles.image2} resizeMode='center' />
                <View style={styles.carInfo}>
                    <Text style={styles.iterneraireText} numberOfLines={1}>{carInfo}</Text>
                    <Text style={styles.iterneraireText} numberOfLines={1}>{matricule}</Text>
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
            <View style={styles.rideInfo}>
                <Text style={styles.tempsText}>{temps} minutes</Text>
                <Text style={styles.prixText}>Prix : {prix} DA</Text>
            </View>
        </View>
    )
}

export default ChauffeurRide

const styles = StyleSheet.create({
    accepterOuRefuserCard:{
        height:300,
        backgroundColor:"#FFF",
        borderRadius:10,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-around"
    },
    previewChauffeur:{
        display:"flex",
        flexDirection:"row",
        width:"85%",
        alignSelf:"center",
        height:"20%"
    },
    carInfoView:{
        height:"20%",
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    itineraireInfoView:{
        height:"25%",
        width:"90%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    rideInfo:{
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        gap:5
    },
    image:{
        height:"100%",
        width:"17%",
    },
    image2:{
        height:"100%",
        width:"12%",
    },
    image3:{
        height:"100%",
        width:"15%",
    },
    chauffeurInfo:{
        flex:1,
        height:"100%",
        display:"flex",
        flexDirection:"column",
        marginLeft:15,
        paddingVertical:2,
        justifyContent:"space-around"
    },
    chauffeurName:{
        fontSize:16,
        fontWeight:"700"
    },
    chauffeurUser:{
        fontSize:14,
        color:Config.darkGrey
    },
    ratingView:{
        height:"100%",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end"
    },
    ratingText: {
		fontFamily: "Poppins_400Regular",
		color: "#000",
		fontSize: 20,
		width: "auto",
		fontWeight: "700",
	},
	ratingText: {
		fontFamily: "Poppins_400Regular",
		color: "#000",
		fontSize: 20,
		width: "auto",
		fontWeight: "700",
	},
    iterneraireText:{
        fontSize:16,
        width:"95%",
    },
    carInfo:{
        flex:1,
        height:"100%",
        display:"flex",
        flexDirection:"column",
        marginLeft:15,
        paddingVertical:2,
        justifyContent:"space-between"
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
    tempsText:{
        fontSize:18,
        fontWeight:"bold",
    },
    prixText:{
        fontSize:18,
        fontWeight:"bold",
        color:Config.lightBlue
    },
})