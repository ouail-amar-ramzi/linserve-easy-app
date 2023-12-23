import { View, StyleSheet, Text, ScrollView, SafeAreaView } from "react-native"
import { Platform, NativeModules, Dimensions, StatusBar } from "react-native";
const { StatusBarManager } = NativeModules;
import {
	useFonts,
	Poppins_400Regular,
	Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useState, useEffect } from "react";
import Config from '../../../Config.json'
import { Switch } from 'react-native-paper';
import RideCard from "../../Components/RideCard";
import NavBar from "../../Components/NavBar";
import { useAppContext } from "../../context";
import PaiementCard from "../../Components/PaiementCard";
import socket from "../../api/socket";
import Api from "../../api/Api";
import Urls from "../../api/Urls";
import * as Location  from 'expo-location';

export default WorkspaceChauffeur = ({navigation}) => {
    const { user } = useAppContext();
    let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
	const [dispo, setDispo] = useState(false)
	const [dispoOK, setDispoOK] = useState(true)
    const [clients, setClients] = useState([
        {
            id:0,
            userName:"@aniss.bslh",
            fullName:"Aniss Bessalah",
            depart:"Ecole Superieure d'Informatique (ESI)",
            arrivee:"Faculté de medecine ziania",
            prix:"400",
            temps:"18",
            rating:"4.8",
            profilePic:require('./../../../assets/Profile.png'),
        },
        {
            id:1,
            userName:"@aniss.bslh",
            fullName:"Aniss Bessalah",
            depart:"Ecole Superieure d'Informatique (ESI)",
            arrivee:"Faculté de medecine ziania",
            prix:"400",
            temps:"18",
            rating:"4.8",
            profilePic:require('./../../../assets/Profile.png'),
        },
        {
            id:2,
            userName:"@aniss.bslh",
            fullName:"Aniss Bessalah",
            depart:"Ecole Superieure d'Informatique (ESI)",
            arrivee:"Faculté de medecine ziania",
            prix:"400",
            temps:"18",
            rating:"4.8",
            profilePic:require('./../../../assets/Profile.png'),
        },
        {
            id:3,
            userName:"@aniss.bslh",
            fullName:"Aniss Bessalah",
            depart:"Ecole Superieure d'Informatique (ESI)",
            arrivee:"Faculté de medecine ziania",
            prix:"400",
            temps:"18",
            rating:"4.8",
            profilePic:require('./../../../assets/Profile.png'),
        },
        {
            id:4,
            userName:"@aniss.bslh",
            fullName:"Aniss Bessalah",
            depart:"Ecole Superieure d'Informatique (ESI)",
            arrivee:"Faculté de medecine ziania",
            prix:"400",
            temps:"18",
            rating:"4.8",
            profilePic:require('./../../../assets/Profile.png'),
        },
        {
            id:5,
            userName:"@aniss.bslh",
            fullName:"Aniss Bessalah",
            depart:"Ecole Superieure d'Informatique (ESI)",
            arrivee:"Faculté de medecine ziania",
            prix:"400",
            temps:"18",
            rating:"4.8",
            profilePic:require('./../../../assets/Profile.png'),
        },
    ])
    const onSwitch = () =>{
        Api.post(Urls.DRIVER_CHANGE_STATE)
        setDispo(!dispo)
    }
    const [clientAccepted, setClientAccepted] = useState(null)
    useEffect(() => {
        Api.get(Urls.ACCOUNT_GET_DATA).then(
            result=>{
                setDispoOK(false)
                setDispo(result.data.driver_is_available)
            })
    }, [])
    useEffect(() => {
        const every3Seconds = () => {
            Location.getCurrentPositionAsync({}).then(result=>{
                let data = new FormData()
                data.append("location_latitude",result.coords.latitude)
                data.append("location_longitude",result.coords.longitude)
                Api.post(Urls.DRIVER_UPDATE_POSITION, data)
            })
        };
    
        const intervalId = setInterval(every3Seconds, 3000);
            return () => clearInterval(intervalId);
    
      }, []);

    const handleAccepter = (id)=>{
        if (clientAccepted) setClientAccepted(null)
        else setClientAccepted(id)
        console.log(id);
    }
    return (
        <View style={styles.container}>
			<StatusBar barStyle="default" backgroundColor={Config.lightBlue} />
            <View style={styles.mainTitleView} >
                <Text style={styles.mainTitleText}>Workspace</Text>
            </View>
            <View style={styles.mainView}>
                <View style={styles.dispoView}>
                    <PaiementCard price={user.workspace.nextPayementPrice} date={user?.workspace?.nextPayementDate?.split(" ")[0]} />
                    <View style={styles.toggle}>
                        <Text style={styles.toggleText}>Disponible</Text>
                        <Switch disabled={dispoOK} value={dispo} color={Config.lightBlue} onValueChange={onSwitch} />
                    </View>
                    <Text style={styles.demandesText}>Demandes clients</Text>         
                </View>
                {
                    dispo?
                    <ScrollView style={styles.cardsView} overScrollMode="auto">
                        {
                            clients.map(item=>{
                                return(
                                    <RideCard
                                        key={item.id}
                                        fullName={item.fullName}
                                        userName={item.userName}
                                        depart={item.depart}
                                        arrivee={item.arrivee}
                                        prix={item.prix}
                                        temps={item.temps}
                                        rating={item.rating}
                                        profilePic={item.profilePic}
                                        onPress={()=>{handleAccepter(item.id)}}
                                        loading={item.id === clientAccepted}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                    :
                    <View style={styles.nonDispo}>
                        <Text style={styles.nonDispoMainText}>{"Vous n’êtes pas disponible pour le moment"}</Text>
                        <Text style={styles.nonDispoSecondaryText}>{"Veuillez activez votre disponibilté pour recevoir les demandes des clients"}</Text>
                    </View>
                }  
            </View>
            <View style={styles.navBarView}>
                <NavBar focus={"1"} navigation={navigation} />
            </View>
        </View>
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
    mainView:{
        height:"78%",
        backgroundColor:Config.lightGrey,
        width:"100%"
    },
    dispoView:{
        width:"100%",
        paddingTop:"2%",
        paddingBottom:"5%",
        backgroundColor:"#fff",
        display:"flex",
        flexDirection:"column",
        gap:15
    },
    toggle:{
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    toggleText:{
        fontSize:17,
        fontFamily:"Poppins_400Regular",
    },
    demandesText:{
        width:"85%",
        alignSelf:"center",
        fontSize:21,
        fontFamily:"Poppins_700Bold"
    },
    nonDispo:{
        width:"100%",
        flex:1,
        display:"flex",
        flexDirection:"column",
        gap:20,
        paddingTop:"20%",
    },
    nonDispoMainText:{
        width:"80%",
        alignSelf:"center",
        textAlign:"center",
        fontSize:22
    },
    nonDispoSecondaryText:{
        width:"80%",
        alignSelf:"center",
        textAlign:"center",
        color:Config.darkGrey,
        fontSize:13
    },
    cardsView:{
        paddingVertical:3,
        width:"100%",
        flex:1,
        display:"flex",
        flexDirection:"column",
        gap:3
    }
})