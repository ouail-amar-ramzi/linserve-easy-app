import { StyleSheet, Text, View, StatusBar, Dimensions, SafeAreaView, Image, ActivityIndicator, KeyboardAvoidingView, Keyboard, ScrollView, BackHandler } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import NavBar from '../../Components/NavBar'
import Config from "../../../Config.json"
import CustomButton from "../../Components/CustomButton"
import { useAppContext } from '../../context'
import Api from "../../api/Api"
import Urls from "../../api/Urls"
import DropDownPicker from "react-native-dropdown-picker";
import CustomTextInput from '../../Components/CustomTextInput'

export default ProcessingRequest = ({navigation}) => {
    const { user } = useAppContext();
    const [step, setStep] = useState("Start")
    const [loading, setLoading] = useState(false)
    const [loadingSendInfo, setLoadingSendInfo] = useState(false)
    const [error1, setError1] = useState(null)
    const scrollViewRef = useRef(null);
    const [dataLoaded, setDataLoaded] = useState(null);
    const [errorSend, setErrorSend] = useState(null)
    const [error, setError] = useState({
        "marque":false,
        "modele":false,
        "annee":false,
        "couleur":false,
        "matricule":false
    })
    const [marque, setMarque] = useState("")
    const [openDropdownMarque, setopenDropdownMarque] = useState(false);
	
    const [modele, setModele] = useState("")
    const [openDropdownModele, setopenDropdownModele] = useState(false);
    
    const [couleur, setCouleur] = useState("")
    const [openDropdownCouleur, setopenDropdownCouleur] = useState(false);
    
    const [annee, setAnnee] = useState("")
    const [openDropdownAnnee, setopenDropdownAnnee] = useState(false);
    
    const [matricule, setMatricule] = useState("")
    const handleBackButton = ()=>{
        if ( step === "Start" ){
            navigation.replace("/vtc")                
        } else if ( step === "Edit Info" ){
            setStep("Start");
        }
        return true
    }
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
    },[loading])
    const onPressEditInfo = () =>{
        setLoading(true)
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
                Api.get(Urls.DRIVER_GET_DATA).then(response2=>{
                    console.log(response2.data);
                    if ( response2.data.code_type ){
                        setAnnee(response2.data.driver_car_year);
                        setCouleur(response2.data.driver_car_color);
                        setMarque(response2.data.driver_car_brand);
                        setModele(response2.data.driver_car_model);
                        setMatricule(response2.data.driver_car_registration_number);
                        setLoading(false)
                        setStep("Edit Info")
                    } else {
                        setError1(response2.data.error)
                        setLoading(false)
                    }
                }).catch(err2=>{
                    setError1(err2.message)
                    setLoading(false)
                })
            }
        }).catch(err=>{
            console.log(err);
            setLoading(false)
        })
    }
    const handleSave = () =>{
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
            Api.post(Urls.EDIT_DRIVER_INFO,data).then(response=>{
                if ( response.data.code_type === StatusCodes.Success ){
                    setLoadingSendInfo(true)
                    setStep("Start")
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
    return (
        <View style={styles.container}>
			<StatusBar barStyle="default" backgroundColor={Config.lightBlue} />
            <View style={styles.mainTitleView} >
                <Text style={styles.mainTitleText}>Workspace</Text>
            </View>
            <View style={styles.mainView}>
                {
                    step === "Start" &&
                    <>
                        <Text style={styles.progressing}>Nous traitons votre demande</Text>
                        {
                            error1 &&
                            <Text style={{width:"80%", alignSelf:"center", textAlign:"center",fontSize:20, color:Config.redError}}>{error1}</Text>
                        }
                        <View style={{width:"80%", alignSelf:"center"}}>
                            {
                                loading?
                                <View style={{backgroundColor:Config.lightBlue, borderRadius:10, height:50, display:"flex", justifyContent:"center"}}>
                                    <ActivityIndicator color="#FFF" size={30} />
                                </View>
                                :
                                <CustomButton
                                    text="Modifier votre demande"
                                    fill={Config.lightBlue}
                                    fontSize={15}
                                    textColor="#FFF"
                                    onPress={onPressEditInfo}
                                />
                            }
                        </View>
                    </>
                }
                {
                    step === "Edit Info" &&
                    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                        <ScrollView ref={scrollViewRef} contentContainerStyle={{...styles.mainView1,flex:!dataLoaded?1:( (openDropdownAnnee||openDropdownCouleur||openDropdownMarque||openDropdownModele)? 1:null )}}>
                            <Text style={{fontSize:20, width:"80%", alignSelf:"center", textAlign:"center", fontWeight:"700"}}>Modifier les informations de votre véhicule</Text>
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
                                            onPress={handleSave}
                                            text="Suivant"
                                            textColor="#FFF"
                                        />
                                    }
                                </View>
                            }
                        </ScrollView>
                    </KeyboardAvoidingView>
                    
                }
            </View>
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
    mainView1:{
        paddingTop:"5%",
        backgroundColor:"#FFF",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        gap:20
    },
    nextButtonView:{
        width:"80%",
        alignSelf:"center",
        paddingBottom:10
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
        justifyContent:"space-evenly",
        gap:20
    },
    progressing:{
        width:"80%",
        alignSelf:"center",
        textAlign:"center",
        textAlignVertical:"center",
        lineHeight:45,
        fontSize:25,
        fontWeight:"700",
        backgroundColor:"#FFF",
    },
    inputsView:{
        width:"85%",
        alignSelf:"center",
        display:"flex",
        flexDirection:"column",
        gap:15,
        marginTop:"10%"
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