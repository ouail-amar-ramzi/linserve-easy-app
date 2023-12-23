import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Config from "../../Config.json";

const ErrorAlert = ({ errorMessage, visible, setVisible }) => {
	useEffect(() => {}, [visible]);
	return (
		<View
			style={{
				...styles.centeredView,
				display: visible ? "flex" : "none",
			}}
		>
			<Modal
				animationType="fade"
				transparent={true}
				visible={visible}
				onRequestClose={() => {
					setVisible(!visible);
				}}
			>
				<View style={styles.centeredView}>
					<Text style={styles.textStyle}>{errorMessage}</Text>
					<TouchableOpacity
						onPress={() => setVisible(false)}
						style={styles.buttonView}
					>
						<Icon name="close" style={styles.button} size={20} />
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		width: (Dimensions.get("window").width * 5) / 8,
		marginTop:
			(Dimensions.get("window").height -
				(Dimensions.get("window").height * 5) / 8) /
			2,
		marginLeft:
			(Dimensions.get("window").width -
				(Dimensions.get("window").width * 5) / 8) /
			2,
		position: "absolute",
		justifyContent: "center",
		display: "flex",
		alignContent: "center",
		backgroundColor: "white",
		borderRadius: 20,
		padding: 10,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	buttonView: {
		width: 30,
		height: 30,
		backgroundColor: Config.redError,
		position: "absolute",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		top: 0,
		right: 0,
		transform: [
			{
				translateX: 15,
			},
			{
				translateY: -15,
			},
		],
	},
	textStyle: {
		color: "#000",
		fontSize: 20,
		textAlign: "center",
	},
});

export default ErrorAlert;
