import { SafeAreaView, StyleSheet, View, Dimensions, Image, Text, StatusBar, ActivityIndicator } from "react-native";
import CustomButton from "../Components/CustomButton";
import Config from "../../Config.json";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import ErrorAlert from "../Components/ErrorAlert";
import { useAppContext } from "../context";
import Api from "../api/Api";
import Urls from "../api/Urls";

export default AddPicture = ({navigation}) => {
	const {user, updateProfilePicture} = useAppContext()
	let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
	const [disabled, setDisabled] = useState([false, false])
	const [profilePic, setProfilePic] = useState(require("../../assets/Profile.png"))
	const Name = user.user.fullName;
	const Email = user.user.email;
	const [error, setError] = useState(false)
	const [uploading, setUploading] = useState(false)
	const selectImage = async ( setImage ) =>{
		let result;
		const options = {
		  mediaTypes: ImagePicker.MediaTypeOptions.Images,
		  base64:true
		}
		await ImagePicker.requestMediaLibraryPermissionsAsync();
		result =  await ImagePicker.launchImageLibraryAsync(options)
		if ( ! result.canceled ){
		  setImage(`data:image/${result.assets[0].uri.split('.').reverse()[0]};base64,`+result.assets[0].base64)
		}
	}
	
	const handleAddPhoto = ()=>{
		setDisabled([false, true])
		const uploadAndUpdateProfilePic = async ( image )=>{
			setUploading(true);
			await Api.post(Urls.ACCOUNT_SET_ICON+"?data_type=base64",{
				account_icon_base64:image,
				data_type:"base64"
			}).then(response=>{	
				if ( response.data.code_type === StatusCodes.Success ){
					updateProfilePicture(image, false);
					navigation.navigate("/vtc")
				}else{
					console.log(response.data);
					setDisabled([false, false])
					setError(true)
				}
			}).catch(err=>{
				console.log(err);
				setDisabled([false, false])
				setError(true)
			})
			setUploading(false)
		}
		selectImage(uploadAndUpdateProfilePic)
	}

	const handleIgnoreAddPhoto = ()=>{
		console.log(user.user.profilePicture);
		// setDisabled([true, false])
		// navigation.navigate("/vtc")
	}
	return (
		<>
			<ErrorAlert errorMessage="Erreur de connexion au serveur" visible={error} setVisible={setError}/>
			<View style={styles.container}>
				<StatusBar barStyle="dark-content" backgroundColor="#fff" />
				<View style={styles.infoContainer}>
					<Image
						style={styles.logo}
						source={require("../../assets/icon.png")}
						resizeMode="contain"
					/>
					<Image source={{uri:user.user.profilePicture}} style={styles.profileImage} resizeMode="center"/>
					<View style={styles.textContainer}>
						<Text style={styles.nameText}>{Name}</Text>
						<Text style={styles.emailText}>{Email}</Text>
					</View>
				</View>
				<View style={styles.buttonsContainer}>
					{
						uploading?
						<ActivityIndicator
							style={styles.editButton}
							color="#FFF"
							size={30}
						/>
						:
						<CustomButton
							disabled={disabled[0]}
							fontSize={15}
							text="Ajouter une photo"
							textColor="#FFF"
							fill={Config.lightBlue}
							onPress={handleAddPhoto}
							/>
						}
					<CustomButton
						disabled={disabled[1]}
						fontSize={15}
						text="Ignorer"
						textColor={Config.lightBlue}
						fill="#FFF"
						onPress={handleIgnoreAddPhoto}
					/>
				</View>
			</View>
		</>
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
	infoContainer: {
		width: "100%",
        height:"65%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:10
	},
	profileImage: {
        width:"40%",
        height:"40%",
        alignSelf:"center",
    },
	buttonsContainer: {
		width: "70%",
        height:"35%",
		alignSelf: "center",
		display: "flex",
		flexDirection: "column",
        justifyContent:"center",
		alignItems:"center",
		gap: 10,
	},
    nameText:{
        fontFamily:"Poppins_700Bold",
        fontSize:20,
        textAlign:"center"
    },
    emailText:{
        fontFamily:"Poppins_400Regular",
        fontSize:15,
        textAlign:"center"
    },
    logo: {
		alignSelf: "center",
		width: "12%",
	},
    textContainer:{
        display:"flex",
        flexDirection:"column",
        gap:10
    },
	editButton: {
		height:50,
		width:"100%",
		alignSelf: "center",
		backgroundColor: Config.lightBlue,
		borderRadius: 10,
	},
	
});
