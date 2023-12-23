import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Config from "../../Config.json"

export default PaiementCard = ({price, date}) => {
    return (
        <View style={{width:"90%", alignSelf:"center", backgroundColor:Config.lightBlue, gap:10, display:"flex", flexDirection:"column", padding:15, borderRadius:10}}>
            <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                <Text style={{fontSize:17, fontWeight:"700", color:"#FFF"}}>Prochain paiement</Text>
                <Text style={{fontSize:17, color:"#FFF"}}>{date}</Text>
            </View>
            <Text style={{color:"#FFF", fontSize:27, fontWeight:"800"}}>{price}{" "}DA</Text>
        </View>
    )
}

const styles = StyleSheet.create({})