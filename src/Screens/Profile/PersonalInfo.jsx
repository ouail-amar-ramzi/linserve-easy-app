import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Text, StatusBar, Image, KeyboardAvoidingView, ScrollView, SafeAreaView, Keyboard, ActivityIndicator, BackHandler, Platform } from "react-native";
import { IconButton } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import Icon from 'react-native-vector-icons/FontAwesome';
import Config from "../../../Config.json"
import CustomButton from "../../Components/CustomButton";
import CustomTextInput from "../../Components/CustomTextInput";
import NavBar from "../../Components/NavBar";
import { useAppContext } from "../../context";
import Api from "../../api/Api";
import Urls from "../../api/Urls";
import StatusCodes from "../../api/StatusCodes";
import isSimilarPhone from "../../functions/isSimilarPhone"

export default PersonalInfo = ({navigation}) => {
	const { user, updateisPersonalInfo, updatePersonalPhoneNumber } = useAppContext();
    let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
	
    const [name, setName] = useState(user.user.fullName)
    const [username, setUserName] = useState(user.user.userName)
    const [phone, setPhone] = useState("")
    
    const [edit, setEdit] = useState(false)
    const [editPhone, setEditPhone] = useState(false)
    const scrollViewRef = useRef(null);
    const [step, setStep] = useState(0);
    const [error, setError] = useState(null)
    // const [error, setError] = useState("Veuillez entrer un numéro de téléphone differènt que celui déjè enregistré")
    const [otpValue, setOptValue] = useState("");
    const [resend, setResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canResend, setCanResend] = useState(false)
	const [seconds, setSeconds] = useState(null);

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
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    
    }, [error, edit, step, editPhone]);
    
    useEffect(() => {
		if ( step === 1 ){
			Countdown();
			return () => {
				clearInterval(interval);
			};
		}	 
	});
    const handleSendCode = ()=>{
		if ( ! isSimilarPhone(phone,user.user.phone) ){
            setLoading(true)
            let data = new FormData()
            data.append('phone_number',phone);
            Api.post(Urls.SEND_OTP_PHONE,data).then((response)=>{
                if ( response.data.code_type === StatusCodes.Success ){
                    setSeconds(60)
                    setLoading(false)
                    setStep(1)
                }else{
                    setError(response.data.error)
                    setLoading(false)
                }
            }).catch(err=>{
                setError(err.message)
                setLoading(false)
            })
        } else {
            setError("Veuillez entrer un numéro de téléphone differènt que celui déjè enregistré")
        }
	}
	const handleErrorPhone = ()=>{
		setLoading(false)
        setResend(false)
		setStep(0);
        setError(null)
	}
	const handleRenvoyerCode = ()=>{
        if ( canResend ){
            
            let data = new FormData()
            data.append('phone_number',phone);
            Api.post(Urls.SEND_OTP_PHONE,data).then((response)=>{
                if ( response.data.code_type === StatusCodes.Success ){
                    setLoading(false)
                    setStep(1)
                    setResend(true)
                }else{
                    setError(response.data.error)
                }
            }).catch(err=>{
                setError(err.message)
            })
        }
	}
	const handleCheckCode = ()=>{
        setError(null)
        setLoading(true)
        let data = new FormData()
        data.append('phone_number',phone)
        data.append('otp_code',otpValue)
        Api.post(Urls.CHECK_OTP_PHONE,data).then(response=>{
            console.log(response.data);
            if ( response.data.code_type === StatusCodes.Success ){
                setStep(2)
                setLoading(false)
                handleDone()
            }else{
                setError(response.data.error)
                setLoading(false)
            }
        })
	}
	const handleDone = ()=>{
        updatePersonalPhoneNumber(phone)
		setEditPhone(false)
        setLoading(false)
    }
    
    const onPressSave = () =>{
        if ( name != user.user.fullName || username != user.user.userName ){
            setLoading(true)
            let data = new FormData();
            data.append('full_name',name);
            data.append('account_name',username);
            data.append('sex',user.user.sexe);
            data.append('birth_date',user.user.birthday);
            Api.post(Urls.ACCOUNT_SET_DATA,data).then(response=>{
                if ( response.data.code_type === StatusCodes.Success ){
                    updateisPersonalInfo(name, username, user.user.sexe, user.user.birthday)
                    setLoading(false)
                    setEdit(false)   
                }else{
                    setError(response.data.error)
                    setLoading(false)
                }
            }).catch(err=>{
                console.log(err);
                setError(err.message)
                setLoading(false)
            })
        }else{
            setEdit(false)
        }
    }
    const onPressEdit = () =>{
        setEdit(true)
    }
    const onPressEditPhone = () =>{
        setEditPhone(true)
    }
    return (
        <SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <View style={styles.bigView}>
                <View style={styles.retourView}>
                    <Text style={styles.personalDataText}>{editPhone?"Numéro de téléphone":"Données personnelles"}</Text>
                    <Icon style={styles.icon} name="chevron-left"size={17} onPress={handleBackButton} />
                </View>
                {
                    edit?
                    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
                        <ScrollView contentContainerStyle={styles.editView}>
                            <View style={styles.inputsView}>
                                <CustomTextInput
                                    label={"Nom d'utilisateur"}
                                    value={username}
                                    setValue={setUserName}
                                />
                                <CustomTextInput
                                    label={"Nom complet"}
                                    value={name}
                                    setValue={setName}
                                />
                            </View>
                            <View style={styles.buttonView}>
                                {
                                    error &&
                                    <Text style={{width:"100%",color:Config.redError, textAlign:"center", fontSize:18}}>{error}</Text>
                                }
                                {
                                    loading?
                                    <ActivityIndicator size={30} style={{backgroundColor:Config.lightBlue, height:50, borderRadius:10}} color="#FFF" />
                                    :
                                    <CustomButton
                                        fontSize={16}
                                        textColor="#FFF"
                                        text="Sauvegarder"
                                        fill={Config.lightBlue}
                                        onPress={onPressSave}
                                    />
                                }
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    : editPhone?
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
                                        onchange={()=>{setError(null)}}
                                        error={error!=null}
                                        label="Numéro de téléphone"
                                        number={true}
                                        value={phone}
                                        setValue={setPhone}
                                    />
                                    :
                                    <CustomTextInput
                                        error={error!=null}
                                        center={true}
                                        disabled={step === 3 || step === 2}
                                        label="Code OTP"
                                        onchange={()=>{setError(null)}}
                                        number={true}
                                        value={otpValue}
                                        setValue={setOptValue}
                                    />
                                }
                                {
                                    error && 
                                    <Text style={{
                                        ...styles.secondaryText,
                                        color:"red"
                                    }}>{error}</Text>
                                }
                                {
                                    step === 1 & !resend?
                                    <Text style={{...styles.secondaryText, margin:0}}>Vous n'avez pas reçu l'OTP? <Text  style={{color:canResend?Config.lightBlue:Config.darkGrey}} onPress={handleRenvoyerCode}>Renvoyer</Text></Text>                                    :
                                    step === 1?
                                    <Text style={styles.secondaryText}>Code renvoyé</Text>
                                    :
                                    null
                                }
                                {
									step === 1 && ! canResend?
									<Text style={{...styles.secondaryText, margin:0}}>00:{String(seconds).length === 1? "0":null}{seconds}</Text>
									:
									null
								}
                                {
                                    step === 2?
                                    <View style={{width:"100%", backgroundColor:Config.lightBlue, borderRadius:10, height:50, display:"flex", justifyContent:"center", alignItems:"center"}} onTouchEnd={()=>setStep(3)}><ActivityIndicator size="large" color="#FFF" /></View>
                                    :
                                    loading?
                                    <ActivityIndicator size={30} style={{backgroundColor:Config.lightBlue, height:50, borderRadius:10}} color="#FFF" />
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
                    :// Info View
                    <View style={styles.infoView}>
                        <View style={styles.barre}>
                            <Image source={{uri:user.user.profilePicture}} style={styles.image} resizeMode="center" />
                            <View style={styles.nameView}>
                                <Text>{user.user.fullName}</Text>
                                <Text>{"@"+user.user.userName}</Text>
                            </View>
                            <View style={styles.Rating}>
                                <Text style={styles.ratingText}>{user.user.rating}</Text>
                                <Icon name="star" color="#FFE70F" size={25} />
                            </View>
                        </View>
                        <View style={styles.infosContainer}>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>E-mail</Text>
                                <Text style={styles.infoText}>{user.user.email}</Text>
                            </View>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Numéro de téléphone</Text>
                                <Text style={styles.infoText}>{user.user.phone}</Text>
                            </View>
                            <View style={{backgroundColor:Config.lightGrey, height:5, width:"100%"}}></View>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Date de naissance</Text>
                                <Text style={styles.infoText}>{user.user.birthday}</Text>
                            </View>
                            <View style={styles.oneInfoContainer}>
                                <Text style={styles.titleText}>Sexe</Text>
                                <Text style={styles.infoText}>{user.user.sexe}</Text>
                            </View>
                        </View>
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
                    </View>
                }
            </View>
            <View style={styles.navBarView}>
                <NavBar focus={"3"} navigation={navigation} />
            </View>
        </SafeAreaView>
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
        display:"flex",
        flexDirection:"column",
        gap:10,
        width:'80%',
        alignSelf:"center",
        marginBottom:"10%"
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
        borderRadius:100,
        aspectRatio:1
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
        flex:1,
        justifyContent:"flex-end",
        display:"flex",
        flexDirection:"column",
        gap:10,
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
})