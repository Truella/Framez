import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

interface GradientHeaderProps {
	title: string;
}

export default function GradientHeader({ title }: GradientHeaderProps) {
	return (
		<LinearGradient
			colors={[colors.gradientStart, colors.gradientEnd]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 0 }}
			style={styles.header}
		>
			<Text style={styles.title}>{title}</Text>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	header: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#fff",
		letterSpacing: 0.5,
	},
});
