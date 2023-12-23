import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Platform, NativeModules, Dimensions, StatusBar, ScrollView, KeyboardAvoidingView, Image, ActivityIndicator } from "react-native"
import Config from '../../../Config.json'
import { useFonts, Poppins_400Regular, Poppins_700Bold, } from "@expo-google-fonts/poppins";
import NavBar from "../../Components/NavBar";
import GetLocation from 'react-native-get-location'
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import CustomButton from "../../Components/CustomButton";
import RideCardAccepted from "../../Components/RideCardAccepted";
import SearchItiniraires from "../../Components/SearchItiniraires";
import RideCard from "../../Components/RideCard";
import { Rating, AirbnbRating, TapRatingProps } from 'react-native-ratings';
import TapRating from "react-native-ratings/dist/TapRating";
import MapView, { Marker, Geojson, Callout, Polyline } from 'react-native-maps';
import ChauffeurRide from "../../Components/ChauffeurRide";
import * as Location  from 'expo-location';
import Icon from "react-native-vector-icons/FontAwesome";
import Geocoder from 'react-native-geocoding';
import { useAppContext } from "../../context"
import Api from "../../api/Api"
import Urls from "../../api/Urls"
import StatusCodes from "../../api/StatusCodes"
import ErrorAlert from "../../Components/ErrorAlert"
import socket from "../../api/socket"

