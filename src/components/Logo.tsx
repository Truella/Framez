import React from "react";
import { Image, View, StyleSheet } from "react-native";
export default function Logo() {
	return (
		<View style={styles.logoContainer}>
			<Image source={require("../../assets/Framez-logo.png")} style={styles.logo}/>
		</View>
	);
}
const styles = StyleSheet.create({
	logoContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: 50,
	},
	logo: {
		width: 150,
		height: 150,
	},
});