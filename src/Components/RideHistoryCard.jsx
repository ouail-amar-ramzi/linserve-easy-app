import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import Config from "../../Config.json"

export default RideHistoryCard = ({date, depart, arrivee, temps, prix}) => {
	return (
		<View style={styles.container}>
			<Text numberOfLines={1} style={styles.dateText}>{date}</Text>
            <View style={styles.itineraireInfoView}>
                <Image source={require("../../assets/Road.png")} style={styles.image} resizeMode='center' />
                <View style={styles.itineraireInfo}>
                    <Text style={styles.iterneraireText} numberOfLines={1}>{depart}</Text>
                    <View style={{backgroundColor:Config.lightGrey, height:3, width:"100%"}}></View>
                    <Text style={styles.iterneraireText} numberOfLines={1}>{arrivee}</Text>
                </View>
            </View>
            <View style={styles.tempPrixView}>
                <Text style={styles.tempsText}>{temps} minutes</Text>
                <Text style={styles.prixText}>Prix : {prix} DA</Text>
            </View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
        display:"flex",
        flexDirection:"column",
        height:200,
        justifyContent:"space-between",
        borderTopWidth:4,
        borderBottomWidth:4,
        borderColor:Config.lightGrey,
        paddingVertical:20
	},
    dateText:{
        width:"80%",
        alignSelf:"center",
        fontSize:17,
        height:"22%",
        textAlignVertical:"center",
    },
    itineraireInfo:{
        height:"100%",
        width:"80%",
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
    itineraireInfoView:{
        height:"37%",
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    image:{
        height:"100%",
        width:"17%",
    },
    tempPrixView:{
        display:"flex",
        flexDirection:"row",
        height:"22%",
        width:"80%",
        alignSelf:"center",
        justifyContent:"space-between"
    },
    prixText:{
        fontSize:20,
        width:"45%",
        textAlign:"right",
        textAlignVertical:"center",
        color:Config.lightBlue,
        fontWeight:"bold"
    },
    tempsText:{
        fontSize:20,
        width:"45%",
        textAlignVertical:"center",
        fontWeight:"bold"
        
    }
});
