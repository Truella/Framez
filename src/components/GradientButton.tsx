import React from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

interface GradientButtonProps {
	title: string;
	onPress: () => void;
	disabled?: boolean;
	loading?: boolean;
	style?: any;
}

export default function GradientButton({
	title,
	onPress,
	disabled = false,
	loading = false,
	style,
}: GradientButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled || loading}
			style={[styles.container, style]}
			activeOpacity={0.8}
		>
			<LinearGradient
				colors={[colors.gradientStart, colors.gradientEnd]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={[styles.gradient, (disabled || loading) && styles.disabled]}
			>
				{loading ? (
					<ActivityIndicator color="#fff" />
				) : (
					<Text style={styles.text}>{title}</Text>
				)}
			</LinearGradient>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 25,
		overflow: "hidden",
	},
	gradient: {
		paddingVertical: 15,
		paddingHorizontal: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	disabled: {
		opacity: 0.5,
	},
	text: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
});
