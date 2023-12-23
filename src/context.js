import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function useAppContext() {
	return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [ user, setUser ] = useState({
        "isAuth":"false",
        "user":{
            "accountID":'',
            "fullName":'',
            "userName":'',
            "sexe":'',
            "birthday":'',
            "rating":0,
            "phone":'',
            "email":'',
            "isDefaultProfilePicture":true,
            "profilePicture":null
        },
        "personalHistory":[],
        "isDriver":"false",
        "workspace":{
            "marque":'',
            "Modele":'',
            "Couleur":'',
            "Annee":'',
            "Matricule":'',
            "phonePro":'',
            "nextPayementPrice":'',
            "nextPayementDate":'',
            "lastPayements":[],
            "rating":0
        },
        "workspaceHistory":[]
    })
    const updateisAuth = (isAuth)=>{
        setUser({...user,"isAuth":isAuth})
    }
    const updateAccoutId = (accountId)=>{
        setUser({...user,"user":{...user?.user,"accountID":accountId}})
    }
    const updateisPersonalInfo = (fullName, userName, sexe, birthday)=>{
        setUser({...user,"user":{...user?.user, "fullName":fullName, "userName":userName, "sexe":sexe, "birthday":birthday }})
    }
    const updateisDriver = (isDriver)=>{
        setUser({...user,"isDriver":isDriver})
    }
    const updatePersonalHistory = (history)=>{
        setUser({...user,"personalHistory":history})
    }
    const updateWorkspaceHistory = (history)=>{
        setUser({...user,"workspaceHistory":history})
    }
    const updateWorkspaceInfo = (marque, modele, Couleur, Annee, Matricule)=>{
        setUser({...user,"workspace":{ ...user?.workspace, "marque":marque, "Modele":modele, "Couleur":Couleur, "Annee":Annee, "Matricule":Matricule, } })
    }
    const updatePersonalPhoneNumber = (phone)=>{
        setUser({...user,"user":{...user?.user,"phone":phone}})
    }
    const updateWorkspacePhoneNumber = (phone)=>{
        setUser({...user,"workspace":{...user?.workspace,"phonePro":phone}})
    }
    const updateRating = (rating)=>{
        setUser({...user,"user":{...user?.user,"rating":rating}})
    }
    const updateEmailAccoutIdProfilePic = (email, accountID, profilePicture)=>{
        setUser({...user,"idAuth":true,"user":{...user?.user,"accountID":accountID,"email":email, "profilePicture":profilePicture}})
    }
    const updateProfilePicture = (profilePic, isDefaultProfilePicture)=>{
        setUser({...user,"user":{...user?.user,"profilePicture":profilePic,"isDefaultProfilePicture":isDefaultProfilePicture}})
    }
    const updateAll = ( isAuth, accountID, fullName, userName, sexe, birthday, rating, personalPhone, email, isDriver, personalHistory, workspaceHistory, marque, modele, couleur, annee, matricule, workspacePhone, profilePic, nextDate, nextPrice, lastPayements, driverRating, isDefaultProfilePicture ) =>{
        setUser({
            "isAuth":isAuth,
            "user":{
                "accountID":accountID,
                "fullName":fullName,
                "userName":userName,
                "sexe":sexe,
                "birthday":birthday,
                "rating":rating,
                "phone":personalPhone,
                "email":email,
                "profilePicture":profilePic,
                "isDefaultProfilePicture":isDefaultProfilePicture
            },
            "personalHistory":personalHistory?personalHistory:[],
            "isDriver":isDriver?isDriver:"false",
            "workspace":{
                "marque":isDriver === "true"?marque:'',
                "Modele":isDriver === "true"?modele:'',
                "Couleur":isDriver === "true"?couleur:'',
                "Annee":isDriver === "true"?annee:'',
                "Matricule":isDriver === "true"?matricule:'',
                "phonePro":isDriver === "true"?workspacePhone:'',
                "nextPayementDate": isDriver === "true"?nextDate:'',
                "nextPayementPrice": isDriver === "true"?nextPrice:'',
                "lastPayements":isDriver === "true"?lastPayements:[],
                "rating":isDriver === "true"?driverRating:0
            },
            "workspaceHistory":isDriver === "true"?workspaceHistory:[]
        })
    }
    return (
		<AppContext.Provider value={{ user, updateAccoutId, updateAll, updateisAuth, updateisPersonalInfo, updateisDriver, updatePersonalHistory, updateWorkspaceHistory, updateWorkspaceInfo, updatePersonalPhoneNumber, updateWorkspacePhoneNumber, updateRating, updateEmailAccoutIdProfilePic, updateProfilePicture }}>
		    {children}
		</AppContext.Provider>
	);
}
