import { StyleSheet, View, Text, StatusBar, ScrollView, Dimensions, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import Config from "../../../Config.json";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { IconButton } from "react-native-paper";
import NavBar from "../../Components/NavBar";
import { useAppContext } from "../../context";
import Api from "../../api/Api";
import Urls from "../../api/Urls";
import StatusCodes from "../../api/StatusCodes";
import * as ImagePicker from 'expo-image-picker';
import ErrorAlert from "../../Components/ErrorAlert";
// import socket from "../../api/socket"
import SocketIOClient from 'socket.io-client';
const socket = SocketIOClient('http://waft-dz.com/main_service', {
  transports: ['websocket'] // you need to explicitly tell it to use websockets.
  
});

export default Profile = ({navigation}) => {
	const { user, updateProfilePicture } = useAppContext();
	let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
	const [error, setError] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [deleting, setDeleting] = useState(false)
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
	// useEffect(()=>{
	// 	socket.on("connect_response",(response)=>{
	// 		console.log("OK");
	// 		console.log(response);
	// 	})
	// },[])
	useEffect(()=>{

	},[user, user.user.profilePicture])
	const onPressEditIcon = ()=>{
		const uploadAndUpdateProfilePic = async ( image )=>{
			setUploading(true);
			await Api.post(Urls.ACCOUNT_SET_ICON+"?data_type=base64",{
				account_icon_base64:image,
				data_type:"base64",
			}).then(response=>{	
				if ( response.data.code_type === StatusCodes.Success ){
					updateProfilePicture(image, false);
				}else{
					console.log(response.data);
					setError(true)
				}
			}).catch(err=>{
				console.log(err);
				setError(true)
			})
			setUploading(false)
		}
		selectImage(uploadAndUpdateProfilePic)
	}
	const onPressPersonalData = ()=>{
		navigation.navigate("/profile/personal-info")
	}
	const onPressPersonalHistory = ()=>{
		navigation.navigate("/profile/personal-historique")
	}
	const onPressWorkspaceData = ()=>{
		navigation.navigate("/profile/workspace-info")
	}
	const onPressWorkspaceHistory = ()=>{
		navigation.navigate("/profile/workspace-historique")
	}
	const onPressHistoriquePaiement = ()=>{
		navigation.navigate("/profile/workspace-paiement-history")
	}
	const onPressLangue = ()=>{
		socket.connect()
		console.log("socket.connected");
		console.log(socket.connected);
	}
	const onPressTC = ()=>{
		console.log("OK");
		socket.emit("coucouRamzi","coucou")
	}
	const onPressLogOut = async ()=>{
		Api.get(Urls.ACCOUNT_SIGNOUT).then(response=>{
			if ( response.data.code_type === StatusCodes.Success ){
				navigation.replace("/")
			}
		})
	}
	const onPressDeleteIcon = () =>{
		setDeleting(true)
		Api.delete(Urls.ACCOUNT_DELETE_ICON).then(response=>{
			if ( response.data.code_type === StatusCodes.Success ){
				Api.get(`${Urls.ACCOUNT_GET_ICON}/${response.data.account_id}?data_type=base64`).then(response2=>{
					setDeleting(false)
					updateProfilePicture(response2.data.base64_data,true)
				}).catch(err=>{
					setError(true)
					setDeleting(false)
				})
			}else{
				setError(true)
				setDeleting(false)
			}
		}).catch(err=>{
			setError(true)
			setDeleting(false)
		})
	}
	return (
		<>
			<ErrorAlert errorMessage="Erreur de connexion au serveur" visible={error} setVisible={setError}/>
			<View style={styles.container}>
				<StatusBar barStyle="default" backgroundColor={Config.lightBlue}/>
				<View style={styles.firstPart}>
					<View style={styles.imageAndName}>
						<View style={styles.imageView}  >
							<Image
								source={{uri:user.user.profilePicture}}
								resizeMode="contain"
								style={styles.picture}
							/>
							{
								! user.user.isDefaultProfilePicture &&
								<>
									{
										deleting?
										<ActivityIndicator
											style={{...styles.deleteButton, transform: [{ translateY: 3 }, { translateX: -4 }]}}
											color={Config.lightBlue}
											size={30}
										/>
										:
										<IconButton
											icon="delete"
											style={{...styles.deleteButton, transform: [{ translateY: 10 }, { translateX: -10 }]}}
											iconColor={Config.lightBlue}
											size={15}
											onPress={onPressDeleteIcon}
										/>
									}
								</>
							}
							{
								uploading?
								<ActivityIndicator
									style={{...styles.editButton, transform: [{ translateY: 3 }, { translateX: 0 }]}}
									color={Config.lightBlue}
									size={30}
								/>
								:
								<IconButton
									icon="pen"
									style={{...styles.editButton, transform: [{ translateY: 10 }, { translateX: 10 }]}}
									iconColor={Config.lightBlue}
									size={15}
									onPress={onPressEditIcon}
								/>
							}
						</View>
						<View>
							<Text style={styles.nameText}>{user.user.fullName}</Text>
							<Text style={styles.userText}>{"@"+user.user.userName}</Text>
						</View>
					</View>
					<View style={styles.Rating}>
						<Text style={styles.ratingText}>{user.user.rating}</Text>
						<Icon name="star" color="#FFE70F" size={25} />
					</View>
				</View>
				<ScrollView style={styles.secondPart} >
					<View style={styles.accSettings}>
						<Text style={styles.titleText}>Paramètres du comptes</Text>
						<View style={styles.buttonContainer}>
							<TouchableOpacity style={styles.button} onPress={onPressPersonalData}>
								<Text style={styles.buttonText}>Mes données personnelles</Text>
								<Icon name="chevron-right"size={17}  />
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={onPressPersonalHistory}>
								<Text style={styles.buttonText}>Historique des courses</Text>
								<Icon name="chevron-right"size={17} />
							</TouchableOpacity>
						</View>
					</View>
					{
						user.isDriver === 'true'?
						<View style={{ width: "100%", height: 10, backgroundColor: Config.lightGrey, marginBottom:30,}}></View>
						:
						null
					}
					{
						user.isDriver === 'true'?
						<View style={styles.workspaceAccSettings}>
							<Text style={styles.titleText}>Paramètres du comptes</Text>
							<View style={styles.buttonContainer}>
								<TouchableOpacity style={styles.button} onPress={onPressWorkspaceData}>
									<Text style={styles.buttonText}>Mes données workspace</Text>
									<Icon name="chevron-right"size={17} />
								</TouchableOpacity>
								<TouchableOpacity style={styles.button} onPress={onPressWorkspaceHistory}>
									<Text style={styles.buttonText}>Historique workspace</Text>
									<Icon name="chevron-right"size={17} />
								</TouchableOpacity>
								<TouchableOpacity style={styles.button} onPress={onPressHistoriquePaiement}>
									<Text style={styles.buttonText}>Historique de paiement</Text>
									<Icon name="chevron-right"size={17} />
								</TouchableOpacity>
							</View>
						</View>
						:
						null
					}
					<View style={{ width: "100%", height: 10, backgroundColor: Config.lightGrey, marginBottom:30,}}></View>
					<View style={styles.options}>
						<Text style={styles.titleText}>Paramètres du comptes</Text>
						<View style={styles.buttonContainer}>
							<TouchableOpacity style={styles.button} onPress={onPressLangue}>
								<Text style={styles.buttonText2}>Langue</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={onPressTC}>
								<Text style={styles.buttonText2}>Termes et conditions</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={onPressLogOut}>
								<Text style={{ ...styles.buttonText2, color: "#DD0606",}}>Se déconnecter</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
				<View style={styles.navBarView}>
					<NavBar focus={"3"} navigation={navigation}/>
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
        flexDirection:"column"
	},
	firstPart: {
		height: "40%",
		width: "100%",
		backgroundColor: Config.lightBlue,
		display: "flex",
		flexDirection: "column",
		gap: -20,
		justifyContent: "flex-end",
		paddingBottom: 15,
	},
	imageAndName: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		gap: 20,
	},
	picture: {
		aspectRatio:1,
		borderRadius:100,
		height: "100%",
		alignSelf: "center",
	},
	userText: {
		textAlign: "center",
		color: "#fff",
		fontSize: 17,
		fontFamily: "Poppins_400Regular",
	},
	nameText: {
		textAlign: "center",
		color: "#fff",
		fontSize: 22,
		fontFamily: "Poppins_700Bold",
	},
	ratingText: {
		fontFamily: "Poppins_400Regular",
		color: "#fff",
		fontSize: 25,
		width: "auto",
		fontWeight: "700",
	},
	ratingStar: {
		height: 25,
		width: 25,
	},
	Rating: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
	editButton: {
		position: "absolute",
		bottom: 0,
		right: 0,
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 20,
	},
	deleteButton: {
		position: "absolute",
		bottom: 0,
		left: 0,
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 20,
	},
	imageView: {
		position: "relative",
		height: "50%",
		alignSelf: "center",
	},
	secondPart: {
		height:"50%",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		backgroundColor:"#fff",
	},
	accSettings: {
		paddingTop:30,
		width: "85%",
		alignSelf: "center",
		display: "flex",
		flexDirection: "column",
		gap: 10,
		marginBottom:15,
	},
	workspaceAccSettings: {
		width: "85%",
		alignSelf: "center",
		display: "flex",
		flexDirection: "column",
		gap: 10,
		marginBottom:15,
	},
	
	titleText: {
		color: Config.darkGrey,
		fontFamily: "Poppins_400Regular",
		fontSize: 14,
	},
	options: {
		width: "85%",
		alignSelf: "center",
		display: "flex",
		flexDirection: "column",
		gap: 10,
		paddingBottom:10,
	},
	button: {
		borderRadius: 0,
		width: "100%",
        display:"flex",
        flexDirection:"row",
		height:40,
        justifyContent:"space-between",
		alignItems: "center",
	},
	buttonText: {
        flex:1,
        textAlign: "left",
		fontFamily: "Poppins_400Regular",
		fontSize: 16,
	},
	buttonText2: {
        width:"100%",
        textAlign: "left",
		fontFamily: "Poppins_400Regular",
		fontSize: 16,
	},
	buttonContainer: {
		display: "flex",
		flexDirection: "column",
		gap: 10,
	},
	navBarView:{
        height:"10%",
    },
});
