import { StyleSheet, SafeAreaView, Text, View, Dimensions, StatusBar, Image, Linking, Platform, Alert } from "react-native";
import { useState } from "react";
import Config from '../../../Config.json'
import CustomButton from "../../Components/CustomButton";
import RideCardAccepted from "../../Components/RideCardAccepted";
import Icon from 'react-native-vector-icons/FontAwesome';
import RideCardEnd from "../../Components/RideCardEnd";

export default WorkspaceRide = () => {
	const name = "Bessalah Aniss"
	const username = "@aniss.bslh"
    const depart = "Ecole Superieure d'Informatique (ESI)"
    const arrivee = "Faculté de medecine ziania"
    const prix = "400"
    const temps = "18"
    const rating = "4.7"
    const profilePic = require("../../../assets/Profile.png")
    const phone = ""
    const [step, setStep] = useState(0)
    const onPressCancel = () =>{
        console.log("POV : annulit la course");
    }
    const onPressStart = () =>{
        console.log("POV : demarit");
        setStep(1)
    }
    const onPressCall = () =>{
        console.log("ALLO WIIII!")
        // let phoneNumber;
        // if ( Platform.OS === "android" ){
        //     phoneNumber = `tel:${phone}`;
        // } else  {
        //     phoneNumber = `tel:${phone}`;
        //   }
        // Linking.canOpenURL(phoneNumber)
        // .then((supported)=>{
        //     if ( supported ){
        //         return Linking.openURL(phoneNumber)
        //     }else{
        //         Alert.alert('Phone number is not available');
        //     }
        // })
        // .catch((err)=>{
        //     console.log(err)
        // })
    }
    const onPressMaps = () =>{
        console.log("WERILI TRI9");
    }
    const onPressEndRide= () =>{
        console.log("KMLNA LA COURSE");
        setStep(2)
    }
    const onPressEnd = () =>{
        console.log("CHEFNA KLCH, HEYA N&WSO 3LA COURSE WHDOKHRA");
        setStep(0)
    }
    return (
		<View style={styles.container}>
			<StatusBar barStyle="default" backgroundColor={Config.lightBlue} />
            <View style={styles.mainTitleView} >
                <Text style={styles.mainTitleText}>Workspace</Text>
            </View>
            <View style={styles.mainView}>
                {
                    step === 0?
                    <View style={styles.rideView}>
                        <RideCardAccepted fullName={name}
                            userName={username}
                            depart={depart}
                            arrivee={arrivee}
                            prix={prix}
                            temps={temps}
                            rating={rating}
                            profilePic={profilePic}
                            onPressCall={onPressCall}
                            onPressMaps={onPressMaps}
                            showCall={step === 0}
                            showMaps={step === 0}
                        />
                        
                            <View style={styles.rideButtonsView}>
                                <View style={styles.cancelButton}>
                                    <CustomButton
                                        textColor={Config.lightBlue}
                                        text={"Annuler"}
                                        fill={"#fff"}
                                        onPress={onPressCancel}
                                    />
                                </View>
                                <View style={styles.acceptButton}>
                                    <CustomButton
                                        text={"Démarrer"}
                                        fill={Config.lightBlue}
                                        onPress={onPressStart}
                                    />
                                </View>
                            </View>
                    </View>
                    :step === 1?
                    <View style={styles.rideView}>
                        <RideCardAccepted
                            fullName={name}
                            userName={username}
                            depart={depart}
                            arrivee={arrivee}
                            prix={prix}
                            temps={temps}
                            rating={rating}
                            profilePic={profilePic}
                            onPressCall={onPressCall}
                            onPressMaps={onPressMaps}
                            showCall={step === 0}
                            showMaps={step === 0}
                        />
                    
                        <View style={styles.rideButtonsView}>
                            <View style={styles.endRideButton}>
                                <CustomButton
                                    fill={Config.lightBlue}
                                    fontSize={15}
                                    onPress={onPressEndRide}
                                    text="Terminer la course"
                                    textColor="#FFF"
                                />
                            </View>
                            <View style={styles.button} onTouchEnd={onPressMaps}>
                                <Icon style={styles.icon} name="location-arrow"size={28} color={"#fff"} />
                            </View>
                        </View>
                    </View>
                    :
                    <View style={styles.rideView}>
                        <RideCardEnd
                            fullName={name}
                            userName={username}
                            depart={depart}
                            arrivee={arrivee}
                            prix={prix}
                            temps={temps}
                            rating={rating}
                            profilePic={profilePic}
                            onPressCall={onPressCall}
                            onPressMaps={onPressMaps}
                            showButtons={step === 0}
                        />
                        <View style={styles.rideButtonsView}>
                            <View style={styles.endRideButton}>
                                <CustomButton
                                    fill={Config.lightBlue}
                                    fontSize={15}
                                    onPress={onPressEnd}
                                    text="Terminer"
                                    textColor="#FFF"
                                />
                            </View>
                        </View>
                    </View>
                }
            </View>
            <View style={styles.navBarView}>
                <NavBar focus={"1"} />
            </View>
        </View>
	);
};

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
        // backgroundColor:Config.lightGrey,
        backgroundColor:"#d4d",
        width:"100%",
    },
    rideView:{
        position:"absolute",
        bottom:0,
        width: "90%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:15,
        marginBottom:10
    },
    rideButtonsView:{
        width:"100%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        gap:10
    },
    cancelButton:{
    },
    acceptButton:{
        flex:1
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
    onRoad:{
        width:"100%",
        backgroundColor:"#FFF",
        height:50,
        borderRadius:10
    },
    onRoadText:{
        height:"100%",
        width:"100%",
        color:Config.lightBlue,
        textAlign:"center",
        fontSize:17,
        textAlignVertical:"center",
    },
    button:{
        backgroundColor:Config.lightBlue,
        height:50,
        width:50,
        borderRadius:10,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    icon:{
    },
    endRideButton:{
        flex:1,
    }
});
