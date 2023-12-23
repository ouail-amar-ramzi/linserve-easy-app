import { View, Text, StyleSheet, Dimensions, StatusBar, ScrollView, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import Config from '../../../Config.json'
import PaiementCard from "../../Components/PaiementCard"
import { useAppContext } from "../../context";

export default HistoriquePaiement = ({navigation}) => {
    const { user } = useAppContext();
    const onPressRetour = () =>{
        navigation.pop(1)
    }
	return (
		<View style={styles.container}>
            <StatusBar backgroundColor={"#FFF"} barStyle="dark-content" />
			<View style={styles.bigView}>
                <View style={styles.retourView}>
                    <Text style={styles.HistoriqueText}>Historique workspace</Text>
                    <Icon style={styles.icon} name="chevron-left"size={17} onPress={onPressRetour} />
                </View>
                <ScrollView style={styles.mainView} contentContainerStyle={{gap:10}} overScrollMode="auto">
                    {
                        user.workspace.lastPayements.length === 0?
                        <Text style={{width:"80%", alignSelf:"center", textAlign:"center", fontSize:20, fontWeight:"500", marginTop:"10%"}}>Aucun paiement a afficher</Text>
                        :
                        user.workspace.lastPayements.map((item, index)=>{
                            return(
                                <PaiementCard
                                    key={index}
                                    price={item.price}
                                    date={item.date}
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>
            <View style={styles.navBarView}>
                <NavBar focus={"3"} navigation={navigation}/>
            </View>
		</View>
	);
}
const styles = StyleSheet.create({
    container: {
		height: Dimensions.get("window").height,
		width: "100%",
        display:'flex',
        flexDirection:"column",
	},
    bigView:{
        height:"90%",
        width:"100%",
        backgroundColor:Config.lightGrey,
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
        backgroundColor:"#fff"
    },
    HistoriqueText:{
        width:"100%",
        textAlign:"center",
        fontSize:20,
    },
    icon:{
        position:"absolute",
        padding:20
    },
    mainView:{
        backgroundColor:Config.lightGrey,
        width:"100%",
        height:"90%"
    }
})