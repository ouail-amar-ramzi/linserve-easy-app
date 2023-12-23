import { Image, StyleSheet, Text, View } from 'react-native'
import Config from "../../Config.json"
import Icon from 'react-native-vector-icons/FontAwesome';
import AutoCompleteInput from 'react-native-tomtom-autocomplete';
import { useEffect } from 'react';

export default SearchItiniraires = ({recentDestinations, depart, setDepart, destination, setDestination, onPressInMap, isLocationEnabled}) => {
    const arrayToShow = ( array ) =>{
        let newArray = [];
        for ( let i = 0; i < Math.min(4, array.length) ; i++ ){
            newArray.push(array[i])
        }
        return newArray
    }
    const onPressRecentDestination = ( recentDestination ) =>{
        // setDestination()
    }
    useEffect(()=>{

    },[isLocationEnabled,depart,destination,recentDestinations])
    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>Selectionnez votre trajet</Text>
            <View style={styles.departEtArrivee}>
                <Image source={require("../../assets/Road.png")} resizeMode='contain' style={styles.image} />
                <View style={styles.departEtArriveeView}>
                    {/* <AutoCompleteInput
                        inputProps={{
                            placeholder: "Search",
                        }}
                        onPress={(item) => console.log('item', item)}
                        inputContainerStyle={{
                            padding: 10,
                            margin: 10,
                            borderWidth: 2,
                            borderColor: "grey",
                        }}
                        listItemsContainerStyle={{
                            padding: 10,
                            marginHorizontal: 10,
                            borderWidth: 2,
                            borderColor: "grey",
                        }}
                        bottomDivider
                        tomtomOptions={{ key: "RvsZysl1EyH5X2CGgOtThQi3TClddp2I" }}
                    /> */}
                    <View style={{display:"flex", flexDirection:"row", gap:5}}>
                        <Text style={{flex:1}}>{depart}</Text>
                        {
                            isLocationEnabled && 
                            <Icon name="location-arrow" onPress={()=>{onPressInMap("depart","current location")}} color={Config.lightBlue} size={28} style={{paddingHorizontal:8}} />
                        }
                        <Icon name="map-pin"  onPress={()=>{onPressInMap("depart","location")}} color={Config.lightBlue} size={28} style={{paddingHorizontal:8}} />
                    </View>
                    <View style={{backgroundColor:Config.lightGrey, height:3, width:"100%"}}></View>
                    <View style={{display:"flex", flexDirection:"row", gap:5}}>
                        <Text style={{flex:1}}>{destination}</Text>
                        <Icon name="map-pin"  onPress={()=>{onPressInMap("destination","location")}}  color={Config.lightBlue} size={28} style={{paddingHorizontal:8}} />
                    </View>
                </View>
            </View>
            <View style={{backgroundColor:Config.lightGrey, height:5, width:"100%"}}></View>
            <Text style={styles.recentDestination}>Récents</Text>
            <View style={styles.recentsView}>
                {
                    arrayToShow(recentDestinations).map((elt, index)=>{
                        return (
                            <View style={styles.oneRecentDestination} key={index}>
                                <Icon style={styles.icon} name="map-marker"size={35} color={Config.lightBlue} />
                                <Text numberOfLines={1} style={styles.oneRecentDestinationText}>{elt.destination}</Text>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        flex:1,
        backgroundColor:"#FFF",
        borderRadius:15,
        display:"flex",
        flexDirection:"column",
        gap:20
    },
    mainText:{
        paddingTop:20,
        width:"100%",
        fontSize:20,
        fontWeight:"700",
        textAlign:"center"
    },
    departEtArrivee:{
        width:"85%",
        alignSelf:"center",
        height:100,
        display:"flex",
        flexDirection:"row"
    },
    image:{
        width:"15%",
        height:"100%"
    },
    departEtArriveeView:{
        marginLeft:10,
        display:"flex",
        flex:1,
        flexDirection:"column",
        justifyContent:"space-around"
    },
    recentsView:{
        width:"100%",
        display:"flex",
        flexDirection:"column",
        gap:10
    },
    oneRecentDestination:{
        width:"80%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        gap:15
    },
    oneRecentDestinationText:{
        fontSize:16
    },
    recentDestination:{
        width:"80%",
        alignSelf:"center",
        fontWeight:"700",
        fontSize:18
    }
})