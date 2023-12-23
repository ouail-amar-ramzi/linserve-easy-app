import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Dimensions, ScrollView, Platform, Image, Text, KeyboardAvoidingView, StatusBar, Keyboard, ActivityIndicator } from "react-native";
import CustomTextInput from "../Components/CustomTextInput";
import CustomButton from "../Components/CustomButton";
import Config from "../../Config.json";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import Api from "../api/Api";
import Urls from "../api/Urls";
import StatusCodes from "../api/StatusCodes";
import { useAppContext } from "../context";
import isValidPhone from "../functions/isValidPhone"

export default Otp = ({navigation}) => {
    let [fontsLoaded] = useFonts({Poppins_400Regular,  Poppins_700Bold})

	const { user, updatePersonalPhoneNumber } = useAppContext()
	const scrollViewRef = useRef(null);
	
  	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			if (scrollViewRef.current) {
				scrollViewRef.current.scrollTo({ y:200, animated: true });
			}
		});
		return () => {
		keyboardDidShowListener.remove();
		};
	
	}, []);

	const [phone, setPhone] = useState("");
	const [step, setStep] = useState(0);
    const [errorPhone, setErrorPhone] = useState(null);
    const [errorOtp, setErrorOtp] = useState(null);
    const [otpValue, setOptValue] = useState("");
    const [resend, setResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canResend, setCanResend] = useState(false)
	const [seconds, setSeconds] = useState(null);

	const handleSendCode = ()=>{
		if ( isValidPhone(phone) ){
			setLoading(true)
			let data = new FormData()
			data.append('phone_number',phone);
			Api.post(Urls.SEND_OTP_PHONE,data).then((response)=>{
				if ( response.data.code_type === StatusCodes.Success ){
					setSeconds(60)
					setLoading(false)
					setStep(1)
			}else{
				setErrorPhone(response.data.error)
				setLoading(false)
			}
			}).catch(err=>{
				setErrorPhone(err.message)
				setLoading(false)
			})
		} else {
            setErrorPhone("Veuillez entrer un numéro de téléphone differènt que celui déjè enregistré")
		}
	}
	const handleErrorPhone = ()=>{
		setResend(false)
		setStep(0);
	}
	const handleRenvoyerCode = ()=>{
		setResend(true)
        if ( canResend ){
            let data = new FormData()
            data.append('phone_number',phone);
            Api.post(Urls.SEND_OTP_PHONE,data).then((response)=>{
                if ( response.data.code_type === StatusCodes.Success ){
                    setLoading(false)
                    setStep(1)
                }else{
                    setErrorOtp(response.data.error)
                }
            }).catch(err=>{
                setErrorOtp(err.message)
            })
        }
	}
	const handleCheckCode = ()=>{
        setErrorOtp(null)
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
                setErrorOtp(response.data.error)
                setLoading(false)
            }
        })
	}
	const handleDone = ()=>{
        updatePersonalPhoneNumber(phone)
        setLoading(false)
        setStep(0)
		navigation.replace("/addprofilepic")
	}
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
		if ( step === 1 ){
			Countdown();
			return () => {
				clearInterval(interval);
			};
		}	 
	});

	useEffect(()=>{
		
    },[errorOtp,errorPhone])
	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#fff" />
			<View style={styles.firstHalf}>
				<Image
					style={styles.logo}
					source={require("../../assets/icon.png")}
					resizeMode="contain"
				/>
				<Image
					style={styles.otp}
					source={require("../../assets/OTP.png")}
					resizeMode="contain"
				/>
			</View>
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
							step === 0 &&
							<CustomTextInput
								error={errorPhone}
								label="Numéro de téléphone"
								number={true}
								value={phone}
								setValue={setPhone}
							/>
						}
						{
							step === 1 &&
							<CustomTextInput
								error={errorPhone}
								center={true}
								disabled={step === 3 || step === 2}
								label="Code OTP"
								number={true}
								value={otpValue}
								setValue={setOptValue}
							/>
						}
						{
							errorPhone &&
							<Text style={{
								...styles.secondaryText,
								color:Config.redError
							}}>{errorPhone}</Text>
						}						
						{
							errorOtp &&
							<Text style={{
								...styles.secondaryText,
								color:Config.redError
							}}>{errorOtp}</Text>
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
							loading?
							<View style={{width:"100%", backgroundColor:Config.lightBlue, borderRadius:10, height:50, display:"flex", justifyContent:"center", alignItems:"center"}} onTouchEnd={()=>setStep(3)}><ActivityIndicator size="large" color="#FFF" /></View>
							:
							<CustomButton
								disabled={step === 2}
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
	firstHalf: {
		width: "100%",
		height: "40%",
		display: "flex",
		flexDirection: "column",
		gap: 30,
		justifyContent: "flex-end",
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
	logo: {
		alignSelf: "center",
		width: "12%",
		backgroundColor: "#fff",
	},
	otp: {
		height: "50%",
		alignSelf: "center",
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
});
