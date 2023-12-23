import { AppRegistry } from "react-native";
import AppVTC from "./src/AppVTC";
import { AppProvider } from './src/context'

export default function App() {
	return (
		<AppProvider>
			<AppVTC />
		</AppProvider>
	);
}
AppRegistry.registerComponent("main", () => App);