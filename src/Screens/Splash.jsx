import React, { useEffect, useState } from "react";
import { SafeAreaView, ImageBackground, View, StyleSheet, Text, Dimensions, Image, StatusBar, ActivityIndicator } from "react-native";
import CustomButton from "../Components/CustomButton";
import Config from '../../Config.json'
import { useFonts, Poppins_400Regular,  Poppins_700Bold} from '@expo-google-fonts/poppins';
import { useAppContext } from "../context";
import Api from "../api/Api";
import Urls from "../api/Urls";
import StatusCodes from "../api/StatusCodes";

export default Splash = ({navigation}) => {
    const { updateAll, updateEmailAccoutIdProfilePic } = useAppContext();
    let [fontsLoaded] = useFonts({Poppins_400Regular,  Poppins_700Bold})
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
    const onPressStart = async ()=>{
        // await Api.get(Urls.ACCOUNT_SIGNOUT).then(async()=>{
        setLoading(true)
        await Api.get( Urls.ACCOUNT_GET_DATA ).then(response=>{
            if ( response.data.code_type === StatusCodes.Success ){
                console.log(response.data);
                if ( response.data.is_authenticated ){
                    if( response.data.account_is_configured ) {
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
                    } else {
                        Api.get(`${Urls.ACCOUNT_GET_ICON}/${response.data.account_id}`).then((response2)=>{
                            updateEmailAccoutIdProfilePic(response.data.account_email, response.data.account_id,response2.data.base64_data)
                            navigation.replace('/signup')
                        })
                    }
                } else {
                    navigation.replace('/welcome')
                }
            }else{
                console.log(response.data);
                setLoading(false);
                setError(true)
            }
        }).catch(err=>{
            console.log(err);
            setLoading(false);
            setError(true)
        })
    // })
    }
    return (
        <View style={styles.container}>
			<StatusBar barStyle="light-content" />
            <ImageBackground source={require("../../assets/SplashImage.png")} resizeMode="cover" style={styles.image}>
                <View style={styles.firstHalf}>
                    <Image
                        style={styles.logo}
                        source={require("../../assets/favicon.png")}
                        resizeMode="contain"
                    />
                    <Text style={styles.mainText}>AppliVTC</Text>
                </View>
                <View style={styles.lastHalf}>
                    <Text style={styles.secondaryText}>Arrivez à votre destination en un clique</Text>
                    {
                        error?
                        <Text style={{color:Config.redError, fontSize:20, textAlign:"center", fontWeight:"bold"}}>Un probleme est survenu, veuillez reessayer plus tard</Text>
                        :
                        null
                    }
                    {
                        loading?
                        <View style={{height:50,backgroundColor:Config.lightBlue, width:"100%",borderRadius:10, display:"flex", justifyContent:"center"}}>
                            <ActivityIndicator color="#FFF" size={35} />
                        </View>
                        :
                        <CustomButton
                            fill={Config.lightBlue}
                            fontSize={15}
                            onPress={onPressStart}
                            text="C'est Parti!"
                            textColor="#FFF"
                        />
                    }
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
		height: Dimensions.get("window").height,
		width: "100%",
	},
    image: {
        height:"100%",
    },
    logo:{
        width:"40%",
    },
    firstHalf:{
        width:"100%",
        height:Dimensions.get('window').height * 0.5,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"flex-end",
        gap:20,
    },
    lastHalf:{
        display:"flex",
        justifyContent:"flex-end",
        width:"70%",
        marginLeft:"15%",
        paddingBottom:"10%",
        gap:40,
        height:Dimensions.get('window').height * 0.5
    },
    mainText:{
        color:"#fff",
        fontSize:47.,
        fontWeight:"bold",
        fontFamily:"Poppins_400Regular"
    },
    secondaryText:{
        color:"#fff",
        textAlign:"center",
        fontSize:20,
        fontWeight:"400",
        fontFamily:"Poppins_400Regular"
    },    
});
