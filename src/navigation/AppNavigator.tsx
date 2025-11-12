import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";

export default function AppNavigator() {
	const { user, loading } = useAuth();
	const { colors } = useTheme();

	if (loading) {
		return (
			<NavigationContainer>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: colors.background,
					}}
				>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</NavigationContainer>
		);
	}

	return (
		<NavigationContainer>
			{user ? <MainNavigator /> : <AuthNavigator />}
		</NavigationContainer>
	);
}
