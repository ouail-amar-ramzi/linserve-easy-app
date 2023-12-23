import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView, Dimensions, StatusBar, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator } from "react-native";
import CustomTextInput from "../Components/CustomTextInput";
import { useState, useRef, useEffect} from "react";
import Config from "../../Config.json"
import { Checkbox } from 'react-native-paper';
import CustomButton from "../Components/CustomButton";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import DropDownPicker from 'react-native-dropdown-picker';
import Api from "../api/Api";
import Urls from "../api/Urls";
import { useAppContext } from "../context";
import StatusCodes from "../api/StatusCodes";

export default SignUp = ({navigation}) => {
    let [fontsLoaded] = useFonts({Poppins_400Regular,  Poppins_700Bold})
	const [openDropdownSexe, setopenDropdownSexe] = useState(false);
	const [sexe, setSexe] = useState(null);
	const [items, setItems] = useState([
	  {label: 'Homme', value: 'male'},
	  {label: 'Femme', value: 'female'}
	]);
	const { updateisPersonalInfo } = useAppContext();
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

	const [nom, setNom] = useState("");
	const [username, setUsername] = useState("");
    const [accepted, setAccepted] = useState(false)
	const [errorCheck, setErrorCheck] = useState(false)
	const [error, setError] = useState({
		"nom":false,
		"username":false,
		"sexe":false,
		"birthday":false,
	})
	const [errorSend, setErrorSend] = useState(null)
	const [color, setColor] = useState("#FFF")
	const [loading, setLoading] = useState(false)
	const onPressSuivant = ()=>{
		let err = error
		if ( sexe === null ){ err = { ...err, "sexe":true }; setColor("#B100237F") }
		if ( nom === "" ){ err = { ...err, "nom":true } }
		if ( username === "" ){ err = { ...err, "username":true } }
		if ( date === null ){ err = { ...err, "birthday":true } }
		if ( ! accepted ) { setErrorCheck(true) }
		if ( err.birthday || err.nom || err.sexe || err.username || ! accepted ){
			setError(err)
		}else{
			setColor("#FFF")
			setLoading(true)
			let data = new FormData();
			data.append('full_name',nom)
			data.append('account_name',username)
			data.append('sex',sexe)
			data.append('birth_date',date)
			Api.post(Urls.ACCOUNT_SET_DATA,data).then(response=>{
				console.log(response.data);
				if ( response.data.code_type === StatusCodes.Success ){
					updateisPersonalInfo(nom, username ,sexe, date)
					setLoading(false);
					navigation.replace('/phoneotp')
				}else{
					setErrorSend(response.data.error)
					setLoading(false)
				}
			}).catch(err=>{
				setError("Erreur d'acces au serveur")
			})
		}
	}
	
	const [date, setDate] = useState(null)
	const [open, setOpen] = useState(false)
  
	return (
		<View style={styles.container}>
			<StatusBar barStyle='dark-content' backgroundColor={"#fff"} />
			<View style={styles.firstHalf}>
				<Image
					style={styles.logo}
					source={require("../../assets/icon.png")}
					resizeMode="contain"
				/>
				<Text style={styles.firstText}>Bienvenue à AppliVTC</Text>
			</View>
			<KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<ScrollView contentContainerStyle={styles.scrollView} style={styles.lastHalf} overScrollMode="never" nestedScrollEnabled={true} >
					<Text style={styles.secondText}>Veuillez introduire vos informations</Text>
					<View style={styles.inputView}>
						<CustomTextInput onchange={()=>setError({...error, nom:false})} label={"Nom complet"} value={nom} setValue={setNom} error={error.nom} />
						<CustomTextInput onchange={()=>setError({...error, username:false})} label={"Nom d'utilisateur"} value={username} setValue={setUsername} error={error.username} />
						<DropDownPicker
							open={openDropdownSexe}
							setOpen={setopenDropdownSexe}
							placeholder="Sexe"
							value={sexe}
							setValue={setSexe}
							items={items}
							onChangeValue={()=>{setError({...error, "sexe":false});setColor("#FFF")}}
							scrollViewProps={{decelerationRate:"fast"}}
							listMode="SCROLLVIEW"
							style={{borderColor:Config.darkGrey, borderRadius:5,backgroundColor:color}}
							setItems={setItems}							
						/>
						<CustomTextInput onchange={()=>setError({...error, birthday:false})} label={"Date de naissance"} value={date} setValue={setDate} error={error.birthday} />
					</View>
					<View style={styles.lastThird}>
						<Checkbox.Item label="J'accepte les T&C d'utilisation"  uncheckedColor={errorCheck?"#B10023":Config.lightBlue} status={accepted?"checked":"unchecked"} labelStyle={{textAlign:"center", fontFamily:"Poppins_400Regular", color:errorCheck?"#B10023":"#000"}} labelVariant="bodyLarge" onPress={()=>{setAccepted(!accepted), setErrorCheck(false)}} position="leading" color={Config.lightBlue} />
						{
							errorSend && <Text style={{color:Config.redError, fontSize:20, textAlign:"center"}}>{errorSend}</Text>
						}
						<View style={styles.ButtonView}>
							{
								loading?
								<View style={{width:"100%", backgroundColor:Config.lightBlue, borderRadius:10, height:50, display:"flex", justifyContent:"center", alignItems:"center"}} onTouchEnd={()=>setLoading(false)} ><ActivityIndicator size="large" color="#FFF" /></View>
								:
								<CustomButton
								fill={Config.lightBlue}
								text="Suivant"
								textColor="#FFF"
								fontSize={17}
								onPress={onPressSuivant}
							/>}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get("window").height,
		width: "100%",
        display:'flex',
        flexDirection:"column",
		backgroundColor:"#FFF"
	},
	firstHalf:{
		width:"100%",
		height: "25%",
		display:"flex",
		justifyContent:"flex-end",
		alignContent:"center",
		paddingBottom:20,
	},
	lastHalf:{
		width:"100%",
		flex:1
	},
	scrollView: {
		minHeight:"100%",
		marginTop:20,
		width:"100%",
		display:"flex",
		flexDirection:"column",
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	inputView: {
		position:"relative",
		alignSelf:"center",
		width: "80%",
        display:"flex",
		flexDirection:"column",
        gap:20,
	},
	firstText:{
        textAlign:"center",
        color:Config.lightBlue,
        fontWeight:"500",
        fontSize:30,
		fontFamily:"Poppins_700Bold"

    },
    secondText:{
        textAlign:"center",
        fontSize:17,
		fontFamily:"Poppins_400Regular"
    },
	ButtonView:{
		width:"100%",
		alignSelf:"center"
	},
    logo: {
		alignSelf:"center",
		width: "12%",
		backgroundColor:"#fff",
	},
	lastThird:{
		width:"80%",
		display:"flex",
		flexDirection:"column",
		gap:10,
		paddingBottom:50
	},
	TextButtonStyle:{
        fontSize:15,
		fontFamily:"Poppins_400Regular",
		color:Config.lightGrey,
    }
    
});
