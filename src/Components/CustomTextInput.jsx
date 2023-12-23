import { TextInput } from 'react-native-paper';
import Config from "../../Config.json"
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

const CustomTextInput = ({label, value, setValue, error, onchange, number, center, disabled}) => {
	let [fontsLoaded] = useFonts({Poppins_400Regular,  Poppins_700Bold})
	return (
		<TextInput
			onChange={onchange?onchange:()=>{}}
			error={error?true:false}
			label={label}
			textAlign={center?'center':"left"}
			value={value}
			selectionColor={Config.lightBlue}
			cursorColor={Config.darkGrey}	
			activeUnderlineColor={Config.darkGrey}
			outlineStyle={{borderColor:Config.darkGrey}}
			contentStyle={{fontFamily:"Poppins_400Regular"}}
			theme={{ colors: { primary: Config.darkGrey, outline: Config.darkGrey, background:"#fff" } }}
			outlineColor={Config.darkGrey}
			onChangeText={value => setValue(value)}
			keyboardType={number?'phone-pad':"default"}
			mode='outlined'
			disabled={disabled?disabled:null}
	  	/>
	);

  };
  
  export default CustomTextInput;