import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ThemeSwitcher() {
	const { setTheme, isDark ,colors} = useTheme();
	return (
		<TouchableOpacity onPress={() => setTheme(isDark ? "light" : "dark")}>
			{isDark ? (
				<AntDesign name="sun" size={24} color={colors.primary} />
			) : (
				<AntDesign name="moon" size={24} color={colors.primary} />
			)}
		</TouchableOpacity>
	);
}