export default Home = ({navigation}) => {
    const emptyCoords = {
        latitude:null,
        longitude:null
    }
    const [currentRegion, setCurrentRegion] = useState({
        latitude: 31.56678046013073,
        longitude: 3.108429796993733,
        latitudeDelta: 12,
        longitudeDelta: 12,
    })
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorVisible, setErrorVisible] = useState(false);
    const { user } = useAppContext();
    let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
    const [ currentLocation, setCurrentLocation ] = useState(null)
    const [ step, setStep ] = useState("MainView")
    const [ depart, setDepart ] = useState({
        toShow:"depart",
        coords:{
            latitude:null,
            longitude:null
        },
        showMarker:false
    })
    const [ destination, setDestination ] = useState({
        toShow:"destination",
        coords:{
            latitude:null,
            longitude:null
        },
        showMarker:false
    })
    const [ isLocationEnabled, setIsLocationEnabled ] = useState(false)
    const [ newRating, setNewRating ] = useState(3)
    const [ choosing, setChoosing ] = useState(null)
    const [ ride, setRide ] = useState({
        depart:"",
        destination:"",
        chauffeur:"",
        carInfo:"",
        matricule:"",
        userChauffeur:"",
        rating:"",
        temps:"",
        prix: "",
        picChauffeur:null

    })
    const [listening, setListening] = useState(false)
    const [ temporaryValue, setTemporaryValue ] = useState(null)
    useEffect(() => {
        const intervalId = setInterval(() => {
            Location.PermissionStatus === Location.requestForegroundPermissionsAsync().then((result)=>{
                if ( result.status === Location.PermissionStatus.GRANTED ){
                    Location.hasServicesEnabledAsync().then(result=>{
                        if ( result ){
                            setIsLocationEnabled(true)
                        } else {
                            setIsLocationEnabled(false)
                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                } else {
                    setIsLocationEnabled(false)
                }
            }).catch((err)=>{
                console.log(err);
            })

        }, 5000);
    
        return () => clearInterval(intervalId);
    }, [isLocationEnabled, depart, destination]);
    useEffect(() => {
        if ( listening ){
            socket.on("start_request",(response)=>{
                console.log(response);
            })
        }
    },[])
    useEffect(() => {
        const every3Seconds = () => {
            Location.getCurrentPositionAsync({}).then(result=>{
                let data = new FormData()
                data.append("location_latitude",result.coords.latitude)
                data.append("location_longitude",result.coords.longitude)
                Api.post(Urls.USER_UPDATE_LOCATION, data)
            })
        };
    
        const intervalId = setInterval(every3Seconds, 3000);
            return () => clearInterval(intervalId);
    
      }, []);

    const onPress = {
        onPressDemander:() =>{
            setStep("Set up Trajet");
        },
        onPressConfirmer:() =>{
            console.log("OK");
            setStep("Loading Trajet")
            let data = new FormData();
            data.append("from_location_latitude",depart.coords.latitude);
            data.append("from_location_longitude",depart.coords.longitude);
            data.append("to_location_latitude",destination.coords.latitude);
            data.append("to_location_longitude",destination.coords.longitude);
            Api.post(Urls.USER_GET_TRAJET_INFO,data).then((response)=>{
                console.log(response.data);
                if ( response.data.code_type === StatusCodes.Success ){
                    setRide({...ride,"prix":response.data.request_price,"temps":response.data.request_estimated_duration,"depart":response.data.request_from_location_name,"destination":response.data.request_to_location_name})
                    setStep("Trouver chauffeur")
                }else{
                    setStep("Set up Trajet")
                    setErrorMessage(response.data.error)
                    setErrorVisible(true)
                }
            }).catch(err=>{
                console.log(err);
                setStep("Set up Trajet")
                setErrorMessage("Erreur d'acces au serveur");
                setErrorVisible(true)
            })
        },
        onPressTrouverChauffeur:()=>{
            setStep("Trouver chauffeur Loading");
            Api.post(Urls.USER_TROUVER_CHAUFFEUR).then(response=>{
                console.log(response.data);
                if ( response.data.code_type === StatusCodes.Success ){
                    if ( socket.connected ){
                    }else{
                        socket.connect();
                    }
                    if ( socket.connected ){
                        setListening(true)
                    }else{
                        setErrorMessage("Erreur d'acces au serveur, veuillez reessayer plus tard");
                        setErrorVisible(true);
                    }
                }else{
                    setStep("Trouver chauffeur")
                    setErrorMessage(response.data.error);
                    setErrorVisible(true);
                }
            }).catch(err=>{
                console.log(err);
                setStep("Trouver chauffeur")
                setErrorMessage("Erreur d'acces au serveur");
                setErrorVisible(true);
            })
        },
        onPressAnnuler:() =>{
            setTemporaryValue(null)
            setDepart({
                toShow:"depart",
                coords:{
                    latitude:null,
                    longitude:null
                },
                showMarker:false
            })
            setDestination({
                toShow:"destination",
                coords:{
                    latitude:null,
                    longitude:null
                },
                showMarker:false
            })
            console.log("ANNULER");
            setStep("MainView");
        },
        onPressAccepter:() =>{
            console.log("ANI ACCEPTIT ARWAAAH");
            setStep("Chauffeur On the Way")
        },
        onPressRefuser:() =>{
            console.log(("ANI REFUSIT LE MEC"));
            setStep("Trouver chauffeur Loading")
        },
        onPressCall:() =>{
            console.log("ALLO CHAUFFEUR WINRAK");
            setStep("On the road")
        },
        onPressTerminer:() =>{
            setStep("MainView");
            console.log(step);
        },
        onPressConfirmerLocation:() =>{
            if ( step === "location depart" ){
                setDepart({
                    toShow:"Case départ",
                    coords:{
                        latitude:temporaryValue.latitude,
                        longitude:temporaryValue.longitude
                    },
                    showMarker:true
                })
                setStep("Set up Trajet")
                setTemporaryValue(null)
            } else if ( step === "location destination" ){
                setDestination({
                    toShow:"Case d'arrivee",
                    coords:{
                        latitude:temporaryValue.latitude,
                        longitude:temporaryValue.longitude
                    },
                    showMarker:true
                })
                setStep("Set up Trajet")
                setTemporaryValue(null)
            }
        },
        onPressMap:(latitude, longitude)=>{
            if ( step === "location destination" || step === "location depart" ){
                if ( step === "location depart" ){
                    setCurrentRegion({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.25,
                        longitudeDelta: 0.25,
                    })
                }
                setTemporaryValue({
                    latitude:latitude,
                    longitude:longitude
                })
            }
        },
        onPressInMap:(theStep, location) =>{
            if ( theStep === "depart" ){
                if ( location === "current location" ){
                    Location.getCurrentPositionAsync({}).then(result=>{
                        setCurrentRegion({
                            latitude: result.coords.latitude,
                            longitude: result.coords.longitude,
                            latitudeDelta: 0.25,
                            longitudeDelta: 0.25,
                        })
                        setDepart({
                            toShow:"Votre position",
                            coords:{
                                latitude:result.coords.latitude,
                                longitude:result.coords.longitude
                            },
                            showMarker:true
                        })
                    })
                } else {
                    setTemporaryValue({
                        latitude:depart.coords.latitude,
                        longitude:depart.coords.longitude
                    })
                    setDepart({
                        toShow:"depart",
                        coords:{
                            latitude:null,
                            longitude:null
                        },
                        showMarker:false
                    })
                    setStep("location depart")
                }
            } else  if ( theStep === "destination" ){
                setTemporaryValue({
                    latitude:destination.coords.latitude,
                    longitude:destination.coords.longitude
                })
                setDestination({
                    toShow:"destination",
                    coords:{
                        latitude:null,
                        longitude:null
                    },
                    showMarker:false
                })
                setStep("location destination")
            }
        },
        onPressRetourSetupTrajet:()=>{
            setStep("Set up Trajet")
        }
    }
    return (
        <>
            <ErrorAlert
                errorMessage={errorMessage}
                visible={errorVisible}
                setVisible={setErrorVisible}
            />
            <View style={styles.container}>
                <StatusBar barStyle="default" backgroundColor={Config.lightBlue} />
                <View style={styles.mainTitleView} >
                    <Text style={styles.mainTitleText}>Course</Text>
                </View>
                <View style={styles.mapView}>
                    <MapView
                        mapType="standard"
                        style={{height:"100%", width:"100%"}}
                        onLongPress={(event)=>{onPress.onPressMap(event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude)}}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        userLocationUpdateInterval={2000}
                        userLocationFastestInterval={3000}
                        region={currentRegion}
                        userLocationPriority="balanced"
                        initialRegion={{
                            latitude: 31.56678046013073,
                            longitude: 3.108429796993733,
                            latitudeDelta: 12,
                            longitudeDelta: 12,
                        }}
                    >
                        {
                            ["Trouver chauffeur","Trouver chauffeur Loading","Loading Trajet","Chauffeur Ready","Chauffeur On the Way","On the road","Fin"].includes(step) &&
                            <Polyline 
                            coordinates={[
                                {latitude:depart.coords.latitude,longitude:depart.coords.longitude},
                                {latitude:destination.coords.latitude,longitude:destination.coords.longitude}
                            ]}
                            strokeColor={Config.lightBlue}
                            strokeWidth={5}
                            />
                        }
                        {
                            temporaryValue?.latitude && temporaryValue?.longitude && 
                            <Marker coordinate={{latitude:temporaryValue.latitude,longitude:temporaryValue.longitude}} />
                        }
                        {
                            depart.showMarker && 
                            <Marker coordinate={{latitude:depart.coords.latitude,longitude:depart.coords.longitude}} />
                        }
                        {
                            destination.showMarker && 
                            <Marker coordinate={{latitude:destination.coords.latitude,longitude:destination.coords.longitude}} />
                        }
                    </MapView>
                    {
                        ( step === "location destination" || step === "location depart" ) &&
                        <>
                            <TouchableOpacity style={{width:45, height:45, backgroundColor:Config.lightBlue, borderRadius:45, display:"flex", justifyContent:"center", paddingLeft:10, position:"absolute", top:15, left:15}} onPress={onPress.onPressRetourSetupTrajet}>
                                <Icon name="chevron-left" color={"#FFF"} size={25} />
                            </TouchableOpacity>
                            <View style={{width:"90%", alignSelf:"center", position:"absolute", bottom:0, marginBottom:10}}>
                                <CustomButton
                                    disabled={temporaryValue === null}
                                    fill={Config.lightBlue}
                                    fontSize={20}
                                    onPress={onPress.onPressConfirmerLocation}
                                    text="Confirmer"
                                    textColor={"#FFF"}
                                    />
                            </View>
                        </>
                    }
                    {
                        step === "MainView" &&
                        <View style={styles.demander}>
                            <CustomButton
                                fill={Config.lightBlue}
                                fontSize={15}
                                onPress={onPress.onPressDemander}
                                text="Demander un chauffeur"
                                textColor="#FFF"
                            />
                        </View>
                    }
                    {
                        step === "Set up Trajet" &&
                        <View style={styles.choisirItineraire}>
                            <SearchItiniraires
                                isLocationEnabled={isLocationEnabled}
                                depart={depart?depart.toShow:"depart"}
                                destination={destination?destination.toShow:"destination"}
                                setDepart={setDepart}
                                setDestination={setDestination}
                                onPressInMap={onPress.onPressInMap}
                                recentDestinations={[
                                    { destination:"Faculté de médecine Ziania" },
                                    { destination:"Faculté de médecine Ziania" },
                                    { destination:"Faculté de médecine Ziania" },
                                    { destination:"Faculté de médecine Ziania" },
                                    { destination:"Faculté de médecine Ziania" },
                                    { destination:"Faculté de médecine Ziania" },
                                ]}
                            />
                            <View style={styles.buttonsView}>
                                <View>
                                    <CustomButton
                                        textColor={Config.lightBlue}
                                        fontSize={16}
                                        fill="#FFF"
                                        text="Annuler"
                                        onPress={onPress.onPressAnnuler}
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <CustomButton
                                        fill={Config.lightBlue}
                                        fontSize={16}
                                        textColor="#FFF"
                                        text="Confirmer"
                                        disabled={depart.coords.latitude === emptyCoords.latitude || depart.coords.longitude === emptyCoords.longitude || destination.coords.latitude === emptyCoords || destination.coords.longitude === emptyCoords.longitude}
                                        onPress={onPress.onPressConfirmer}
                                    />
                                </View>
                            </View>
                        </View>
                    }
                    {
                        ( step ==="Trouver chauffeur" || step ==="Trouver chauffeur Loading" ) &&
                        <View style={styles.trouverChauffeur}>
                            <View style={styles.confirmCard}>
                                <View style={styles.itineraireInfoView2}>
                                    <Image source={require("../../../assets/Road.png")} style={styles.image} resizeMode='center' />
                                    <View style={styles.itineraireInfo}>
                                        <Text style={styles.iterneraireText} numberOfLines={1}>{ride.depart}</Text>
                                        <View style={{backgroundColor:Config.lightGrey, height:3, width:"100%"}}></View>
                                        <Text style={styles.iterneraireText} numberOfLines={1}>{ride.destination}</Text>
                                    </View>
                                </View>
                                <View style={styles.rideInfo}>
                                    <Text style={styles.tempsText}>{ride.temps}</Text>
                                    <Text style={styles.prixText}>Prix : {ride.prix} DA</Text>
                                </View>
                            </View>
                            <View style={styles.buttonsView}>
                                <View>
                                    <CustomButton
                                        textColor={Config.lightBlue}
                                        fontSize={16}
                                        fill="#FFF"
                                        text="Annuler"
                                        onPress={onPress.onPressAnnuler}
                                    />
                                </View>
                                {
                                    step === "Trouver chauffeur" &&
                                    <View style={{flex:1}}>
                                        <CustomButton
                                            fill={Config.lightBlue}
                                            fontSize={16}
                                            textColor="#FFF"
                                            text="Trouver un chauffeur"
                                            onPress={onPress.onPressTrouverChauffeur}
                                        />
                                    </View>
                                }
                                {
                                    step === "Trouver chauffeur Loading" &&
                                    <View style={{flex:1, backgroundColor:Config.lightBlue, borderRadius:10, display:"flex", justifyContent:"center"}} onTouchEnd={()=>{setStep("Chauffeur Ready")}}>
                                        <ActivityIndicator size="large" color="#FFF" />
                                    </View>
                                }
                            </View>
                        </View>
                    }
                    {
                        step === "Loading Trajet" &&
                        <View style={styles.trouverChauffeur}>
                            <View style={styles.confirmCard}>
                                <ActivityIndicator size="large" color={Config.lightBlue} />
                            </View>
                            <View style={styles.buttonsView}>
                                <View>
                                    <CustomButton
                                        textColor={Config.lightBlue}
                                        fontSize={16}
                                        fill="#FFF"
                                        text="Annuler"
                                        onPress={()=>setStep("Set up Trajet")}
                                    />
                                </View>
                                <Text style={styles.chargementText}>Chargement...</Text>
                            </View>
                        </View>
                    }
                    {
                        ( step === "Chauffeur Ready" || step === "Chauffeur On the Way" || step === "On the road" ) &&
                        <View style={styles.accepterRefuserChauffeur}>
                            <ChauffeurRide
                                arrivee={destination.toShow}
                                carInfo={ride.carInfo}
                                chauffeur={ride.chauffeur}
                                depart={depart.toShow}
                                matricule={ride.matricule}
                                picChauffeur={ride.picChauffeur}
                                prix={ride.prix}
                                rating={ride.rating}
                                temps={ride.temps}
                                userChauffeur={ride.userChauffeur}
                            />
                            {
                                step === "Chauffeur Ready" &&
                                <View style={styles.buttonsView}>
                                    <View style={{flex:1}}>
                                        <CustomButton
                                            textColor={Config.lightBlue}
                                            fontSize={16}
                                            fill="#FFF"
                                            text="Refuser"
                                            onPress={onPress.onPressRefuser}
                                        />
                                    </View>
                                    <View style={{flex:1}}>
                                        <CustomButton
                                            fill={Config.lightBlue}
                                            fontSize={16}
                                            textColor="#FFF"
                                            text="Accepter"
                                            onPress={onPress.onPressAccepter}
                                        />
                                    </View>
                                </View>
                            }
                            {
                                step === "Chauffeur On the Way" &&
                                <View style={styles.buttonsView}>
                                    <View>
                                        <CustomButton
                                            textColor={Config.lightBlue}
                                            fontSize={16}
                                            fill="#FFF"
                                            text="Annuler"
                                            onPress={onPress.onPressAnnuler}
                                        />
                                    </View>
                                    <View style={{flex:1}}>
                                        <CustomButton
                                            fill={Config.lightBlue}
                                            fontSize={16}
                                            textColor="#FFF"
                                            text="Appeler"
                                            onPress={onPress.onPressCall}
                                        />
                                    </View>
                                </View>
                            }
                            {
                                step === "On the road" && 
                                <Text style={styles.onRoad} onPress={setStep("Fin")}>
                                    Vous êtes en route
                                </Text>
                            }
                        </View>
                    }
                    {
                        step === "Fin" &&
                        <View style={styles.trajetTerminee}>
                            <View style={styles.terminerCard}>
                                <Text style={styles.courseDoneText}>Course terminée</Text>
                                <View style={styles.trajetView}>
                                    <Text style={styles.trajetChauffeurText}>Trajet</Text>
                                    <View style={styles.itineraireInfoView3}>
                                        <Image source={require("../../../assets/Road.png")} style={styles.image} resizeMode='center' />
                                        <View style={styles.itineraireInfo}>
                                            <Text style={styles.iterneraireText} numberOfLines={1}>{depart.toShow}</Text>
                                            <View style={{backgroundColor:Config.lightGrey, height:3, width:"100%"}}></View>
                                            <Text style={styles.iterneraireText} numberOfLines={1}>{destination.toShow}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.rideInfo2}>
                                    <Text style={styles.tempsText}>{ride.temps} minutes</Text>
                                    <Text style={styles.prixText}>Prix : {ride.prix} DA</Text>
                                </View>
                                <View style={styles.chauffeurView}>
                                    <Text style={styles.trajetChauffeurText}>Chauffeur</Text>
                                    <View style={styles.chauffeurEtVoiture}>
                                        <View style={styles.previewChauffeur2}>
                                            <Image source={ride.picChauffeur} style={styles.image3} resizeMode='center' />
                                            <View style={styles.chauffeurInfo}>
                                                <Text style={styles.chauffeurUser} numberOfLines={1}>{ride.userChauffeur}</Text>
                                                <Text style={styles.chauffeurName} numberOfLines={1}>{ride.chauffeur}</Text>
                                            </View>
                                            <View style={styles.ratingView}>
                                                <Text style={styles.ratingText}>{ride.rating}</Text>
                                                <Image
                                                    source={require("../../../assets/Star.png")}
                                                    style={[styles.ratingStar]}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.carInfoView2}>
                                            <Image source={require("../../../assets/Car.png")} style={styles.image2} resizeMode='center' />
                                            <Text style={styles.carName} numberOfLines={1}>{ride.carInfo}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.rateHim}>
                                    <Text style={styles.rateHimText}>Attribuer une note :</Text>
                                    <Rating
                                        type="star"
                                        imageSize={25}
                                        fractions={0}
                                        jumpValue={0}
                                        onFinishRating={value=>setNewRating(value)}
                                    />
                                </View>
                            </View>
                            <CustomButton
                                fill={Config.lightBlue}
                                fontSize={15}
                                onPress={onPress.onPressTerminer}
                                text="Terminer"
                                textColor="#FFF"
                            />
                        </View>
                    }
                </View>
                <View style={styles.navBarView}>
                    <NavBar focus={"2"} navigation={navigation} />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
		height: Dimensions.get("window").height,
		width: "100%",
        display:'flex',
        flexDirection:"column"
	},
    mainTitleView:{
        backgroundColor:Config.lightBlue,
        width:"100%",
        height:"12%",
        display:"flex",
        justifyContent:"flex-end",
        paddingBottom:"3%",
    },
    mainTitleText:{
        color:"#fff",
        width:"85%",
        alignSelf:"center",
        fontFamily:"Poppins_700Bold",
        fontSize:27,
    },
    navBarView:{
        height:"10%",
    },
    mapView:{
        height:"78%",
        backgroundColor:"#d4d",
        position:"relative"
    },
    map:{
        height:"100%",
        width:"100%",
    },
    demander:{
        width:"90%",
        alignSelf:"center",
        position:"absolute",
        bottom:0,
        marginBottom:10
    },
    choisirItineraire:{
        alignSelf:"center",
        height:parseInt(Dimensions.get("window").height*0.78)-20,
        width:"90%",
        display:"flex",
        flexDirection:"column",
        position:"absolute",
        bottom:10,
        gap:15
    },
    buttonsView:{
        display:"flex",
        flexDirection:"row",
        gap:10
    },
    trouverChauffeur:{
        width:"90%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:10,
        position:"absolute",
        bottom:10
    },
    confirmCard:{
        paddingTop:10,
        height:210,
        backgroundColor:"#FFF",
        borderRadius:10,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-around"
    },
    accepterOuRefuserCard:{
        height:300,
        backgroundColor:"#FFF",
        borderRadius:10,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-around"
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
    itineraireInfoView:{
        height:"25%",
        width:"90%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    itineraireInfoView2:{
        height:"40%",
        width:"90%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    carInfoView:{
        height:"20%",
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
    carInfo:{
        flex:1,
        height:"100%",
        display:"flex",
        flexDirection:"column",
        marginLeft:15,
        paddingVertical:2,
        justifyContent:"space-between"
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
    iterneraireText:{
        fontSize:16,
        width:"95%",
    },
    rideInfo:{
        width:"80%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:5
    },
    rideInfo2:{
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
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
    chargementText:{
        flex:1,
        textAlign:"center",
        textAlignVertical:"center",
        backgroundColor:Config.lightBlue,
        color:"#FFF",
        fontSize:16,
        borderRadius:10,
    },
    accepterRefuserChauffeur:{
        width:"90%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:10,
        position:"absolute",
        bottom:10
    },
    previewChauffeur:{
        display:"flex",
        flexDirection:"row",
        width:"85%",
        alignSelf:"center",
        height:"20%"
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
	ratingStar: {
		height: 30,
		width: 30,
	},
    onRoad:{
        backgroundColor:"#FFF",
        width:"100%",
        height:50,
        textAlign:"center",
        textAlignVertical:"center",
        fontSize:16,
        borderRadius:10,
        fontWeight:"700",
        color:Config.lightBlue
    },
    trajetTerminee:{
        width:"90%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:10,
        position:"absolute",
        bottom:10
    },
    terminerCard:{
        width:"100%",
        height:450,
        backgroundColor:"#FFF",
        borderRadius:10,
        display:"flex",
        flexDirection:"column",
        gap:10
    },
    courseDoneText:{
        color:"#000",
        width:"100%",
        textAlign:"center",
        marginTop:15,
        textAlignVertical:"center",
        fontSize:25,
        fontWeight:"700",
    },
    trajetChauffeurText:{
        color:"#000",
        width:"85%",
        alignSelf:"center",
        textAlign:"left",
        height:40,
        textAlignVertical:"center",
        fontSize:20,
        fontWeight:"700"
    },
    trajetView:{
        height:150,
        display:"flex",
        flexDirection:"column",
        gap:10,
    },
    chauffeurView:{
        height:150,
        display:"flex",
        flexDirection:"column",
        gap:10,
    },
    itineraireInfoView3:{
        height:80,
        width:"90%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    chauffeurEtVoiture:{
        display:"flex",
        flexDirection:"column"
    },
    chauffeurPreview:{
        display:"flex",
        flexDirection:"row"
    },
    previewChauffeur2:{
        display:"flex",
        flexDirection:"row",
        width:"85%",
        alignSelf:"center",
        height:60,
    },
    carInfoView2:{
        height:40,
        width:"80%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    carName:{
        fontSize:14,
        flex:1,
        marginLeft:15
    },
    rateHim:{
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    rateHimText:{
        color:Config.lightBlue,
        fontSize:16
    }
})