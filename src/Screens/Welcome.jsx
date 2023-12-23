import { useEffect, useState, useRef } from "react";
import { SafeAreaView, StyleSheet, View, Dimensions, ScrollView, Platform, Image, Text, KeyboardAvoidingView, StatusBar, Keyboard, ActivityIndicator } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useAppContext } from '../context'
import CustomTextInput from "../Components/CustomTextInput";
import CustomButton from "../Components/CustomButton";
import Config from "../../Config.json";
import Api from "../api/Api";
import Urls from "../api/Urls";
import isValidEmail from '../functions/isValidEmail'
import isValidOtp from '../functions/isValidOtp'
import StatusCodes from '../api/StatusCodes'

export default Otp = ({navigation}) => {
    
	
	
	let [fontsLoaded] = useFonts({Poppins_400Regular,  Poppins_700Bold})
	
	const { updateAll, updateEmailAccoutIdProfilePic } = useAppContext()
	const scrollViewRef = useRef(null);
	
	const [seconds, setSeconds] = useState(null);
	const [email, setEmail] = useState("");
	const [step, setStep] = useState(0);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorOtp, setErrorOtp] = useState(null);
    const [otpValue, setOptValue] = useState("");
	const [canResend, setCanResend] = useState(false)
    const [resend, setResend] = useState(false);
    
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


	const handleSendCode = async ()=>{
		setStep(5)
		if ( isValidEmail(email) ){
			setErrorEmail(null)
			let data = new FormData()
			data.append('email',email);
			await Api.post(`${Urls.SEND_OTP_EMAIL}`,data)
			.then(response=>{
				if ( StatusCodes.Success === response.data.code_type ){
					setSeconds(60)
					setStep(1);
				}else{
					setErrorEmail(response.data.error);
					setStep(0)
				}
			}).catch(err=>{
				console.log(err);
				setStep(0);
				setErrorEmail("Erreur d'acces au serveur! veuillez reessayer plus tard")
			})
		}else{
			setStep(0)
			setErrorEmail("Veuillez verifier l'adresse e-mail saisie")
		}
	}
	const handleRenvoyerCode = async ()=>{
		if ( canResend ){
			let data = new FormData()
			data.append('email',email);
			await Api.post(`${Urls.SEND_OTP_EMAIL}`,data)
			.then(response=>{
				setResend(true)
			}).catch(err=>{
				console.log(err);
				setStep(0);
				setErrorEmail("Erreur d'acces au serveur! veuillez reessayer plus tard")
			})
		}
	}
	const handleErrorEmail = ()=>{
		setCanResend(false)
		setResend(false)
		setErrorEmail(null)
		setStep(0);
	}
	const handleCheckCode = async () =>{
		if ( isValidOtp(otpValue) ){
			setStep(2);
			setErrorOtp(null)
			let data = new FormData();
			data.append('email',email)
			data.append('otp_code',otpValue)
			await Api.post(`${Urls.CHECK_OTP_EMAIL}`,data)
				.then(response=>{
					if ( response.data.code_type === StatusCodes.Success ){
						setStep(3)
						console.log(response.data);
						if ( response.data.account_is_configured ){
							// is authenticated : set context
							Api.get(`${Urls.ACCOUNT_GET_ICON}/${response.data.account_id}?data_type=base64`).then((response2)=>{
								let isDriver;
								if ( response.data.account_is_driver ){
									if ( response.data.account_is_driver_active ){
										isDriver = "true"
									}else{
										isDriver = "processing"
									}
								}else{
									isDriver = "false"
								}
								updateAll(
									true,
									response.data.account_id,
									response.data.account_full_name,
									response.data.account_account_name,
									response.data.account_sex,
									response.data.account_birth_date,
									response.data.account_rate,
									response.data.account_phone_number,
									response.data.account_email,
									isDriver,
									response.data.account_last_rides_history,
									response.data.driver_last_rides_history,
									response.data.driver_car_brand,
									response.data.driver_car_model,
									response.data.driver_car_color,
									response.data.driver_car_year,
									response.data.driver_car_registration_number,
									response.data.driver_phone_number,
									response2.data.base64_data,
									response.data.driver_next_payment_date,
									response.data.driver_next_payment_price,
									response.data.driver_last_payments,
									response.data.driver_rate,
									response.data.account_is_default_icon
								)
							})
							if ( response.data.account_phone_number_is_confirmed ){
								navigation.replace('/vtc')
							}else{
								navigation.replace('/phoneotp')
							}
						}else{
							Api.get(`${Urls.ACCOUNT_GET_ICON}/${response.data.account_id}?data_type=base64`).then((response2)=>{
								updateEmailAccoutIdProfilePic(response.data.account_email, response.data.account_id,response2.data.base64_data)
								navigation.replace('/signup')
							})
						}
					}else{
						setStep(1);
						setErrorOtp(response.data.error);
					}
				}).catch(err=>{
					console.log(err);
					setStep(1);
					setErrorOtp("Erreur d'acces au serveur! veuillez reessayer plus tard")
				})
		}else{
			setErrorOtp("Veuillez verifier le code saisi")
		}
	}
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			if (scrollViewRef.current) {
				scrollViewRef.current.scrollTo({ y:200, animated: true });
			}
		});
		return () => {
		keyboardDidShowListener.remove();
		};
	
	}, [errorOtp, errorEmail, step]);
	useEffect(() => {
		if ( step === 1 ){
			Countdown();
			return () => {
				clearInterval(interval);
			};
		}	 
	});
	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#fff" />
			<View style={styles.firstHalf}>
				<Image
					style={styles.logo}
					source={require("../../assets/icon.png")}
					resizeMode="contain"
				/>
				<Text style={styles.firstText}>Bienvenue à AppliVTC</Text>
			</View>
			<KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
				<ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollView}>
					<View style={styles.texts}>
						<Text style={styles.mainText}>
							Applivtc, une super-app pour satisfaire tous vos besoins
						</Text>
						<Text style={styles.secondaryText}>
							{
								step === 0 || step === 5?
								"Nous vous enverrons un mot de passe à usage unique sur votre e-mail"
								:
								`Entrez le code envoyé à ${email}`
							}
						</Text>
						{
							step === 1?
							<Text style={{...styles.secondaryText, color:Config.lightBlue, textDecorationLine:"underline"}} onPress={handleErrorEmail}>
								ce n'est pas mon e-mail ?
							</Text>
							:
							null
						}
					</View>
					<View style={styles.inputView}>
						{
							step === 0 || step === 5 ?
							<CustomTextInput
								error={errorEmail}
								label="Adresse email"
								value={email}
								setValue={setEmail}
								onchange={()=>{setErrorEmail(false)}}
							/>
							:
							<CustomTextInput
								error={errorOtp}
								center={true}
								disabled={step === 3 || step === 2}
								label="Code OTP"
								number={true}
								value={otpValue}
								setValue={setOptValue}
								onchange={()=>{setErrorOtp(null)}}
							/>
						}
						{
							errorEmail?
							<Text style={{
								...styles.secondaryText,
								color:"red"
							}}>{errorEmail}</Text>
							:
							null
						}
						{
							errorOtp?
							<Text style={{
								...styles.secondaryText,
								color:"red"
							}}>{errorOtp}</Text>
							:
							null
						}
						{
							step === 1 & !resend?
							<View style={{display:"flex", flexDirection:"column", gap:10}}>
								<Text style={{...styles.secondaryText, margin:0}}>Vous n'avez pas reçu l'OTP? <Text  style={{color:canResend?Config.lightBlue:Config.darkGrey}} onPress={handleRenvoyerCode}>Renvoyer</Text></Text>
								{
									canResend?
									null
									:
									<Text style={{...styles.secondaryText, margin:0}}>00:{String(seconds).length === 1? "0":null}{seconds}</Text>
								}
							</View>
							:
							step === 1?
							<Text style={styles.secondaryText}>Code renvoyé</Text>
							:
							null
						}
						{
							step === 2 || step === 5?
							<View style={{width:"100%", backgroundColor:Config.lightBlue, borderRadius:10, height:50, display:"flex", justifyContent:"center", alignItems:"center"}}><ActivityIndicator size="large" color="#FFF" /></View>
							:
							<CustomButton
								disabled={step === 3}
								fill={Config.lightBlue}
								fontSize={15}
								text={step===0?"Envoyer le code":step === 1?"Vérifier":"C'est Verifié"}
								textColor="#FFF"
								onPress={step === 0?handleSendCode : step === 1? handleCheckCode:()=>{}}
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
		height: "30%",
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
	firstText:{
        flexDirection:"column",
		textAlign: "center",
		color: Config.lightBlue,
		fontSize: 45,
		width: "90%",
		alignSelf:"center",
		fontWeight: "500",
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