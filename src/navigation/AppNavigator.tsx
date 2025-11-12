import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
	const { user, loading } = useAuth();
	const { colors } = useTheme();
	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	return (
			<NavigationContainer>
				{user ? <MainNavigator /> : <AuthNavigator />}
			</NavigationContainer>
	);
}
