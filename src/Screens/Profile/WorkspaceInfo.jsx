import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Text, StatusBar, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, Keyboard, ActivityIndicator, BackHandler } from "react-native";
import { Platform, NativeModules } from "react-native";
const { StatusBarManager } = NativeModules;
import { IconButton } from "react-native-paper";
import {
	useFonts,
	Poppins_400Regular,
	Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import Icon from 'react-native-vector-icons/FontAwesome';
import Config from "../../../Config.json"
import CustomButton from "../../Components/CustomButton";
import CustomTextInput from "../../Components/CustomTextInput";
import NavBar from "../../Components/NavBar";
import { useAppContext } from "../../context";
import Api from "../../api/Api"
import Urls from "../../api/Urls"
import StatusCodes from "../../api/StatusCodes"

export default WorkspaceInfo = ({navigation}) => {
	const {user} = useAppContext()
    let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
	const [marque, setMarque] = useState(user.workspace.marque)
    const [modele, setModele] = useState(user.workspace.Modele)
    const [couleur, setCouleur] = useState(user.workspace.Couleur)
    const [annee, setAnnee] = useState(user.workspace.Annee)
    const [matricule, setMatricule] = useState(user.workspace.Matricule)
    const [phone, setPhone] = useState("")
    const [edit, setEdit] = useState(false)
    const [editPhone, setEditPhone] = useState(false)
    const scrollViewRef = useRef(null);
    const [step, setStep] = useState(0);
    const [error, setError] = useState(false)
    const [otpValue, setOptValue] = useState("");
    const [resend, setResend] = useState(false);

    const handleBackButton = () => {
        if ( edit ){
            setEdit(false)
            return true
        }
        if ( editPhone ){
            if ( step === 0 ) {
                setEditPhone(false)
                return true;
            }
            else{
                setStep(step-1);
                return true
            }
        }
        navigation.pop(1)
        return true
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y:200, animated: true });
            }
        });
        return () => {
        keyboardDidShowListener.remove();
        BackHandler.removeEventListener('hardwareBackPress');
        };
    
    }, [error,edit, step, editPhone]);
    const handleSendCode = ()=>{
		console.log("ab3et l code");
		setStep(1);
	}
	const handleErrorPhone = ()=>{
		console.log("Nimiro ghalet");
        setResend(false)
		setStep(0);
	}
	const handleRenvoyerCode = ()=>{
		console.log("3awed ab3et l code");
		setResend(true)
	}
	const handleCheckCode = ()=>{
		console.log("Verifyi l code");
		setStep(2)
	}
	const handleDone = ()=>{
		console.log("Kmlna");
		setStep(0)
        setEditPhone(false)
	}

    const onPressSave = () =>{
        let data = new FormData();
        data.append("car_brand",marque)
        data.append("car_model",modele)
        data.append("car_color",couleur)
        data.append("car_year",annee)
        data.append("car_registration_number",matricule)
        Api.post(Urls.EDIT_DRIVER_INFO,data).then(response=>{
            console.log(response.data);
            // if ( response.data.code_type === StatusCodes.Success ){
                
            // }
        })
        setEdit(false)
    }
    const onPressEdit = () =>{
        console.log("edit info");
        setEdit(true)
    }
    const onPressEditPhone = () =>{
        setEditPhone(true)
    }
    return (
        <View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <View style={styles.bigView}>
                <View style={styles.retourView}>
                    <Text style={styles.personalDataText}>{editPhone?"Numéro de téléphone":"Données workspace"}</Text>
                    <Icon style={styles.icon} name="chevron-left"size={17} onPress={handleBackButton} />
                </View>
                {
                    edit?
                    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
                        <ScrollView contentContainerStyle={styles.editView}>
                            <View style={styles.inputsView}>
                                <CustomTextInput
                                    label={"Marque de voiture"}
                                    value={marque}
                                    setValue={setMarque}
                                />
                                <CustomTextInput
                                    label={"Modéle de voiture"}
                                    value={modele}
                                    setValue={setModele}
                                />
                                <CustomTextInput
                                    label={"Couleur de voiture"}
                                    value={couleur}
                                    setValue={setCouleur}
                                />
                                <CustomTextInput
                                    label={"Année de la voiture"}
                                    value={annee}
                                    setValue={setAnnee}
                                />
                                <CustomTextInput
                                    label={"Matricule"}
                                    value={matricule}
                                    setValue={setMatricule}
                                />
                            </View>
                            <View style={styles.buttonView}>
                                <CustomButton
                                    fontSize={16}
                                    textColor="#FFF"
                                    text="Sauvegarder"
                                    fill={Config.lightBlue}
                                    onPress={onPressSave}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    :
                    editPhone?
                    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollView}>
                            <View style={styles.texts}>
                                <Text style={styles.mainText}>
                                    Vérification OTP
                                </Text>
                                <Text style={styles.secondaryText}>
                                    {
                                        step === 0?
                                        "Nous vous enverrons un mot de passe à usage unique sur votre numéro de mobile"
                                        :
                                        `Entrez le code envoyé au ${phone}`
                                    }
                                </Text>
                                {
                                    step === 1?
                                    <Text style={{...styles.secondaryText, color:Config.lightBlue, textDecorationLine:"underline"}} onPress={handleErrorPhone}>
                                        ce n'est pas mon numéro ?
                                    </Text>
                                    :
                                    null
                                }
                            </View>
                            <View style={styles.inputView}>
                                {
                                    step === 0 ?
                                    <CustomTextInput
                                        error={error}
                                        label="Numéro de téléphone"
                                        number={true}
                                        value={phone}
                                        setValue={setPhone}
                                    />
                                    :
                                    <CustomTextInput
                                        error={error}
                                        center={true}
                                        disabled={step === 3 || step === 2}
                                        label="Code OTP"
                                        number={true}
                                        value={otpValue}
                                        setValue={setOptValue}
                                    />
                                }
                                {
                                    error?
                                    step === 0?
                                    <Text style={{
                                        ...styles.secondaryText,
                                        color:"red"
                                    }}>Veuillez vérifier le numéro saisi</Text>
                                    :
                                    <Text style={{
                                        ...styles.secondaryText,
                                        color:"red"
                                    }}>Veuillez vérifier le code saisi</Text>
                                    :null
                                }
                                {
                                    step === 1 & !resend?
                                    <Text style={styles.secondaryText}>Vous n'avez pas reçu l'OTP? <Text  style={{color:Config.lightBlue}} onPress={handleRenvoyerCode}>Renvoyer</Text></Text>
                                    :
                                    step === 1?
                                    <Text style={styles.secondaryText}>Code renvoyé</Text>
                                    :
                                    null
                                }
                                {
                                    step === 2?
                                    <View style={{width:"100%", backgroundColor:Config.lightBlue, borderRadius:10, height:50, display:"flex", justifyContent:"center", alignItems:"center"}} onTouchEnd={()=>setStep(3)}><ActivityIndicator size="large" color="#FFF" /></View>
                                    :
                                    <CustomButton
                                        fill={Config.lightBlue}
                                        fontSize={15}
                                        text={step===0?"Envoyer le code":step === 1?"Vérifier":"C'est Verifié"}
                                        textColor="#FFF"
                                        onPress={step === 0?handleSendCode : step === 1? handleCheckCode : handleDone}
                                    />
                                }
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    :
                    <ScrollView contentContainerStyle={styles.infoView}>
                        <View style={styles.barre}>
                            <Image source={{uri:user.user.profilePicture}} style={styles.image} resizeMode="center" />
                            <View style={styles.nameView}>
                                <Text>{user.user.fullName}</Text>
                                <Text>{"@"+user.user.userName}</Text>
                            </View>
                            <View style={styles.Rating}>
                                <Text style={styles.ratingText}>{user.workspace.rating}</Text>
                                <Icon name="star" color="#FFE70F" size={25} />
                            </View>
                        </View>
                        <ScrollView contentContainerStyle={styles.infosContainer}>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Marque de voiture</Text>
                                <Text style={styles.infoText}>{user.workspace.marque}</Text>
                            </View>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Modèle de voiture</Text>
                                <Text style={styles.infoText}>{user.workspace.Modele}</Text>
                            </View>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Couleur</Text>
                                <Text style={styles.infoText}>{user.workspace.Couleur}</Text>
                            </View>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Année de la voiture</Text>
                                <Text style={styles.infoText}>{user.workspace.Annee}</Text>
                            </View>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Matricule</Text>
                                <Text style={styles.infoText}>{user.workspace.Matricule}</Text>
                            </View>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Numéro de téléphone professionnel</Text>
                                <Text style={styles.infoText}>{user.workspace.phonePro}</Text>
                            </View>
                        </ScrollView>
                        <View style={styles.editButtonView}>
                            <CustomButton
                                fill={Config.lightBlue}
                                fontSize={16}
                                onPress={onPressEdit}
                                text="Modifier"
                                textColor="#FFF"
                            />
                            <CustomButton
                                fill={Config.lightBlue}
                                fontSize={16}
                                onPress={onPressEditPhone}
                                text="Modifier le numéro"
                                textColor="#FFF"
                            />
                        </View>
                    </ScrollView>
                }
                
            </View>
            <View style={styles.navBarView}>
                <NavBar focus={"3"} navigation={navigation} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get("window").height,
		width: "100%",
        display:'flex',
        flexDirection:"column",
        backgroundColor:"#FFF"
	},
    bigView:{
        height:"90%",
        width:"100%",
        display:"flex",
        flexDirection:"column",
    },
    navBarView:{
        height:"10%",
    },
    retourView:{
        width:"100%",
        height:"10%",
        display:"flex",
        justifyContent:"center",
        position:"relative",
    },
    personalDataText:{
        width:"100%",
        textAlign:"center",
        fontSize:20,
    },
    icon:{
        position:"absolute",
        padding:20
    },
    infoView:{
        flex:1,
        width:"80%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:30
    },
    barre:{
        width:"100%",
        display:"flex",
        flexDirection:"row"
    },
    image:{
        width:"20%",
        aspectRatio:1,
        borderRadius:100,
    },
    ratingText: {
		fontFamily: "Poppins_400Regular",
		color: "#000",
		fontSize: 22,
		width: "auto",
		fontWeight: "700",
	},
	Rating: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
	nameView:{
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:5,
        paddingHorizontal:15,
        flex:1,
    },
    oneInfoContainer:{
        display:"flex",
        width:"100%",
        flexDirection:"column"
    },
    infosContainer:{
        display:"flex",
        flexDirection:"column",
        gap:25
    },
    titleText:{
        width:"100%",
        fontSize:14,
        color:Config.darkGrey
    },
    infoText:{
        width:"100%",
        fontSize:16,
        color:"#000",
        fontWeight:"600"        
    },
    editButtonView:{
        display:"flex",
        flexDirection:"column",
        gap:10,
        flex:1,
        justifyContent:"flex-end",
        paddingBottom:20
    },
    scrollView: {
		paddingTop: "10%",
		alignSelf: "flex-end",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 30,
	},
    texts: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 10,
	},
	mainText: {
		width: "90%",
		fontSize: 20,
		textAlign: "center",
		fontFamily:"Poppins_700Bold"
	},
	secondaryText: {
		width: "90%",
		alignSelf:"center",
		fontSize: 15,
		textAlign: "center",
		fontFamily:"Poppins_400Regular",
	},
	inputView: {
		width: "80%",
		display: "flex",
		flexDirection: "column",
		gap: 30,
		paddingBottom:30,
	},
    editView:{
        flex:1,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between"
    },
    inputsView:{
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:15,
        marginTop:"10%"
    },
    buttonView:{
        width:'80%',
        alignSelf:"center",
        marginBottom:"10%"
    },
})