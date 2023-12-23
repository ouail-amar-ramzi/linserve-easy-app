import { View, SafeAreaView, StyleSheet, Text, ScrollView, Dimensions, StatusBar, Image, Keyboard, KeyboardAvoidingView, BackHandler } from "react-native"
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useState, useRef, useEffect } from "react";
import Config from '../../../Config.json'
import CustomButton from "../../Components/CustomButton";
import CustomTextInput from "../../Components/CustomTextInput";
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from "../../Components/NavBar";
import { useAppContext } from "../../context";
import Api from "../../api/Api"
import Urls from "../../api/Urls"
import StatusCodes from "../../api/StatusCodes"
import { ActivityIndicator } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

export default DevenirChauffeur = ({navigation}) => {
    const { user, updateWorkspacePhoneNumber, updateisDriver } = useAppContext()
    let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
    
    const [marque, setMarque] = useState("")
    const [openDropdownMarque, setopenDropdownMarque] = useState(false);
	
    const [modele, setModele] = useState("")
    const [openDropdownModele, setopenDropdownModele] = useState(false);
    
    const [couleur, setCouleur] = useState("")
    const [openDropdownCouleur, setopenDropdownCouleur] = useState(false);
    
    const [annee, setAnnee] = useState("")
    const [openDropdownAnnee, setopenDropdownAnnee] = useState(false);
    const [alreadySentData, setAlreadySentData] = useState(false)
    const [matricule, setMatricule] = useState("")
    const [phone, setPhone] = useState("")
	const [loading, setLoading] = useState(false)
    const [step, setStep] = useState("Start")
	const [otpValue, setOptValue] = useState("")
    const [dataLoaded, setDataLoaded] = useState(null);
    const scrollViewRef = useRef(null);
	const handleBackButton = ()=>{
        console.log(step);
        console.log("OK");
        if ( step === "Start" ){
            navigation.replace("/vtc")                
        } else if ( step === "Information Input" ){
            setStep("Start");
        } else if ( step === "Add Phone or Ignore" ){
            setStep("Information Input");
        } else if ( step === "Add Phone" ){
            setStep("Add Phone or Ignore")
        } else if ( step === "Check Phone" ){
            setStep("Add Phone")
        } else if ( step === "Done" ){
            navigation.replace("/vtc")
        }
        return true
    }
    const [resend, setResend] = useState(false)
    const [canResend, setCanResend] = useState(false)
	const [seconds, setSeconds] = useState(null);
    const [errorSend, setErrorSend] = useState(null);
    const [error, setError] = useState({
        "marque":false,
        "modele":false,
        "annee":false,
        "couleur":false,
        "matricule":false
    })
    const [loadingSendInfo, setLoadingSendInfo] = useState(false);
    const [errorPhone, setErrorPhone] = useState(null)
  	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			if (scrollViewRef.current) {
				scrollViewRef.current.scrollTo({ y:200, animated: true });
			}
		});
		return () => {
            keyboardDidShowListener.remove();
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
		};
	
	}, [step]);
    useEffect(()=>{
        if ( ! dataLoaded ){
            Api.get(Urls.GET_CAR_DATA).then((response)=>{
                if ( response.data.code_type === StatusCodes.Success ){
                    let data = {};
                    let temp = []
                    let temp2 = {"":[]};
                    response.data.car_brands.forEach(element => {
                        temp.push({label:element["brand_name"],value:element["brand_name"]})
                        let temp0 = []
                        element["brand_models"].forEach(elt=>{
                            temp0.push({label:elt,value:elt})
                        })
                        temp2[element["brand_name"]] = temp0
                    });
                    let temp3 = []
                    response.data.car_colors.forEach(elt=>{
                        temp3.push({label:elt,value:elt})
                    })
                    let temp4 = [];
                    response.data.car_years.forEach(elt=>{
                        temp4.push({label:elt,value:elt})
                    })
                    temp4 = temp4.reverse()
                    data["carBrands"] = temp;
                    data["carModels"] = temp2;
                    data["carColors"] = temp3;
                    data["carYears"] = temp4;
                    setDataLoaded(data)
                }
            }).catch(err=>{
                console.log(err);
            })
        }
    },[])
    let interval = useRef();
	const Countdown = () => {
		interval = setInterval(() => {
			if ( seconds <= 0 ){
				clearInterval(interval)
				setCanResend(true)
			}else{
				setSeconds(seconds-1)
			}
		}, 1000);
	}; 
    useEffect(() => {
		if ( step === "Check Phone" ){
			Countdown();
			return () => {
				clearInterval(interval);
			};
		}	 
	});
    const onPressDevenirChauffeur = () =>{
        setStep("Information Input")
    }
    const onPressSuivant = () =>{
        setErrorSend(null)
        let temp = {
            "marque":marque ==="",
            "modele":modele === "",
            "annee":annee === "",
            "couleur":couleur === "",
            "matricule":matricule === ""
        }
        if ( temp.annee || temp.couleur || temp.marque || temp.matricule || temp.modele ){
            setError(temp)
        }else{
            setLoadingSendInfo(true)
            let data = new FormData();
            data.append("car_brand",marque)
            data.append("car_model",modele)
            data.append("car_color",couleur)
            data.append("car_year",annee)
            data.append("car_registration_number",matricule)
            Api.post(alreadySentData?Urls.EDIT_DRIVER_INFO:Urls.ADD_DRIVER_INFO,data).then(response=>{
                setAlreadySentData(true)
                if ( response.data.code_type === StatusCodes.Success ){
                    setLoadingSendInfo(true)
                    setStep("Add Phone or Ignore")
                    setLoadingSendInfo(false)
                } else {
                    console.log(response.data);
                    setErrorSend(response.data.error)
                    console.log(response.data.error);
                    setLoadingSendInfo(false)
                }
            }).catch(err=>{
                setLoadingSendInfo(false)
                setErrorSend(err.message)
                console.log(err);
            })
        }
    }
    const onPressAddPhone = () =>{
        setStep("Add Phone");
    }
    const onPressIgnoreAdd = () =>{
        updateWorkspacePhoneNumber(user.user.phone)
        updateisDriver("processing")
        setStep("Done");
    }
    const handleSendCode = ()=>{
		if ( ! isSimilarPhone(phone,user.user.phone) ){
            setLoading(true)
            let data = new FormData()
            data.append('phone_number',phone);
            Api.post(Urls.DRIVER_PHONE_SEND_OTP,data).then((response)=>{
                if ( response.data.code_type === StatusCodes.Success ){
                    setSeconds(60)
                    setLoading(false)
                    setStep("Check Phone")
                }else{
                    setErrorPhone(response.data.error)
                    setLoading(false)
                }
            }).catch(err=>{
                setErrorPhone(err.message)
                setLoading(false)
            })
        } else {
            setErrorPhone("Veuillez entrer un numéro de téléphone differènt du personnel")
        }
	}
	const handleErrorPhone = ()=>{
		setLoading(false)
        setResend(false)
		setStep("Add Phone");
        setErrorPhone(null)
	}
	const handleRenvoyerCode = ()=>{
        if ( canResend ){
            let data = new FormData()
            data.append('phone_number',phone);
            Api.post(Urls.DRIVER_PHONE_SEND_OTP,data).then((response)=>{
                if ( response.data.code_type === StatusCodes.Success ){
                    setLoading(false)
                    setStep("Check Phone")
                    setResend(true)
                }else{
                    setErrorPhone(response.data.error)
                }
            }).catch(err=>{
                setErrorPhone(err.message)
            })
        }
	}
	const handleCheckCode = ()=>{
        setError(null)
        setLoading(true)
        let data = new FormData()
        data.append('phone_number',phone)
        data.append('otp_code',otpValue)
        Api.post(Urls.DRIVER_PHONE_CHECK_OTP,data).then(response=>{
            console.log(response.data);
            if ( response.data.code_type === StatusCodes.Success ){
                setLoading(false)
                handleDone()
            }else{
                setErrorPhone(response.data.error)
                setLoading(false)
            }
        })
	}
	const handleDone = ()=>{
        updateWorkspacePhoneNumber(phone)
		setLoading(false)
        updateisDriver("processing")
        setStep("Done")
    }
    const onPressDone = ()=>{
        console.log("KMLNA ANI NSTNA");
    }
    return (
        <View style={styles.container}>
			<StatusBar barStyle="default" backgroundColor={Config.lightBlue} />
            <View style={styles.mainTitleView} >
                <Text style={styles.mainTitleText}>Workspace</Text>
            </View>
            {
                step === "Start" && 
                <View style={styles.mainView}>
                    <Text style={styles.mainText1}>Vous n'êtes pas encore un chauffeur</Text>
                    <Text style={styles.secondaryText1}>A3toni texte ndiro hna. A3toni texte ndiro hna. A3toni texte ndiro hna. A3toni texte ndiro hna.</Text>
                    <View style={styles.buttonView}>
                        <CustomButton
                            fill={Config.lightBlue}
                            text="Devenir chauffeur"
                            fontSize={15}
                            onPress={onPressDevenirChauffeur}
                            textColor="#FFF"
                        />
                    </View>
                </View>
            }
            {
                step === "Information Input" && 
                <KeyboardAvoidingView style={{flex:1, backgroundColor:"#FFF"}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                    <ScrollView ref={scrollViewRef} contentContainerStyle={{...styles.mainView1,flex:!dataLoaded?1:( (openDropdownAnnee||openDropdownCouleur||openDropdownMarque||openDropdownModele)? 1:null )}}>
                        <View style={{width:"100%", height:50, display:"flex", justifyContent:"center"}}>
                            <Icon name="chevron-left" style={{position:"absolute", marginLeft:"5%",padding:5}} size={18} onPress={handleBackButton}/>
                            <Text style={styles.devenirChauffeurTitle}>Devenir chauffeur</Text>
                        </View>
                        {
                            dataLoaded?
                            <>
                                <View style={styles.profilePreview}>
                                    <Image source={{uri:user.user.profilePicture}} style={styles.image} resizeMode='center' />
                                    <View style={styles.namesView}>
                                        <Text numberOfLines={1} style={styles.fullnameText}>{user.user.fullName}</Text>
                                        <Text numberOfLines={1} style={styles.usernameText}>{"@"+user.user.userName}</Text>
                                    </View>
                                </View>
                                <View style={styles.inputsView}>
                                    <DropDownPicker
                                        open={openDropdownMarque}
                                        setOpen={setopenDropdownMarque}
                                        placeholder="Marque"
                                        value={marque}
                                        setValue={setMarque}
                                        items={dataLoaded.carBrands}
                                        onChangeValue={()=>{setError({...error, "marque":false});setErrorSend(null)}}
                                        scrollViewProps={{decelerationRate:"fast"}}
                                        listMode="SCROLLVIEW"
                                        style={{borderColor:Config.darkGrey, borderRadius:5,backgroundColor:error.marque?"#B100237F":"#FFF"}}
                                    />
                                    {
                                        !openDropdownMarque &&
                                        <DropDownPicker
                                            open={openDropdownModele}
                                            setOpen={setopenDropdownModele}
                                            placeholder="Modele"
                                            value={modele}
                                            setValue={setModele}
                                            items={dataLoaded.carModels[marque]}
                                            onChangeValue={()=>{setError({...error, "modele":false});setErrorSend(null)}}
                                            scrollViewProps={{decelerationRate:"fast"}}
                                            listMode="SCROLLVIEW"
                                            style={{borderColor:Config.darkGrey, borderRadius:5,backgroundColor:error.modele?"#B100237F":"#FFF"}}
                                        />
                                    }
                                    {
                                        (! openDropdownMarque && ! openDropdownModele) &&
                                        <DropDownPicker
                                            open={openDropdownCouleur}
                                            setOpen={setopenDropdownCouleur}
                                            placeholder="Couleur"
                                            value={couleur}
                                            setValue={setCouleur}
                                            items={dataLoaded.carColors}
                                            onChangeValue={()=>{setError({...error, "couleur":false});setErrorSend(null)}}
                                            scrollViewProps={{decelerationRate:"fast"}}
                                            listMode="SCROLLVIEW"
                                            style={{borderColor:Config.darkGrey, borderRadius:5,backgroundColor:error.couleur?"#B100237F":"#FFF"}}
                                        />
                                    }
                                    {
                                        (! openDropdownMarque && ! openDropdownModele && !openDropdownCouleur) && 
                                        <DropDownPicker
                                            open={openDropdownAnnee}
                                            setOpen={setopenDropdownAnnee}
                                            placeholder="Annee"
                                            value={annee}
                                            setValue={setAnnee}
                                            items={dataLoaded.carYears}
                                            onChangeValue={()=>{setError({...error, "annee":false});setErrorSend(null)}}
                                            scrollViewProps={{decelerationRate:"fast"}}
                                            listMode="SCROLLVIEW"
                                            style={{borderColor:Config.darkGrey, borderRadius:5,backgroundColor:error.annee?"#B100237F":"#FFF"}}
                                        />
                                    }
                                    {
                                        (! openDropdownMarque && ! openDropdownModele && !openDropdownCouleur) && 
                                        <CustomTextInput
                                            label={"Matricule"}
                                            value={matricule}
                                            setValue={setMatricule}
                                            number={true}
                                            onchange={ ()=>{setError({...error, "matricule":false});setErrorSend(null)} }
                                            error={error.matricule}    
                                        />
                                    }
                                </View>
                                {
                                    errorSend && <Text style={{color:Config.redError, fontSize:20, textAlign:"center"}}>{errorSend}</Text>
                                }
                                {
                                    ! (openDropdownAnnee || openDropdownCouleur || openDropdownMarque || openDropdownModele ) &&
                                    <View style={styles.nextButtonView}>
                                        {
                                            loadingSendInfo?
                                            <View style={{width:"100%", height:50, borderRadius:10, backgroundColor:Config.lightBlue, display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                <ActivityIndicator color="#FFF" />
                                            </View>
                                            :
                                            <CustomButton
                                                fill={Config.lightBlue}
                                                fontSize={15}
                                                onPress={onPressSuivant}
                                                text="Suivant"
                                                textColor="#FFF"
                                            />
                                        }
                                    </View>
                                }
                            </>
                            :
                            <View style={{width:"100%", justifyContent:"center", display:"flex",flex:1,alignItems:"center"}}>
                                <ActivityIndicator color={Config.lightBlue} size={35} />
                            </View>
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
            }
            {
                step === "Add Phone or Ignore" &&
                <View style={styles.mainView2}>
                    <View style={{width:"100%", height:50, display:"flex", justifyContent:"center"}}>
                        <Icon name="chevron-left" style={{position:"absolute", marginLeft:"5%",padding:5}} size={18} onPress={handleBackButton}/>
                        <Text style={styles.devenirChauffeurTitle}>Devenir chauffeur</Text>
                    </View>
                    <View style={styles.profilePreview}>
                        <Image source={{uri:user.user.profilePicture}} style={styles.image} resizeMode='center' />
                        <View style={styles.namesView}>
                            <Text numberOfLines={1} style={styles.fullnameText}>{user.user.fullName}</Text>
                            <Text numberOfLines={1} style={styles.usernameText}>{"@"+user.user.userName}</Text>
                        </View>
                    </View>
                    <View style={styles.addPhoneView}>
                        <View style={styles.imageAndTitleView}>
                            <View style={styles.phone}>
                                <Icon style={{alignSelf:"center",}} name="phone" size={80} color="#FFF" />
                            </View>
                            <Text style={styles.ajouterPhoneText}>Ajouter un numéro de téléphone professionnel</Text>
                        </View>
                        <View style={styles.addPhoneButtonsView}>
                            <CustomButton
                                fill={Config.lightBlue}
                                fontSize={15}
                                onPress={onPressAddPhone}
                                text="Ajouter"
                                textColor="#FFF"
                            />
                            <CustomButton
                                textColor={Config.lightBlue}
                                fontSize={15}
                                onPress={onPressIgnoreAdd}
                                text="Ignorer"
                                fill="#FFF"
                            />
                        </View>    
                    </View>
                </View>
            }
            {
                step === "Done" &&
                <View style={styles.mainView5}>
                    <Text style={styles.progressing}>Votre demande a été envoyée</Text>
                    <View style={{width:"80%", alignSelf:"center"}}>
                        <CustomButton
                            fill={Config.lightBlue}
                            fontSize={15}
                            onPress={onPressDone}
                            text="Terminé !"
                            textColor="#FFF"
                        />
                    </View>
                </View>
            }
            {
                ( step === "Add Phone" || step === "Check Phone") &&
                <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                    <ScrollView ref={scrollViewRef} style={{backgroundColor:"#FFF"}} contentContainerStyle={styles.scrollView}>
                        <View style={{width:"100%", height:50, display:"flex", justifyContent:"center"}}>
                            <Icon name="chevron-left" style={{position:"absolute", marginLeft:"5%",padding:5}} size={18} onPress={handleBackButton}/>
                            <Text style={styles.devenirChauffeurTitle}>Devenir chauffeur</Text>
                        </View>
                        <View style={styles.profilePreview}>
                            <Image source={{uri:user.user.profilePicture}} style={styles.image} resizeMode='center' />
                            <View style={styles.namesView}>
                                <Text numberOfLines={1} style={styles.fullnameText}>{user.user.fullName}</Text>
                                <Text numberOfLines={1} style={styles.usernameText}>{"@"+user.user.userName}</Text>
                            </View>
                        </View>
                        <View style={styles.otpView}>
                            <View style={styles.texts}>
                                <Text style={styles.mainText}>
                                    Vérification OTP
                                </Text>
                                <Text style={styles.secondaryText}>
                                    {
                                        step === "Add Phone" &&
                                        "Nous vous enverrons un mot de passe à usage unique sur votre numéro de mobile"
                                    }
                                    {
                                        step === "Check Phone" &&
                                        `Entrez le code envoyé au ${phone}`
                                    }
                                </Text>
                                {
                                    step === "Check Phone" &&
                                    <Text style={{...styles.secondaryText, color:Config.lightBlue, textDecorationLine:"underline"}} onPress={handleErrorPhone}>
                                        ce n'est pas mon numéro ?
                                    </Text>
                                }
                            </View>
                            <View style={styles.inputView}>
                                {
                                    step === "Add Phone" &&
                                    <CustomTextInput
                                        onchange={()=>{setErrorPhone(null)}}
                                        error={errorPhone!=null}
                                        label="Numéro de téléphone"
                                        number={true}
                                        value={phone}
                                        setValue={setPhone}
                                    />
                                }
                                {
                                    step === "Check Phone" &&
                                    <CustomTextInput
                                        error={errorPhone!=null}
                                        center={true}
                                        disabled={step === 3 || step === 2}
                                        label="Code OTP"
                                        onchange={()=>{setErrorPhone(null)}}
                                        number={true}
                                        value={otpValue}
                                        setValue={setOptValue}
                                    />
                                }
                                {
                                    errorPhone && 
                                    <Text style={{
                                        ...styles.secondaryText,
                                        color:"red"
                                    }}>{errorPhone}</Text>
                                }
                                {
                                    step === "Check Phone" & !resend?
                                    <Text style={{...styles.secondaryText, margin:0}}>Vous n'avez pas reçu l'OTP? <Text  style={{color:canResend?Config.lightBlue:Config.darkGrey}} onPress={handleRenvoyerCode}>Renvoyer</Text></Text>                                    :
                                    step === "Check Phone"?
                                    <Text style={styles.secondaryText}>Code renvoyé</Text>
                                    :
                                    null
                                }
                                {
                                    step === "Check Phone" && ! canResend?
                                    <Text style={{...styles.secondaryText, margin:0}}>00:{String(seconds).length === 1? "0":null}{seconds}</Text>
                                    :
                                    null
                                }
                                {
                                    loading?
                                    <ActivityIndicator size={30} style={{backgroundColor:Config.lightBlue, height:50, borderRadius:10}} color="#FFF" />
                                    :
                                    <CustomButton
                                        fill={Config.lightBlue}
                                        fontSize={15}
                                        text={step==="Add Phone"?"Envoyer le code":step === "Check Phone"?"Vérifier":"C'est Verifié"}
                                        textColor="#FFF"
                                        onPress={step === "Add Phone"?handleSendCode : step === "Check Phone"? handleCheckCode : handleDone}
                                    />
                                }
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            }
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
        backgroundColor:"#FFF",
        width:"100%",
        display:"flex",
        flexDirection:"column",
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
    buttonView:{
        height:"40%",
        width:"90%",
        alignSelf:"center",
    },
    mainText1:{
        height:"30%",
        width:"80%",
        alignSelf:"center",
        textAlign:"center",
        fontSize:30,
        textAlignVertical:"bottom",
        paddingBottom:30,
    },
    secondaryText1:{
        width:"80%",
        alignSelf:"center",
        textAlign:"center",
        fontSize:20,
        textAlignVertical:"top",
        height:"30%",
        paddingTop:20,
        textAlign:"center",
    },
    mainView1:{
        backgroundColor:"#FFF",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        gap:20
    },
    devenirChauffeurTitle:{
        width:"80%",
        alignSelf:"center",
        textAlign:"center",
        fontSize:22,
        fontWeight:"600",
    },
    profilePreview:{
        height:70,
        width:"80%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
    },
    image:{
        borderRadius:50,
        height:50,
        width:50,
    },
    namesView:{
        height:"100%",
        flex:3,
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:5,
        marginLeft:10,
    },
    usernameText:{
        fontSize:15,
        color:Config.darkGrey
    },
    fullnameText:{
        fontSize:18,
        fontWeight:"600",
        color:"#000",
    },
    inputsView:{
        width:"80%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:10
    },
    nextButtonView:{
        width:"80%",
        alignSelf:"center",
        paddingBottom:10
    },
    mainView2:{
        height:"78%",
        backgroundColor:"#FFF",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        gap:20
    },
    mainView3:{
        height:"78%",
        backgroundColor:"#FFF",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        gap:20
    },
    addPhoneView:{
        flex:1,
        width:"80%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
    },
    imageAndTitleView:{
        width:"100%",
        height:"50%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"flex-end",
        gap:30,
    },
    phone:{
        height:100,
        width:100,
        alignSelf:"center",
        backgroundColor:Config.lightBlue,
        borderRadius:20,
        display:"flex",
        justifyContent:"center",
    },
    ajouterPhoneText:{
        width:"100%",
        textAlign:"center",
        fontSize:18,
        fontWeight:"600"
    },
    addPhoneButtonsView:{
        paddingTop:25,
        display:"flex",
        flexDirection:"column",
    },
    progressing:{
        height:"78%",
        width:"80%",
        alignSelf:"center",
        textAlign:"center",
        textAlignVertical:"center",
        lineHeight:45,
        fontSize:25,
        fontWeight:"700",
        backgroundColor:"#FFF",
    },
    profilePreviewDone:{
        height:"35%",
        width:"80%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"row"
    },
    otpView:{
        width:"80%",
        flex:1,
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
    },
    textsView:{
        height:"40%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:10
    },
    titleText:{
        width:"100%",
        textAlign:"center",
        fontSize:22
    },
    secondText:{
        width:"100%",
        textAlign:"center",
        fontSize:16
    },
    inputAndButtonView:{
        flex:1,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
    },
    mainView4:{
        height:"78%",
        backgroundColor:"#FFF",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        gap:20
    },
    mainView5:{
        height:"78%",
        backgroundColor:"#FFF",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        gap:20
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
    inputsView:{
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:15,
        marginTop:"10%"
    },
    inputView: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		gap: 30,
		paddingBottom:30,
	},
    scrollView: {
        backgroundColor:"#FFF",
        alignSelf: "flex-end",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 30,
	},
})