import { useState, useEffect } from 'react'
import { useAppContext } from './context'

import SignUp from "./Screens/SignUp";
import Welcome from "./Screens/Welcome";
import Splash from "./Screens/Splash";
import Otp from "./Screens/Otp";
import AddPicture from "./Screens/AddPicture";
import Home from "./Screens/VTC/Home";

// Workspace
import Workspace from './Screens/Workspace/Workspace';

// Profile
import ProfileScreens from "./Screens/Profile/ProfileScreens"

import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


export default AppVTC = () => {
    const { user } = useAppContext()
	return (
        <NavigationContainer >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>

                {/* STARTING ROUTES */}
                <Stack.Screen name="/" component={Splash} />
                <Stack.Screen name="/welcome" component={Welcome} />
                <Stack.Screen name="/signup" component={SignUp} />
                <Stack.Screen name="/phoneotp" component={Otp} />
                <Stack.Screen name="/addprofilepic" component={AddPicture} />

                {/* WORKSPACE ROUTES */}
                <Stack.Screen name="/workspace" component={Workspace} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} />

                {/* PROFILE ROUTES */}
                <Stack.Screen name="/profile" component={ProfileScreens.Main} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} />
                <Stack.Screen name="/profile/personal-info" component={ProfileScreens.PersonalInfo} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} />
                <Stack.Screen name="/profile/personal-historique" component={ProfileScreens.HistoriquePersonal} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} />
                <Stack.Screen name="/profile/workspace-historique" component={ProfileScreens.HistoriqueWorkspace} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} />
                <Stack.Screen name="/profile/workspace-paiement-history" component={ProfileScreens.HistoriquePaiement} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} />
                <Stack.Screen name="/profile/workspace-info" component={ProfileScreens.WorkspaceInfo} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} />
                 
                {/* VTC ROUTES */}
                <Stack.Screen name="/vtc" component={Home} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} />
                {/* <Stack.Screen name="/" component={Home} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}} /> */}

            </Stack.Navigator>
        </NavigationContainer>
  )
}